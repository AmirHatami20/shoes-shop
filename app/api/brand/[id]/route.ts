import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);

        const {name, slug} = await req.json();

        const brand = await prisma.brand.update({
            where: {id},
            data: {name, slug}
        })

        return NextResponse.json(brand, {status: 200});
    } catch (error) {
        console.error("Error updating brand:", error);
        return NextResponse.json({error: "خطا در بروزرسانی برند"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);

        await prisma.brand.delete({where: {id}});

        return NextResponse.json({message: "برند حذف شد"}, {status: 200});
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({error: "خطا در حذف برند"}, {status: 500});
    }
}