import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {signToken} from "@/lib/auth";
import {cookies} from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {firstName, lastName, email, password} = body;

        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return NextResponse.json({error: "این ایمیل قبلا وجود داشته است."}, {status: 400});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
            },
        });

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
        });
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({error: "خطا در ورود به سایت"}, {status: 500});
    }
}