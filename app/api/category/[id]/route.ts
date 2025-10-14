import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);
        const {name, slug, parentId} = await req.json();

        const category = await prisma.category.update({
            where: {id},
            data: {name, slug, parentId: parentId || null},
        });

        return NextResponse.json(category, {status: 200});
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({error: "خطا در بروزرسانی دسته"}, {status: 500});
    }
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id: idStr} = await params;
        const id = parseInt(idStr, 10);

        await prisma.category.delete({where: {id}});

        return NextResponse.json({message: "دسته حذف شد"}, {status: 200});
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({error: "خطا در حذف دسته"}, {status: 500});
    }
}
