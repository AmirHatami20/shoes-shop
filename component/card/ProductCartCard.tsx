'use client';

import React, {useState} from 'react';
import Link from "next/link";
import {CartItem, ProductImage, User} from "@/types";
import {GoTrash} from "react-icons/go";
import Spinner from "@/component/Spinner";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import {removeCartItem, removeGuestCartItem, updateCartItem, updateGuestCartItem} from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";

interface Props {
    item: CartItem;
    user: User | null;
}

export default function ProductCartCard({item, user}: Props) {
    const dispatch = useAppDispatch();
    const {loading} = useAppSelector(state => state.cart);

    const [inputValue, setInputValue] = useState(item.quantity);

    const handleUpdateQuantity = (qty: number) => {
        try {
            if (user) {
                dispatch(updateCartItem({id: item.id, qty})).unwrap();
            } else {
                dispatch(updateGuestCartItem({id: item.id, qty}));
            }
        } catch (error) {
            toast.error(error as string);
        }
    }

    const handleIncrease = () => {
        const newQty = inputValue + 1;
        setInputValue(newQty);
        handleUpdateQuantity(newQty);
    };

    const handleDecrease = () => {
        if (inputValue <= 1) return;
        const newQty = inputValue - 1;
        setInputValue(newQty);
        handleUpdateQuantity(newQty);
    };

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = Number(e.target.value.replace(/[^0-9]/g, "")) || 1;
        value = Math.max(1, value);
        setInputValue(value);
    };

    const handleDelete = async () => {
        try {
            if (user) {
                await dispatch(removeCartItem(item.id));
            } else {
                dispatch(removeGuestCartItem(item.id));
            }
            toast.success('محصول از سبد خرید حذف شد.');
        } catch (error) {
            toast.error(error as string);
        }
    }

    const totalPrice = (inputValue * (item.product.finalPrice ?? 0)).toLocaleString("fa-IR");
    const mainImage = (item.product?.colors?.[0]?.images?.[0] as ProductImage)?.url;

    return (
        <div
            className="flex flex-col md:flex-row justify-between gap-5 p-2 md:p-4 border-b border-gray-200 relative">
            {/* بخش تصویر و عنوان */}
            <div className="flex items-center flex-col sm:flex-row gap-3">
                <Link href={`/product/${item.product.id}`} className="w-full sm:w-auto">
                    <img
                        src={mainImage}
                        alt={item.product.name}
                        className="h-56 sm:h-24 w-full sm:w-26 object-cover object-center rounded-md"
                    />
                </Link>
                <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-semibold">{item.product.name}</span>

                    <div className="text-xs text-text-muted">
                        رنگ:{' '}
                        <span className="text-gray-800 dark:text-gray-300">
                            {item.color}
                        </span>{' '}
                        | سایز:{' '}
                        <span className="text-gray-800 dark:text-gray-300">
                            {item.size?.toLocaleString('fa-IR')}
                        </span>
                    </div>

                    <div className="flex gap-x-2">
                        {item.product?.discount && (
                            <span className="text-text-muted line-through decoration-primary text-[13px]">
                                {item.product.price?.toLocaleString('fa-IR')}
                            </span>
                        )}

                        <span className="text-sm text-gray-800 dark:text-gray-200">
                            {item.product?.finalPrice?.toLocaleString('fa-IR')} تومان
                        </span>
                    </div>
                </div>
            </div>

            {/* بخش کنترل‌ها */}
            <div className="flex items-center gap-x-3">
                <div className="flex items-center gap-x-1">
                    <button
                        className="flex items-center justify-center h-7 w-7 text-lg bg-background border border-border rounded"
                        onClick={handleDecrease}
                    >
                        -
                    </button>

                    {loading.updateId !== item.id ? (
                        <input
                            type="text"
                            className="w-10 h-7 text-center border border-border bg-background outline-none rounded"
                            max={item.product.colors[0].sizes[0].stock}
                            min={1}
                            value={inputValue.toLocaleString("fa-IR")}
                            onChange={handleChangeQuantity}
                        />
                    ) : (
                        <div
                            className="w-8 h-7 flex items-center justify-center border border-border bg-background rounded">
                            <Spinner size={18}/>
                        </div>
                    )}

                    <button
                        className="flex items-center justify-center h-7 w-7 text-lg bg-background border border-border rounded"
                        onClick={handleIncrease}
                    >
                        +
                    </button>
                </div>

                <span className="text-lg font-semibold text-primary">
                  {totalPrice} تومان
                </span>

                <button
                    className="absolute top-3 left-3 sm:top-0 sm:left-0 sm:relative flex justify-center items-center text-primary bg-background rounded-full w-7 h-7 hover:bg-primary/20 transition border border-border"
                    onClick={handleDelete}
                    disabled={loading.deleteId === item.id}
                >
                    {loading.deleteId === item.id ? <Spinner size={15}/> : <GoTrash size={15}/>}
                </button>
            </div>
        </div>
    );
}
