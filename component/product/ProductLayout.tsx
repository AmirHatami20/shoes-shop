"use client";

import React, {useState} from 'react';
import BreadCrumb from "@/component/product/BreadCrumb";
import ProductGallery from "@/component/product/ProductGallery";
import Link from "next/link";
import {FaAngleLeft} from "react-icons/fa";
import ProductOptions from "@/component/product/ProductOptions";
import {Product, ProductColor} from "@/types";
import {PRODUCT_SERVICES} from "@/constant";
import {useApp} from "@/context/AppContext";

interface Props {
    product: Product;
}

export default function ProductLayout({product}: Props) {
    const {user} = useApp()
    const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors?.[0]);

    return (
        <main className="container">
            <BreadCrumb product={product}/>
            <div className="bg-background-secondary rounded-md p-3.5 shadow-sm">
                <div className=" grid grid-cols-1 lg:grid-cols-3 gap-5 rounded-md">
                    {/* Gallery */}
                    <ProductGallery
                        colors={product?.colors}
                        productName={product.name}
                        selectedColor={selectedColor}
                    />

                    {/* Info */}
                    <div>
                        <Link href="/" className="flex items-center gap-1 text-primary">
                            <span>برند {product?.brand?.name}</span>
                            <FaAngleLeft size={15}/>
                        </Link>
                        <h3 className="text-lg font-bold mt-2">{product.name}</h3>

                        <div className="mt-3">
                            <p className="mb-4 font-semibold">ویژگی های محصول</p>
                            <ul className="flex flex-col space-y-2 font-light">
                                <li className="flex items-center gap-x-2">
                                    <span className="text-text-muted">جنس</span>
                                    <span>{product.material}</span>
                                </li>
                                <li className="flex items-center gap-x-2">
                                    <span className="text-text-muted">جنس زیره</span>
                                    <span>پلی اتیلن</span>
                                </li>
                                <li className="flex items-center gap-x-2">
                                    <span className="text-text-muted">ویژگی های زیره</span>
                                    <span>تخت</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Options */}
                    <ProductOptions
                        product={product}
                        selectedColor={selectedColor}
                        onColorChange={(color) => setSelectedColor(color)}
                        user={user}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
                    {PRODUCT_SERVICES.map(item => {
                        const Icon = item.icon
                        return (
                            <div
                                className="flex items-center gap-x-2 py-2 px-3 rounded-md border text-text-muted"
                                key={item.id}
                            >
                                <Icon size={20}/>
                                <span>{item.title}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    );
}
