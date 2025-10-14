import React from 'react';
import ProductForm from "@/component/admin/Form/ProductForm";
import Link from "next/link";
import {LuMoveRight} from "react-icons/lu";

export default function Page() {
    return (
        <div className="admin-section">
            <div className="admin-section__header">
                <h3 className="admin-section__title">ساخت محصول جدید</h3>
                <Link href="/admin/product">
                    <button className="primary-button">
                        <LuMoveRight/>
                        <span>بازگشت</span>
                    </button>
                </Link>
            </div>
            <ProductForm/>
        </div>
    );
}