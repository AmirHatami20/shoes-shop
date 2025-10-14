import {NextRequest, NextResponse} from "next/server";
import {getUserIdFromRequest, getUserRoleFromRequest} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {CreateOrderPayload} from "@/types";

export async function GET(req: NextRequest) {
    try {
        const userId = getUserIdFromRequest(req);
        const role = getUserRoleFromRequest(req);

        if (!userId) return NextResponse.json({error: "کاربر احراز هویت نشده است."}, {status: 401});

        const {searchParams} = new URL(req.url);

        const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
        const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 10;
        const skip = (page - 1) * limit;

        const where = role === "admin" ? {} : {userId};

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: {include: {brand: true, category: true}},
                        },
                    },
                    shippingAddress: true,
                    user: role === "admin",
                },
                skip,
                take: limit,
                orderBy: {createdAt: "desc"},
            }),
            prisma.order.count({where}),
        ]);

        return NextResponse.json({
            data: orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "خطا در دریافت سفارشات"}, {status: 500});
    }
}


export async function POST(req: NextRequest) {
    try {
        const userId = getUserIdFromRequest(req)
        if (!userId) return NextResponse.json({error: "کاربر احراز هویت نشده است."}, {status: 401});

        const body: CreateOrderPayload = await req.json();

        if (!body.items || body.items.length === 0) {
            return NextResponse.json({error: "هیچ محصولی برای سفارش انتخاب نشده"}, {status: 400});
        }

        const totalPrice = body.items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);

        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice,
                status: "PENDING",
                items: {
                    create: body.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        finalPrice: item.finalPrice,
                    })),
                },
                shippingAddress: body.shippingAddress ? {create: body.shippingAddress} : undefined,
            },
            include: {
                items: true,
                shippingAddress: true,
            },
        });

        return NextResponse.json(order, {status: 201});
    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "خطا در ایجاد سفارش"}, {status: 500});
    }
}