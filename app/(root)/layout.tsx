import Header from "@/component/layout/Header";
import Footer from "@/component/layout/Footer";

import {ReactNode} from "react";

export default async function Layout({children}: { children: ReactNode }) {

    return (
        <>
            <Header/>
            <section className="flex-1">{children}</section>
            <Footer/>
        </>
    );
}
