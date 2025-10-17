import Header from "@/component/layout/Header";
import Footer from "@/component/layout/Footer";
import {categoryService} from "@/services/categoryService";
import {verifyToken} from "@/lib/auth";
import {cookies} from "next/headers";
import {authService} from "@/services/authService";
import {AppProvider} from "@/context/AppContext";
import {ReactNode} from "react";

export default async function Layout({children}: { children: ReactNode }) {
    const token = (await cookies()).get("access_token")?.value;
    const userId = token ? verifyToken(token)?.id : null;

    let user = null;
    if (userId) {
        user = await authService.getMe(token as string);
    }
    const categories = await categoryService.getAll();

    return (
        <AppProvider user={user} categories={categories}>
            <Header/>
            <section className="flex-1">{children}</section>
            <Footer/>
        </AppProvider>
    );
}
