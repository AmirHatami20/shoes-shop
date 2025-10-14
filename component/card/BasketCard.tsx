'use client';

import React from 'react';
import {GoTrash} from 'react-icons/go';
import {CartItem, ProductImage} from '@/types';
import {useAppDispatch} from '@/redux/Hooks';
import {removeCartItem, removeGuestCartItem} from '@/redux/slices/cartSlice';
import Spinner from '@/component/Spinner';
import toast from 'react-hot-toast';

interface Props {
    item: CartItem;
    isGuest: boolean;
    loadingId?: number;
}

export default function BasketCard({item, isGuest, loadingId}: Props) {
    const dispatch = useAppDispatch();

    const mainImage = (item.product?.colors?.[0]?.images?.[0] as ProductImage)?.url;

    const handleRemove = async () => {
        try {
            if (isGuest) {
                dispatch(removeGuestCartItem(item.id));
            } else {
                await dispatch(removeCartItem(item.id));
            }
            toast.success('محصول از سبد خرید حذف شد.');
        } catch (error) {
            toast.error(error as string);
        }
    };

    return (
        <div className="flex items-center justify-between px-3 py-3">
            {/* بخش اطلاعات محصول */}
            <div className="flex items-center gap-x-3">
                <img
                    src={mainImage}
                    alt={item.product?.name || 'محصول'}
                    className="w-17 h-17 object-cover rounded-md"
                />

                <div className="flex flex-col gap-y-1">
                    <span className="text-sm line-clamp-2 font-semibold">
                        {item.product?.name}
                    </span>

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

                    <span className="text-xs text-text-muted">
                        تعداد: {item.quantity?.toLocaleString('fa-IR')}
                    </span>
                </div>
            </div>

            <button
                disabled={loadingId === item.id}
                onClick={handleRemove}
                className="flex items-center justify-center bg-background border border-border rounded-full p-2 text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
            >
                {loadingId === item.id ? <Spinner/> : <GoTrash/>}
            </button>
        </div>
    );
}
