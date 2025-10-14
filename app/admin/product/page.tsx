'use client'

import React, {useEffect} from 'react';

import {AiOutlinePlus} from "react-icons/ai";
import Link from "next/link";
import {useAppSelector, useAppDispatch} from "@/redux/Hooks";
import {fetchProducts} from "@/redux/slices/productSlice";
import Spinner from "@/component/Spinner";
import ProductCard from "@/component/admin/card/ProductCard";

export default function Page() {
    const dispatch = useAppDispatch();
    const {products, loading} = useAppSelector(state => state.product);
    console.log(products)

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch])

    return (
        <div className="admin-section">
            <div className="admin-section__header">
                <h3 className="admin-section__title">تمام محصولات</h3>
                <Link href="/admin/product/new">
                    <button className="primary-button">
                        <span>ساخت محصول جدید</span>
                        <AiOutlinePlus/>
                    </button>
                </Link>
            </div>
            <div className="">
                {!loading.fetchAll ?
                    products.map((product) => (
                        <ProductCard key={product.id} product={product}/>
                    ))
                    : <div className="w-full flex items-center justify-center py-10">
                        <Spinner size={35}/>
                    </div>
                }
            </div>
        </div>
    );
}