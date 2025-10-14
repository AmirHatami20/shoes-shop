'use client'

import React, {useState} from 'react';
import {CartItemPayload, Product, ProductColor, ProductSize, User} from "@/types";
import {GoShieldCheck} from "react-icons/go";
import toast from "react-hot-toast";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import {addGuestCartItem, addToCart,} from "@/redux/slices/cartSlice";
import Spinner from "@/component/Spinner";

interface Props {
    product: Product;
    selectedColor: ProductColor;
    onColorChange: (color: ProductColor) => void;
    user: User | null;
}

export default function ProductOptions({product, selectedColor, onColorChange, user}: Props) {
    const {colors, price, finalPrice, discount} = product;
    const [selectedSize, setSelectedSize] = useState<ProductSize>(colors[0]?.sizes[0]);
    const {loading} = useAppSelector(state => state.cart);

    const dispatch = useAppDispatch();

    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            toast.error("لطفاً رنگ و سایز را انتخاب کنید");
            return;
        }

        const productForm: CartItemPayload = {
            productId: Number(product.id),
            color: selectedColor?.color,
            size: selectedSize.size,
            quantity: 1,
        };

        try {
            if (user) {
                await dispatch(addToCart(productForm));
            } else {
                dispatch(
                    addGuestCartItem({
                        id: Date.now(),
                        productId: productForm.productId,
                        product,
                        color: productForm.color,
                        size: productForm.size,
                        quantity: productForm.quantity!,
                    })
                );
            }
            toast.success("محصول به سبد خرید اضافه شد.")
        } catch (error) {
            toast.error(error as string);
        }
    };

    return (
        <div>
            <div className="flex flex-col space-y-3">
                <span className="font-medium">انتخاب رنگ:</span>
                <div className="flex items-center gap-3">
                    {colors.map((color) => (
                        <button
                            key={color.id}
                            className={`relative w-22 h-22 rounded-full p-2 border-2  transition-all ${selectedColor.id === color.id ? "border-primary" : "border-transparent"}`}
                            onClick={() => {
                                onColorChange(color);
                                setSelectedSize(color.sizes[0]);
                            }}
                        >
                            <img
                                src={"url" in color.images[0] ? color.images[0].url : undefined}
                                className="w-full h-full object-contain rounded-full"
                                alt="product-color"
                            />
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col space-y-3 mt-3">
                <span className="font-medium">انتخاب سایز:</span>
                <div className="flex items-center gap-3">
                    {selectedColor.sizes.map((size) => (
                        <button
                            key={size.id}
                            disabled={size.stock === 0}
                            onClick={() => setSelectedSize(size)}
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm transition-all 
                                ${size.id === selectedSize.id ? "border-2 border-primary" : "border border-gray-400"}
                                ${size.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`
                            }
                        >
                            {size.size.toLocaleString("fa-IR")}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-4 mb-6 flex items-center gap-x-2 rounded-lg bg-primary/10 p-4 text-sm text-primary/70">
                <GoShieldCheck size={25}/>
                <span>تضمین سلامت فیزیکی و اصالت کالا</span>
            </div>
            <div className="mb-6 flex items-center justify-end">
                <div className="flex flex-col space-y-1">
                    {discount ? (
                        <div className="flex items-center gap-x-2">
                            <span className="text-sm text-text-muted line-through decoration-red-400">
                              {price.toLocaleString("fa-IR")}
                            </span>
                            <div className="w-9 rounded-full text-white bg-red-500 py-1 text-center text-sm">
                                {discount.toLocaleString("fa-IR")}%
                            </div>
                        </div>
                    ) : null}
                    <div className="text-primary">
                        <span className="font-bold">{finalPrice?.toLocaleString("fa-IR")}</span>{" "}
                        <span className="font-light">تومان</span>
                    </div>
                </div>
            </div>
            <button onClick={handleAddToCart} className="primary-button w-full">
                {loading.create ? <Spinner size={25}/> : "افزودن به سبد خرید"}
            </button>
        </div>
    );
}