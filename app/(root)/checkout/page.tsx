'use client'

import React, {useState} from 'react';
import ProgressStepper from "@/component/ProgressStepper";
import {useApp} from "@/context/AppContext";
import {redirect, useRouter} from "next/navigation";
import {IoMdInformationCircleOutline} from "react-icons/io";
import {PiBasketBold} from "react-icons/pi";
import Link from "next/link";
import CheckoutForm from "@/component/Form/CheckoutForm";
import {CreateShippingAddress, ProductImage} from "@/types";
import {useAppSelector} from "@/redux/Hooks";
import toast from "react-hot-toast";
import {validateCheckoutForm} from "@/utils/validation";

export default function Page() {
    const {user} = useApp();

    if (!user || user.role !== "admin") {
        redirect("/login")
    }

    const [form, setForm] = useState<CreateShippingAddress>({
        firstName: "",
        lastName: "",
        phone: "",
        province: "",
        city: "",
        street: "",
        alley: "",
        buildingNumber: 0,
        apartment: 0,
        postalCode: "",
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const {cart, loading} = useAppSelector(state => state.cart);
    const cartItems = cart?.items || [];

    const basketTotal = cartItems?.reduce((acc, item) => {
        const qty = item.quantity ?? 0;
        const price = item.product.finalPrice ?? 0;
        return acc + qty * price;
    }, 0);

    const handleCheckoutSubmit = async () => {
        if (!user) {
            toast.error("برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید.");
            return;
        }

        if (!validateCheckoutForm(form, setErrors)) {
            toast.error("لطفا فیلد ها را درست وارد نمایید.");
            return;
        }

        if (!cartItems.length) {
            toast.error("سبد خرید شما خالی است.");
            return;
        }

    }

    return (
        <>
            <ProgressStepper currentStep={2}/>
            <main className="container grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="rounded-md overflow-hidden shadow max-h-fit">
                    <div className="flex items-center gap-x-2 px-4 h-14 bg-primary">
                        <IoMdInformationCircleOutline size={30}/>
                        <span className="font-bold text-lg md:text-xl">اطلاعات شما</span>
                    </div>
                    <CheckoutForm form={form} setForm={setForm} errors={errors}/>
                </div>
                <div className="rounded-md overflow-hidden shadow max-h-fit">
                    <div className="flex items-center gap-x-2 px-4 h-14 bg-primary">
                        <PiBasketBold size={30}/>
                        <span className="font-bold text-lg md:text-xl">سفارش شما</span>
                    </div>
                    <div className="bg-background-secondary">
                        {loading.fetch ? (
                            <p className="py-8 text-center w-full">در حال لود...</p>
                        ) : cartItems.length > 0 ? (
                            <>
                                <div className="flex p-3 bg-border font-semibold border-b border-border text-sm">
                                    <span className="block w-3/5">محصول</span>
                                    <span className="block w-2/5">قیمت کل</span>
                                </div>

                                {cartItems.map(item => {
                                    const mainImage = (item.product?.colors?.[0]?.images[0] as ProductImage)?.url;

                                    return (
                                        <div key={item.product.id} className="flex p-3 border-b border-border">
                                            <div className="w-3/5 flex gap-x-2 items-center">
                                                <img
                                                    src={mainImage}
                                                    alt={item.product.name}
                                                    className="w-14 h-14 rounded-sm object-cover object-top"
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-semibold">{item.product.name}</span>
                                                    <p className="text-xs">تعداد: <span>{item.quantity}</span></p>
                                                </div>
                                            </div>
                                            <span className="text-primary-dark my-auto font-semibold text-sm">
                                                 {((item.product.finalPrice ?? 0) * item.quantity).toLocaleString("fa-IR")} تومان
                                            </span>
                                        </div>
                                    )
                                })}

                                <div className="flex p-3 font-semibold border-b border-border text-sm">
                                    <span className="block w-3/5">قیمت کل</span>
                                    <span
                                        className="block w-2/5 text-primary-dark">{basketTotal.toLocaleString("fa-IR")} تومان</span>
                                </div>

                                <div className="flex items-center justify-center px-3 py-4">
                                    <button
                                        onClick={handleCheckoutSubmit}
                                        className={!loading.create ? "primary-button w-full" : "primary-button-pending w-full"}
                                        disabled={loading.create}
                                    >
                                        {loading.create ? "در حال ثبت" : "ثبت سفارش"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-8 flex flex-col gap-2 justify-center items-center w-full">
                                <span className="font-semibold text-lg">سبد خرید شما خالی است.</span>
                                <Link href="/search">
                                    <button className="primary-button w-fit">لیست محصولات</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}