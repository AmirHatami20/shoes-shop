import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {Prisma} from "@prisma/client";
import {uploadImage} from "@/lib/uploadImage";
import {Category, CategoryHierarchy, ProductQueryParams} from "@/types";


async function getAllChildIds(categoryId: number): Promise<number[]> {
    const children = await prisma.category.findMany({
        where: {parentId: categoryId},
        select: {id: true},
    });

    const ids = children.map(c => c.id);
    for (const child of children) {
        ids.push(...await getAllChildIds(child.id));
    }

    return ids;
}

function getCategoryHierarchy(categoryId: number, allCategories: Category[]): CategoryHierarchy {
    const categories: Category[] = [];
    let currentCategory = allCategories.find((c) => c.id === categoryId);

    while (currentCategory) {
        categories.unshift(currentCategory);
        if (!currentCategory.parentId) break;
        currentCategory = allCategories.find((c) => c.id === currentCategory?.parentId);
    }

    return {
        mainCategory: categories[0] || null,
        parentCategory: categories[categories.length - 2] || null,
        finalCategory: categories[categories.length - 1] || null,
    };
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const name = formData.get("name")?.toString() || "";
        const description = formData.get("description")?.toString();
        const material = formData.get("material")?.toString();
        const price = parseFloat(formData.get("price")?.toString() || "0");
        const discount = parseFloat(formData.get("discount")?.toString() || "0");
        const categoryId = parseInt(formData.get("categoryId")?.toString() || "0", 10);
        const brandId = parseInt(formData.get("brandId")?.toString() || "0", 10);

        if (!name || !brandId || !categoryId || !price) {
            return NextResponse.json({error: "لطفا فیلد های الزامی را پر کنید."}, {status: 400});
        }

        const variantsStr = formData.get("variants")?.toString();
        if (!variantsStr) {
            return NextResponse.json({error: "رنگ ها و سایز ها الزامی است."}, {status: 400});
        }

        type VariantData = {
            color: string;
            sizes: { size: number; stock: number }[];
            images?: File[];
        };

        const variants: VariantData[] = JSON.parse(variantsStr);

        variants.forEach((variant, colorIndex) => {
            const files: File[] = [];
            for (const [key, value] of formData.entries()) {
                if (key.startsWith(`color_${colorIndex}_image_`) && value instanceof File) {
                    files.push(value);
                }
            }
            variant.images = files;
        });

        const product = await prisma.product.create({
            data: {
                name,
                description,
                material,
                price,
                discount,
                finalPrice: price - (price * discount) / 100,
                categoryId,
                brandId,
            },
        });

        for (const variant of variants) {
            const colorRecord = await prisma.productColor.create({
                data: {color: variant.color, productId: product.id},
            });

            // Sizes
            for (const size of variant.sizes) {
                await prisma.productSize.create({
                    data: {
                        size: size.size,
                        stock: size.stock,
                        productColorId: colorRecord.id,
                    },
                });
            }

            // Images
            if (variant.images?.length) {
                for (const file of variant.images) {
                    const url = await uploadImage(file);
                    await prisma.productImage.create({
                        data: {url, productColorId: colorRecord.id},
                    });
                }
            }
        }

        return NextResponse.json(product, {status: 201});
    } catch (error) {
        console.error("❌ Error creating product:", error);
        return NextResponse.json({error: "خطا در ایجاد محصول"}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        const {searchParams} = new URL(req.url);

        const params: ProductQueryParams = {
            search: searchParams.get("search") || undefined,
            categorySlug: searchParams.get("categorySlug") || undefined,
            brandSlug: searchParams.get("brandSlug") || undefined,
            page: searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1,
            limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10,
            sort: (searchParams.get("sort")) || "newest",
            size: searchParams.getAll("size[]").map(s => parseInt(s, 10)) || undefined,
            minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
            maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        }

        const where: Prisma.ProductWhereInput = {};

        if (params.search) {
            where.name = {contains: params.search, mode: "insensitive"};
        }

        if (params.brandSlug) {
            const brand = await prisma.brand.findFirst({
                where: {slug: params.brandSlug},
            });
            if (brand) where.brandId = brand.id;
        }

        if (params.categorySlug) {
            const category = await prisma.category.findFirst({
                where: {slug: params.categorySlug},
                select: {id: true},
            });

            if (category) {
                const childIds = await getAllChildIds(category.id);
                where.categoryId = {in: [category.id, ...childIds]};
            }
        }

        if (params.size && Array.isArray(params.size) && params.size.length > 0) {
            where.colors = {
                some: {
                    sizes: {
                        some: {
                            size: {in: params.size}
                        }
                    }
                }
            }
        }

        if (params.minPrice !== undefined || params.maxPrice !== undefined) {
            where.finalPrice = {};
            if (params.minPrice !== undefined) where.finalPrice.gte = params.minPrice;
            if (params.maxPrice !== undefined) where.finalPrice.lte = params.maxPrice;
        }

        let orderBy: Prisma.ProductOrderByWithRelationInput = {createdAt: "desc"};

        switch (params.sort) {
            case "price_asc":
                orderBy = {finalPrice: "asc"};
                break;
            case "price_desc":
                orderBy = {finalPrice: "desc"};
                break;
            case "discount_desc":
                orderBy = {discount: "desc"};
                break;
            case "bestseller":
                orderBy = {totalSells: "desc"};
                break;
            default:
                orderBy = {createdAt: "desc"};
        }

        const skip = (params.page! - 1) * params.limit!;

        const allCategories = await prisma.category.findMany();

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                    brand: true,
                    colors: {include: {sizes: true, images: true}},
                },
                skip,
                take: params.limit,
                orderBy,
            }),
            prisma.product.count({where}),
        ]);

        const productWithCategories = products.map((product) => ({
            ...product,
            category: getCategoryHierarchy(product.categoryId, allCategories),
        }));

        return NextResponse.json({
            data: productWithCategories,
            pagination: {
                total,
                page: params.page,
                limit: params.limit,
                totalPages: Math.ceil(total / params.limit!),
            },
        });
    } catch (error) {
        console.error("❌ Error fetching search:", error);
        return NextResponse.json(
            {error: "خطا در دریافت محصولات"},
            {status: 500}
        );
    }
}
