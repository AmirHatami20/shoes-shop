import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {getUserRoleFromRequest} from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        // const role = getUserRoleFromRequest(req);
        // if (role !== "admin") {
        //     return NextResponse.json({error: "شما دسترسی لازم را ندارید."}, {status: 403});
        // }

        const {name, slug} = await req.json();
        if (!name || !slug) {
            return NextResponse.json({error: "نام و اسلاگ الزامی است."}, {status: 400});
        }

        const brand = await prisma.brand.create({
            data: {name, slug},
        });

        return NextResponse.json(brand, {status: 201});
    } catch (error) {
        console.error("Error creating brand:", error);
        return NextResponse.json({error: "خطا در ایجاد برند"}, {status: 500});
    }
}

export async function GET() {
    try {
        const brands = await prisma.brand.findMany();
        return NextResponse.json(brands, {status: 200});
    } catch (error) {
        console.error("Error fetching brands:", error);
        return NextResponse.json({error: "خطا در دریافت برندها"}, {status: 500});
    }
}
