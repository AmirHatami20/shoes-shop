'use server';

import {ReactNode} from "react";
import Header from "@/component/layout/Header";
import Footer from "@/component/layout/Footer";
import {categoryService} from "@/services/categoryService";
import {verifyToken} from "@/lib/auth";
import {cookies} from "next/headers";
import {authService} from "@/services/authService";

interface Props {
    children: ReactNode;
}

export default async function Layout({children}: Props) {
    const token = (await cookies()).get("access_token")?.value;
    const userId = token ? verifyToken(token)?.id : null;

    let user = null;
    if (userId) {
        user = await authService.getMe(token as string);
    }
    const categories = await categoryService.getAll();

    return (
        <main
            className="flex flex-col min-h-screen"
        >
            <Header categories={categories} user={user}/>
            <section className="flex-1">{children}</section>
            <Footer/>
        </main>
    );
}
