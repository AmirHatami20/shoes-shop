import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getUserRoleFromRequest} from "@/lib/auth";
import {uploadImage} from "@/lib/uploadImage";
import {Category, CategoryHierarchy} from "@/types";

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

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);

        const product = await prisma.product.findUnique({
            where: {id},
            include: {
                category: true,
                brand: true,
                colors: {
                    include: {
                        sizes: true,
                        images: true,
                    },
                },
            },
        });

        if (!product) return NextResponse.json({error: "محصول پیدا نشد"}, {status: 404});

        const allCategories = await prisma.category.findMany()

        const productWithCategories = {
            ...product,
            category: getCategoryHierarchy(product.categoryId, allCategories)
        }


        return NextResponse.json(productWithCategories, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "خطا در دریافت محصول"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        // const role = getUserRoleFromRequest(req);
        // if (role !== "admin") return NextResponse.json({error: "دسترسی ندارید"}, {status: 403});

        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);

        await prisma.product.delete({where: {id}});

        return NextResponse.json({message: "محصول حذف شد"}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "خطا در حذف محصول"}, {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);
        const formData = await req.formData();

        const name = formData.get("name")?.toString();
        const description = formData.get("description")?.toString();
        const price = formData.get("price") ? parseFloat(formData.get("price")!.toString()) : undefined;
        const discount = formData.get("discount") ? parseFloat(formData.get("discount")!.toString()) : undefined;
        const categoryId = formData.get("categoryId") ? parseInt(formData.get("categoryId")!.toString()) : undefined;
        const brandId = formData.get("brandId") ? parseInt(formData.get("brandId")!.toString()) : undefined;

        const product = await prisma.product.update({
            where: {id},
            data: {
                ...(name && {name}),
                ...(description && {description}),
                ...(price !== undefined && {price, finalPrice: price - (price * (discount || 0)) / 100}),
                ...(discount !== undefined && {discount}),
                ...(categoryId && {categoryId}),
                ...(brandId && {brandId}),
            },
        });

        const variantsStr = formData.get("variants")?.toString();
        if (!variantsStr) {
            return NextResponse.json({error: "رنگ ها و سایز ها الزامی است."}, {status: 400});
        }
        type VariantData = {
            color: string;
            sizes: { size: number; stock: number }[];
            newImages?: File[];
            existingImages?: string[];
        };

        const variants: VariantData[] = JSON.parse(variantsStr);

        variants.forEach((variant, colorIndex) => {
            const newFiles: File[] = [];
            const existingUrls: string[] = [];

            for (const [key, value] of formData.entries()) {
                if (key.startsWith(`color_${colorIndex}_image_`) && value instanceof File) {
                    newFiles.push(value);
                } else if (key.startsWith(`color_${colorIndex}_existing_`)) {
                    existingUrls.push(value.toString());
                }
            }

            variant.newImages = newFiles;
            variant.existingImages = existingUrls;
        });


        // Delete All (colors,images,sizes)
        await prisma.productImage.deleteMany({where: {productColor: {productId: id}}});
        await prisma.productSize.deleteMany({where: {productColor: {productId: id}}});
        await prisma.productColor.deleteMany({where: {productId: id}});

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

            // New Images
            if (variant.newImages?.length) {
                for (const file of variant.newImages) {
                    const url = await uploadImage(file);
                    await prisma.productImage.create({
                        data: {url, productColorId: colorRecord.id},
                    });
                }
            }

            // Prev Images
            if (variant.existingImages?.length) {
                for (const url of variant.existingImages) {
                    await prisma.productImage.create({
                        data: {url, productColorId: colorRecord.id}
                    })
                }
            }
        }

        return NextResponse.json(product, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "خطا در آپدیت محصول"}, {status: 500});
    }
}


