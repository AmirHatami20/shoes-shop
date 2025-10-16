"use client";

import React, {useEffect, useMemo, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {HiMiniBars3} from "react-icons/hi2";
import {AiOutlineUser} from "react-icons/ai";
import {FiSearch} from "react-icons/fi";
import {BsBasket2} from "react-icons/bs";
import {MdOutlineChevronLeft} from "react-icons/md";
import {IoLogOutOutline} from "react-icons/io5";
import {RiAdminLine} from "react-icons/ri";
import {LiaAngleLeftSolid} from "react-icons/lia";
import Overlay from "@/component/Overlay";
import {HEADER_NAV, HEADER_USER_MENU} from "@/constant";
import {Category, User} from "@/types";
import {logout} from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import BasketCard from "@/component/card/BasketCard";
import ThemeToggle from "@/component/ThemeToggle";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import Spinner from "@/component/Spinner";
import {fetchCart} from "@/redux/slices/cartSlice";

type MenuKey = "sidebar" | "userMenu" | "basket" | "categories";

interface Props {
    categories: Category[];
    user: User | null;
}

export default function Header({categories, user}: Props) {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const {cart, guestCart, loading} = useAppSelector((state) => state.cart);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart());
        }
    }, [dispatch, user]);

    const [open, setOpen] = useState<Record<MenuKey, boolean>>({
        sidebar: false,
        userMenu: false,
        basket: false,
        categories: false,
    });

    useEffect(() => {
        setOpen({
            sidebar: false,
            userMenu: false,
            basket: false,
            categories: false,
        });
    }, [pathname]);

    const cartItems = useMemo(() => {
        return user ? cart?.items || [] : guestCart || [];
    }, [user, cart, guestCart]);

    const {basketCount, basketTotal} = cartItems.reduce(
        (acc, item) => {
            const qty = item.quantity ?? 0;
            const price = item.product?.finalPrice ?? item.product?.price ?? 0;

            acc.basketCount += qty;
            acc.basketTotal += price * qty;

            return acc;
        },
        {basketCount: 0, basketTotal: 0}
    );
    // const basketCount = cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    // const basketTotal = cartItems.reduce((sum, item) => sum + ((item.product?.finalPrice ?? item.product?.price ?? 0) * (item.quantity ?? 0)), 0);

    const [activeCat, setActiveCat] = useState(0);
    const [activeSidebarCat, setActiveSidebarCat] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    const toggle = (key: MenuKey, value: boolean) => {
        setOpen((prev) => ({...prev, [key]: value}));
    };

    const handleLogout = async () => {
        try {
            await dispatch(logout());
            toast.success("با موفقیت از حساب خود خارج شدید.");
            toggle("userMenu", false);
            toggle("sidebar", false);
            window.location.reload();
        } catch (error) {
            toast.error(error as string);
        }
    };

    return (
        <header className="bg-background-secondary shadow-md h-18 md:h-20 relative z-40 shadow-primary/60">
            <div className="container h-full flex items-center justify-between gap-x-3">
                {/* Logo + Desktop Nav */}
                <div className="flex items-center gap-x-3">
                    {/* Sidebar trigger for mobile */}
                    <button onClick={() => toggle("sidebar", true)}>
                        <HiMiniBars3 size={30} className="lg:hidden"/>
                    </button>

                    {/* Logo */}
                    <Link href="/">
                        <Image
                            className="hidden lg:block"
                            src="/logo.png"
                            alt="logo"
                            width={70}
                            height={70}
                        />
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-x-5 relative">
                        <div
                            className="flex items-center gap-x-2 py-2 cursor-pointer relative"
                            onMouseEnter={() => toggle("categories", true)}
                            onMouseLeave={() => toggle("categories", false)}
                        >
                            <HiMiniBars3 size={20}/>
                            <span>دسته بندی ها</span>

                            {open.categories && (
                                <div
                                    className="absolute top-full right-0 rounded-lg shadow-xl flex border border-gray-700 z-50">
                                    {/* Right side list */}
                                    <ul className="w-48 border-l bg-background border-gray-700">
                                        {categories.map((cat, idx) => (
                                            <li
                                                key={idx}
                                                onMouseEnter={() => setActiveCat(idx)}
                                                className={`p-3 cursor-pointer ${
                                                    activeCat === idx ? "bg-primary/15 text-primary" : ""
                                                }`}
                                            >
                                                <Link href={`/search/${cat.slug}`}>
                                                    {cat.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Left side subcategories */}
                                    <ul className="w-[420px] bg-background-secondary p-3">
                                        <li className="flex items-center gap-x-1 text-sm text-primary p-2">
                                            <Link href={`/search/${categories[activeCat]?.slug}`}>مشاهده همه</Link>
                                            <MdOutlineChevronLeft/>
                                        </li>

                                        <div className="flex gap-x-8 mt-2">
                                            {categories[activeCat]?.children?.map((child, idx) => (
                                                <div key={idx} className="min-w-[140px]">
                                                    <div
                                                        className="flex items-center gap-x-2 text-lg font-medium hover:text-primary">
                                                        <div className="h-6 w-[2px] bg-primary rounded-full"/>
                                                        <Link href={`/search/${child.slug}`}>
                                                            <span>{child.name}</span>
                                                        </Link>
                                                        <MdOutlineChevronLeft/>
                                                    </div>
                                                    <ul className="text-text-muted mt-2">
                                                        {child?.children?.map((secChild, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="py-1.5 hover:text-primary cursor-pointer"
                                                            >
                                                                <Link href={`/search/${secChild.slug}`}>
                                                                    {secChild.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <Link href="/">
                            <span>بلاگ</span>
                        </Link>
                    </nav>
                </div>

                {/* Search */}
                <form
                    className="flex items-center p-3 bg-background w-full lg:w-md xl:w-lg h-12 rounded-full border border-border">
                    <button type="submit">
                        <FiSearch size={22}/>
                    </button>
                    <input
                        type="text"
                        placeholder="جستجو محصولات ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-full px-2 outline-none placeholder-text-muted bg-transparent"
                    />
                </form>

                {/* Actions */}
                <div className="flex items-center gap-x-3">
                    {/* Basket */}
                    <div className="relative">
                        {loading.fetch ? (
                            <button className="header-button" disabled>
                                <Spinner size={20}/>
                            </button>
                        ) : (
                            <button
                                className={`header-button relative ${open.basket ? "z-50" : ""}`}
                                onClick={() => toggle("basket", true)}
                            >
                                <BsBasket2/>
                                <span
                                    className="absolute flex justify-center items-center size-4 -top-0.5 -right-0.5 text-[12px] bg-primary rounded-full text-white"
                                >
                                {basketCount.toLocaleString("fa-IR")}
                                </span>
                            </button>
                        )}

                        {open.basket && (
                            <Overlay closeOverlay={() => toggle("basket", false)}/>
                        )}
                        <div
                            className={`absolute top-full left-0 w-80 sm:w-[362px] shadow-primary bg-background-secondary border border-border rounded-lg transition-all duration-200 ${
                                open.basket ? "opacity-100 visible z-30" : "opacity-0 invisible z-0"
                            }`}
                        >
                            <div
                                className="flex justify-between h-14 px-3 items-center bg-red-200 rounded-t-lg text-black">
                                <span className="shadowed-text">سبد خرید من</span>
                                <span className="text-sm">{basketCount.toLocaleString("fa-IR")} محصول</span>
                            </div>
                            <div className="flex flex-col p-3">
                                {cartItems.length > 0 ? (
                                    <div>
                                        {cartItems.map((item, idx) => (
                                            <BasketCard
                                                key={idx}
                                                item={item}
                                                isGuest={!user}
                                                loadingId={loading.deleteId!}
                                            />
                                        ))}

                                        <div
                                            className="border-t border-border mt-2 pt-2 flex justify-between text-sm">
                                            <span>مجموع:</span>
                                            <span>{basketTotal.toLocaleString("fa-IR")} تومان</span>
                                        </div>

                                        <div className="mt-3 flex justify-between gap-x-2">
                                            <Link
                                                href="/cart"
                                                className="primary-button flex-1"
                                            >
                                                مشاهده سبد خرید
                                            </Link>
                                            <Link
                                                href="/checkout"
                                                className="secondary-button flex-1"
                                            >
                                                تسویه حساب
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center text-sm h-20">
                                        سبد خرید شما خالی است.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dark/Light Mode */}
                    <div className="relative hidden md:block">
                        <ThemeToggle/>
                    </div>

                    {/* User Menu */}
                    {user ? (
                        <div className="relative hidden md:block">
                            <button
                                className={`header-button relative ${open.userMenu ? "z-50" : ""}`}
                                onClick={() => toggle("userMenu", true)}
                            >
                                <AiOutlineUser/>
                            </button>

                            {open.userMenu && (
                                <Overlay closeOverlay={() => toggle("userMenu", false)}/>
                            )}
                            <div
                                className={`absolute left-0 top-full w-64 bg-background-secondary border border-border p-5 pb-3.5 rounded-lg transition ${
                                    open.userMenu ? "opacity-100 visible z-30" : "opacity-0 invisible z-0"
                                }`}
                            >
                                <div className="flex items-center border-b border-border gap-x-2 pb-2">
                                    <Image
                                        width={50}
                                        height={50}
                                        className="rounded-full"
                                        src="/no-profile.jpg"
                                        alt="noProfile"
                                    />
                                    <div className="flex flex-col gap-y-0.5">
                                        <span className="text-sm font-bold">
                                            {user.firstName + " " + user.lastName}
                                        </span>
                                        <span className="text-text-muted text-[11px] font-semibold">{user.email}</span>
                                    </div>
                                </div>

                                <ul className="border-b border-border py-1 mb-1">
                                    {user && user.role === "admin" && (
                                        <li>
                                            <Link href="/admin" className="header-menu__item hover:bg-primary">
                                                <RiAdminLine/>
                                                <span className="text-base">پنل ادمین</span>
                                            </Link>
                                        </li>
                                    )}
                                    {HEADER_USER_MENU.map((item, i) => (
                                        <li key={i}>
                                            <Link
                                                href={item.href}
                                                className="header-menu__item hover:bg-primary"
                                            >
                                                {item.icon && <item.icon size={22}/>}
                                                <span className="text-base">{item.title}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    className="header-menu__item hover:bg-primary"
                                    onClick={handleLogout}
                                >
                                    <IoLogOutOutline size={22}/>
                                    <span className="text-base">خروج</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login" className="primary-button !hidden md:!flex">
                            ورود | ثبت نام
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar */}
            {open.sidebar && <Overlay closeOverlay={() => toggle("sidebar", false)}/>}
            <div
                className={`fixed overflow-y-auto top-0 right-0 h-full w-64 bg-background-secondary border border-border text-sm z-50 transform transition-transform duration-300 ease-in-out ${
                    open.sidebar ? "translate-x-0" : "translate-x-full"
                } lg:hidden`}
            >
                {user ? (
                    <div className="flex items-center bg-background gap-x-3 p-3">
                        <Image
                            width={50}
                            height={50}
                            className="rounded-full"
                            src="/no-profile.jpg"
                            alt="noProfile"
                        />
                        <div className="flex flex-col gap-y-0.5">
                            <span className="text-sm font-bold">
                                {user.firstName + " " + user.lastName}
                            </span>
                            <span className="text-text-muted text-[11px] font-semibold">
                                {user.email}
                            </span>
                        </div>
                        <Link href="/" className="absolute left-2 text-lg text-text-muted my-auto">
                            <LiaAngleLeftSolid/>
                        </Link>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="bg-red-200 flex items-center justify-center py-4 w-full text-lg shadowed-text"
                    >
                        ورود | ثبت نام
                    </Link>
                )}

                {/* Sidebar links */}
                <div className="px-3">
                    <ul className="flex flex-col py-1.5 border-b border-border">
                        <li className="pt-3 text-xs">
                            <span>لینک ها</span>
                        </li>
                        {HEADER_NAV.map((item, i) => {
                            const isActive = item.href === pathname;
                            return (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className={`header-menu__item hover:bg-primary ${
                                            isActive ? "text-primary" : ""
                                        }`}
                                    >
                                        {item.icon && <item.icon/>}
                                        <span className="text-base">{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* User */}
                    {user && (
                        <ul className="flex flex-col py-1.5 border-b border-border">
                            <li className="pt-3 text-xs">
                                <span>عملیات کاربر</span>
                            </li>
                            {user && user.role === "admin" && (
                                <li>
                                    <Link href="/admin" className="header-menu__item hover:bg-primary">
                                        <RiAdminLine/>
                                        <span className="text-base">پنل ادمین</span>
                                    </Link>
                                </li>
                            )}
                            {HEADER_USER_MENU.map((item, i) => (
                                <li key={i}>
                                    <Link
                                        href={item.href}
                                        className="header-menu__item hover:bg-primary"
                                    >
                                        {item.icon && <item.icon size={22}/>}
                                        <span className="text-base">{item.title}</span>
                                    </Link>
                                </li>
                            ))}
                            <button
                                className="header-menu__item hover:bg-primary"
                                onClick={handleLogout}
                            >
                                <IoLogOutOutline size={22}/>
                                <span className="text-base">خروج</span>
                            </button>
                        </ul>
                    )}

                    {/* Sidebar categories */}
                    <ul className="flex flex-col py-1.5">
                        <li className="pt-3 text-xs">
                            <span>دسته بندی ها</span>
                        </li>

                        {categories.map((cat, idx) => (
                            <li key={idx}>
                                {/* Main category */}
                                <div className="flex flex-col">
                                    <button
                                        onClick={() => setActiveSidebarCat(activeSidebarCat === idx ? null : idx)}
                                        className="flex items-center px-3 text-lg py-2 w-full justify-between hover:bg-primary"
                                    >
                                        {cat.name}
                                        <MdOutlineChevronLeft
                                            className={`transition-transform ${
                                                activeSidebarCat === idx ? "rotate-90" : ""
                                            }`}
                                        />
                                    </button>

                                    {/* Sub category */}
                                    {activeSidebarCat === idx && (
                                        <ul className="pr-4 text-text-muted">
                                            <li className="flex items-center gap-x-1 text-sm text-primary p-2">
                                                <Link href={`/search/${categories[activeCat].slug}`}>مشاهده همه</Link>
                                                <MdOutlineChevronLeft/>
                                            </li>

                                            {cat.children?.map((child, i) => (
                                                <li key={i} className="mt-2">
                                                    <div className="flex flex-col">
                                                        <Link
                                                            href={`/search/${child.slug}`}
                                                            className="flex items-center gap-x-2 text-lg font-medium hover:text-primary"
                                                            onClick={() => toggle("sidebar", false)}
                                                        >
                                                            <div className="h-4 w-[1px] bg-primary rounded-full"/>
                                                            <span>{child.name}</span>
                                                            <MdOutlineChevronLeft/>
                                                        </Link>

                                                        {/* زیرمجموعه‌ها */}
                                                        <ul className="pl-3">
                                                            {child.children?.map((sec, j) => (
                                                                <li
                                                                    key={j}
                                                                    className="py-1 text-sm hover:text-primary cursor-pointer"
                                                                >
                                                                    <Link
                                                                        href={`/search/${sec.slug}`}
                                                                        onClick={() => toggle("sidebar", false)}
                                                                    >
                                                                        {sec.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t border-border">
                        <ThemeToggle/>
                    </div>
                </div>
            </div>
        </header>
    );
}
