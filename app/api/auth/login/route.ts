import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/auth";
import {cookies} from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const {email, password} = await req.json();

        if (!email || !password) {
            return NextResponse.json({error: "ایمیل و رمز عبور الزامی است"}, {status: 400});
        }

        const user = await prisma.user.findUnique({where: {email}});

        if (!user) {
            return NextResponse.json({error: "این ایمیل در سایت وجود ندارد."}, {status: 401});
        }

        const isValid = bcrypt.compareSync(password, user.password);

        if (!isValid) {
            return NextResponse.json({error: "رمز عبور اشتباه است."}, {status: 401});
        }

        const token = signToken({id: user.id});

        (await cookies()).set("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 15
        });

        return NextResponse.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }, {status: 200});

    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({error: "خطا در ورود به سایت"}, {status: 500});
    }
}