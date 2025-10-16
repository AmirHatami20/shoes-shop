import React from 'react';
import {User} from "@/types";
import {redirect} from "next/navigation";

export default function CheckoutLayout({user}: { user: User }) {
    if (!user || user.role !== "admin") {
        redirect("/login");
    }
    return (
        <div>

        </div>
    );
}