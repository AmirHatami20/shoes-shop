import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getUserRoleFromRequest} from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const role = getUserRoleFromRequest(req);

        if (role !== "admin") {
            return NextResponse.json({error: "شما دسترسی لازم را ندارید."}, {status: 403});
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(users, {status: 200});
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({error: "مشکلی در گرفتن لیست کاربران پیش آمد."}, {status: 500});
    }
}