import {ReactNode} from "react";
import type {Metadata} from "next";
import AdminLayoutClient from "@/component/admin/AdminLayoutClient";

export const metadata: Metadata = {
    title: "داشبورد ادمین | مدیریت",
};

export default function Layout({children}: { children: ReactNode }) {
    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
