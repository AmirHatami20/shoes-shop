'use client'

import React, {useEffect, useState} from 'react';
import {User} from "@/types";
import {useRouter} from "next/navigation";
import {authService} from "@/services/authService";

export default function CheckoutLayout() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        authService.getMe()
            .then(res => {
                if (!res || res.role !== "admin") {
                    router.push("/login");
                } else {
                    setUser(res);
                }
            })
            .catch(() => router.push("/login"));
    }, [router]);

    return (
        <div>

        </div>
    );
}