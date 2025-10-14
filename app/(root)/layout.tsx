'use client'

import {ReactNode, useEffect, useState} from "react";
import Header from "@/component/layout/Header";
import Footer from "@/component/layout/Footer";
import {categoryService} from "@/services/categoryService";
import {Category} from "@/types";
import {fetchCart} from "@/redux/slices/cartSlice";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import Spinner from "@/component/Spinner";
import {motion} from "framer-motion";
import {getMe} from "@/redux/slices/authSlice";

interface Props {
    children: ReactNode;
}

export default function Layout({children}: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();
    const {cart, guestCart, loading: cartLoading} = useAppSelector(state => state.cart);
    const {user} = useAppSelector(state => state.auth);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            categoryService.getAll().then(res => setCategories(res || [])),
            dispatch(getMe())
        ]).finally(() => setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            dispatch(fetchCart());
        }
    }, [dispatch, user]);

    const cartItems = user ? cart?.items || [] : guestCart;
    const isLoading = loading || cartLoading.fetch;

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex flex-col gap-y-3 items-center justify-center bg-background z-50">
                <Spinner size={80} color="#CC0000"/>
                <span className="text-lg font-semibold">در حال بارگیری...</span>
            </div>
        );
    }

    return (
        <motion.main
            className="flex flex-col min-h-screen"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <Header categories={categories} user={user} cartItems={cartItems} deleteId={cartLoading.deleteId}/>
            <section className="flex-1">
                {children}
            </section>
            <Footer/>
        </motion.main>
    );
}
