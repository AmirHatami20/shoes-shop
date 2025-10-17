"use client";

import React, {useState, ChangeEvent} from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import {login, register} from "@/redux/slices/authSlice";
import {validateAuthForm} from "@/utils/validation";
import {RegisterData} from "@/types";
import {mergeGuestCart} from "@/redux/slices/cartSlice";

interface AuthFormProps {
    mode: "login" | "register";
    title: string;
}

export default function AuthForm({mode, title}: AuthFormProps) {
    const [form, setForm] = useState<RegisterData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const router = useRouter();
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector((state) => state.auth);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAuthForm(form, mode)) return;

        try {
            if (mode === "register") {
                await dispatch(register(form)).unwrap();
                toast.success("ثبت نام موفقیت‌آمیز بود");

                // Merge guest cart
                await dispatch(mergeGuestCart()).unwrap();

                router.push("/");
            } else {
                await dispatch(login({email: form.email, password: form.password})).unwrap();
                toast.success("ورود موفقیت‌آمیز بود");

                // Merge guest cart
                await dispatch(mergeGuestCart()).unwrap();

                router.push("/");
            }
        } catch (error) {
            toast.error(error as string);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-2xl font-bold text-center">{title}</h1>

            {mode === "register" && (
                <>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="نام"
                        value={form.firstName}
                        onChange={handleChange}
                        className="auth-input"
                    />

                    <input
                        type="text"
                        name="lastName"
                        placeholder="نام خانوادگی"
                        value={form.lastName}
                        onChange={handleChange}
                        className="auth-input"
                    />
                </>
            )}

            <input
                type="text"
                name="email"
                placeholder="آدرس ایمیل"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
            />

            <input
                type="password"
                name="password"
                placeholder="رمز عبور"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
            />

            <button
                type="submit"
                className={`w-full ${loading ? "primary-button-pending" : "primary-button"}`}
                disabled={loading}
            >
                {loading ? "لطفاً صبر کنید..." : mode === "register" ? "ثبت نام" : "ورود"}
            </button>

            <p className="flex gap-x-1 items-center justify-center text-sm">
                {mode === "register" ? (
                    <>
                        قبلاً اکانت ساخته‌اید؟
                        <Link href="/login" className="text-primary font-medium">
                            ورود
                        </Link>
                    </>
                ) : (
                    <>
                        هنوز اکانت نساخته‌اید؟
                        <Link href="/register" className="text-primary font-medium">
                            ثبت نام
                        </Link>
                    </>
                )}
            </p>
        </form>
    );
}
