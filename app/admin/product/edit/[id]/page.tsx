'use client';

import {useParams} from 'next/navigation';
import ProductForm from '@/component/admin/Form/ProductForm';
import Link from "next/link";
import {LuMoveRight} from "react-icons/lu";
import React from "react";

export default function EditProductPage() {
    const {id} = useParams<{ id: string }>();

    return (
        <div className="admin-section">
            <div className="admin-section__header">
                <h3 className="admin-section__title">ویرایش محصول</h3>
                <Link href="/admin/product">
                    <button className="primary-button">
                        <LuMoveRight/>
                        <span>بازگشت</span>
                    </button>
                </Link>
            </div>
            <ProductForm id={Number(id)}/>
        </div>
    );
}
