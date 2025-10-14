'use client';

import {ReactNode, useEffect, useState} from "react";
import Sidebar from "@/component/admin/Sidebar";
import Header from "@/component/admin/Header";
import {useRouter} from "next/navigation";
import {authService} from "@/services/authService";
import {User} from "@/types";
import Spinner from "@/component/Spinner";

export default function ClientLayout({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        authService.getMe()
            .then((res) => {
                if (!res || res.role !== "admin") router.replace("/login");
                else setUser(res);
            })
            .catch(() => router.replace("/login"))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="fixed inset-0 flex flex-col gap-y-3 items-center justify-center bg-background z-50">
                <Spinner size={60} color="#CC0000"/>
                <span className="text-lg font-semibold">در حال بارگیری...</span>
            </div>
        );
    }

    if (!user) return null;

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
    );
}
