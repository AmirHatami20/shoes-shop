import {ReactNode} from "react";
import type {Metadata} from "next";
import Sidebar from "@/component/admin/Sidebar";
import Header from "@/component/admin/Header";
import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";
import {authService} from "@/services/authService";

export const metadata: Metadata = {
    title: "داشبورد ادمین | مدیریت",
};

export default async function Layout({children}: { children: ReactNode }) {
    const token = (await cookies()).get("access_token")?.value;
    const userId = token ? verifyToken(token)?.id : null;

    let user = null;
    if (userId) {
        user = await authService.getMe(token as string);
    }

    return (
        <main className="flex flex-col">
            <Sidebar user={user}/>
            <section className="flex-1 flex flex-col md:mr-64 min-h-screen overflow-y-auto">
                <Header/>
                <div className="flex-1 p-5">
                    {children}
                </div>
            </section>
        </main>
    )
}
