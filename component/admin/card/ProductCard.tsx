"use client";

import React from "react";
import Link from "next/link";
import {AiOutlineDelete, AiOutlineEdit} from "react-icons/ai";
import {Product, ProductImage} from "@/types";
import toast from "react-hot-toast";
import {useAppSelector, useAppDispatch} from "@/redux/Hooks";
import Spinner from "@/component/Spinner";
import {deleteProduct} from "@/redux/slices/productSlice";

export default function ProductCard({product}: { product: Product }) {
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector(state => state.product);

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteProduct(id)).unwrap();
            toast.success("محصول با موفقیت حذف شد ✅");
        } catch (error) {
            toast.error((error as string));
        }
    }

    const mainImage = (product?.colors?.[0]?.images[0] as ProductImage)?.url;

    return (
        <div
            className="flex items-center justify-center md:justify-between gap-3 flex-col md:flex-row bg-background rounded-lg p-3 mb-4 shadow">
            {/* Right: Image + Info */}
            <div className="flex items-center gap-4">
                {/* Image */}
                <div className="w-28 h-24 md:w-36 md:h-32 bg-white rounded-md relative">
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-contain"
                    />
                    {product.discount ? (
                        <div
                            className="absolute top-1 right-1 w-7 h-6 text-xs flex items-center justify-center bg-primary text-white rounded-md">
                            {product.discount.toLocaleString("fa-IR")}%
                        </div>
                    ) : null}
                </div>

                {/* Product info */}
                <div className="flex flex-col space-y-1">
                    <h4 className="text-base md:text-lg font-semibold">{product.name}</h4>
                    <p className="text-xs md:text-sm">
                        <span className="font-bold text-primary">برند:</span>{" "}
                        <span>{product.brand?.name}</span>
                    </p>
                    <p className="text-xs md:text-sm">
                        <span className="font-bold text-primary">دسته بندی :</span>{" "}
                        <span>{product.category?.finalCategory?.name}</span>
                    </p>
                    <div className="flex items-center gap-x-1 text-xs md:text-sm">
                        <span className="font-bold text-primary">قیمت:</span>{" "}
                        {product.discount ? (
                            <span className="text-text-muted text-xs line-through decoration-red-400">
                                {product.price.toLocaleString("fa-IR")}
                            </span>
                        ) : null}
                        <span>{product.finalPrice?.toLocaleString("fa-IR")} تومان</span>
                    </div>
                </div>
            </div>

            {/* Left: Buttons */}
            <div className="flex gap-3">
                <Link
                    href={`/admin/product/edit/${product.id}`}
                    className="secondary-button"
                >
                    <AiOutlineEdit/>
                    <span>ویرایش</span>
                </Link>
                <button
                    onClick={() => handleDelete(product.id!)}
                    className="primary-button"
                >
                    {loading.deleteId === product.id ? (
                        <Spinner size={25}/>
                    ) : (
                        <>
                            <AiOutlineDelete/>
                            <span>حذف</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
