import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import {getUserIdFromRequest} from "@/lib/auth";

export async function DELETE(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({error: "کاربر احراز هویت نشده است."}, {status: 401});

        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);

        await prisma.cartItem.delete({where: {id}});
        return NextResponse.json({message: "محصول از سبد خرید شما حذف شد."}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "مشکلی پیش آمده است."}, {status: 500});
    }
}

export async function PUT(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({error: "کاربر احراز هویت نشده است."}, {status: 401});

        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);

        const body = await req.json();
        const {qty} = body;

        const existingItem = await prisma.cartItem.findUnique({
            where: {id},
            include: {cart: true},
        });

        if (!existingItem || existingItem.cart.userId !== userId) {
            return NextResponse.json({error: "دسترسی غیرمجاز."}, {status: 403});
        }
        const updatedItem = await prisma.cartItem.update({
            where: {id},
            data: {quantity: qty},
        });

        return NextResponse.json(updatedItem, {status: 200});
    } catch (error) {
        console.error("Error updating cart item:", error);
        return NextResponse.json({error: "خطا در بروزرسانی آیتم سبد خرید."}, {status: 500});
    }
}