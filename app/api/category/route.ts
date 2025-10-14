import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getUserRoleFromRequest} from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        // const role = getUserRoleFromRequest(req);
        //
        // if (role !== "admin") {
        //     return NextResponse.json({error: "شما دسترسی لازم را ندارید."}, {status: 403});
        // }

        const {name, slug, parentId} = await req.json();
        if (!name || !slug) {
            return NextResponse.json({error: "نام و اسلاگ الزامی است."}, {status: 400});
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                parentId: parentId || null,
            },
        });

        return NextResponse.json(category, {status: 201});
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json({error: "خطا در ایجاد دسته"}, {status: 500});
    }
}

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {parentId: null},
            include: {
                children: {
                    include: {
                        children: true,
                    },
                },
            },
        });


        return NextResponse.json(categories, {status: 200});
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({error: "خطا در دریافت دسته‌ها"}, {status: 500});
    }
}
