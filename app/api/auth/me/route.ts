import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getUserIdFromRequest} from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const userId = getUserIdFromRequest(req);
        if (!userId) return NextResponse.json({error: "ابتدا وارد حساب کاربری شوید."}, {status: 401});

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            return NextResponse.json({error: "کاربر یافت نشد."}, {status: 404});
        }

        return NextResponse.json(user, {status: 200});
    } catch (error) {
        console.error("Error fetching current user:", error);
        return NextResponse.json({error: "مشکلی در دریافت اطلاعات کاربر پیش آمد."}, {status: 500});
    }
}
