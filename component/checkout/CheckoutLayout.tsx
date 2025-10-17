'use client'

import React from 'react';
import {redirect} from "next/navigation";
import {useApp} from "@/context/AppContext";

export default function CheckoutLayout() {
    const {user} = useApp()

    if (!user || user.role !== "admin") {
        redirect("/login");
    }
    return (
        <div>

        </div>
    );
}