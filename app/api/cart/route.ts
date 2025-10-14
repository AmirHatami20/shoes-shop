import {NextRequest, NextResponse} from "next/server";
import {getUserIdFromRequest} from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({error: "کاربر احراز هویت نشده است."}, {status: 401});

        const {productId, color, size, quantity} = await req.json();

        if (!productId || !color || !size || !quantity) {
            return NextResponse.json({error: "همه فیلدها را پر کنید."}, {status: 400});
        }

        let cart = await prisma.cart.findUnique({
            where: {userId},
            include: {items: true}
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: {userId},
                include: {items: true}
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.productId === productId &&
                item.color === color &&
                item.size === size
        );

        if (existingItem) {
            const updatedItem = await prisma.cartItem.update({
                where: {id: existingItem.id},
                data: {quantity: existingItem.quantity + quantity},
                include: {
                    product: {
                        include: {
                            category: true,
                            brand: true,
                            colors: {include: {sizes: true, images: true}},
                        }
                    }
                }
            });
            return NextResponse.json(updatedItem, {status: 200});
        } else {
            const newItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    color,
                    size,
                    quantity
                },
                include: {
                    product: {
                        include: {
                            category: true,
                            brand: true,
                            colors: {include: {sizes: true, images: true}},
                        }
                    }
                }
            });
            return NextResponse.json(newItem, {status: 200});
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "مشکلی در افزودن به سبد خرید پیش آمده است."}, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({error: "کاربر احراز هویت نشده است."}, {status: 401});

        const cart = await prisma.cart.findUnique({
            where: {userId},
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                category: true,
                                brand: true,
                                colors: {include: {sizes: true, images: true}},
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(cart || {items: []}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "خطا در دریافت سبد خرید"}, {status: 500});
    }
}
