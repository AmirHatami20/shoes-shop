'use client'

import React from 'react';
import Link from "next/link";
import {PiBasketBold} from "react-icons/pi";
import ProductCartCard from "@/component/card/ProductCartCard";
import {IoWalletOutline} from "react-icons/io5";
import Spinner from "@/component/Spinner";
import {useAppSelector} from "@/redux/Hooks";
import {useApp} from "@/context/AppContext";

export default function CartLayout() {
    const {user} = useApp()
    const {cart, loading, guestCart} = useAppSelector(state => state.cart);

    const cartItems = user ? cart?.items || [] : guestCart;

    const {basketTotal, basketDiscount, payable} = cartItems.reduce(
        (acc, item) => {
            const price = item.product.price ?? 0;
            const finalPrice = item.product.finalPrice ?? price;
            const qty = item.quantity ?? 0;

            const total = price * qty;
            const discount = (price - finalPrice) * qty;

            acc.basketTotal += total;
            acc.basketDiscount += discount;
            acc.payable += total - discount;

            return acc;
        },
        {basketTotal: 0, basketDiscount: 0, payable: 0}
    );

    if (loading.fetch) {
        return (
            <div className="my-20 flex flex-col gap-y-3 items-center justify-center">
                <Spinner size={60}/>
                <span>در حال بارگیری..</span>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="container my-12">
                <section
                    className="flex flex-col gap-4 items-center justify-center bg-background-secondary shadow border border-border rounded-md p-6">
                    <p>سبد خرید شما خالی است</p>
                    <Link href="/">
                        <button className="primary-button">لیست محصولات</button>
                    </Link>
                </section>
            </main>
        );
    }

    const checkoutHref = user ? "/checkout" : "/login";
    const checkoutLabel = user ? "پرداخت و تکمیل خرید" : "ورود برای ادامه خرید";

    return (
        <main className="container my-12">
            <section className="grid grid-cols-12 gap-y-5 gap-6 lg:gap-x-7">
                {/* Products List */}
                <div
                    className="col-span-full lg:col-span-8 rounded-md overflow-hidden shadow bg-background-secondary border border-border">
                    <div className="flex items-center gap-x-2 px-4 h-14 bg-primary">
                        <PiBasketBold size={30}/>
                        <span className="font-bold text-lg md:text-xl">سبد خرید</span>
                    </div>
                    <div className="flex flex-col p-4 gap-2">
                        {cartItems.map((item, idx) => (
                            <ProductCartCard key={idx} item={item} user={user}/>
                        ))}
                    </div>
                </div>

                {/* Payment Info */}
                <div
                    className="col-span-full lg:col-span-4 rounded-md bg-background-secondary overflow-hidden h-fit shadow border border-border">
                    <div className="flex items-center gap-x-2 px-4 h-14 bg-primary">
                        <IoWalletOutline size={30}/>
                        <span className="font-bold text-lg md:text-xl">اطلاعات پرداخت</span>
                    </div>
                    <div className="flex flex-col p-4 gap-4">
                        <div className="flex justify-between items-center text-sm md:text-base font-semibold">
                            <span>جمع کل:</span>
                            <span>{basketTotal.toLocaleString("fa-IR")} تومان</span>
                        </div>

                        <div
                            className="flex justify-between items-center text-sm md:text-base text-green-600 font-semibold">
                            <span>تخفیف:</span>
                            <span>{basketDiscount.toLocaleString("fa-IR")} تومان</span>
                        </div>

                        <div
                            className="flex justify-between items-center text-base md:text-lg border-t border-border pt-3 mt-2 font-bold">
                            <span>قابل پرداخت:</span>
                            <span>{payable.toLocaleString("fa-IR")} تومان</span>
                        </div>

                        <Link href={checkoutHref}>
                            <button className="mt-4 primary-button w-full">{checkoutLabel}</button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
