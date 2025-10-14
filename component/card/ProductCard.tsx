import React from 'react';
import {Product, ProductImage} from "@/types";
import Link from "next/link";

export default function ProductCard({product}: { product: Product }) {
    const mainImage = (product?.colors?.[0]?.images[0] as ProductImage)?.url;

    return (
        <div
            className="flex flex-col space-y-2 bg-background-secondary border border-border shadow-sm rounded-md transition-transform p-3"
        >
            <Link href={`/product/${product.id}`}>
                <div className="relative w-full max-h-48 overflow-hidden rounded-md">
                    <img
                        className="w-full h-full object-contain bg-white"
                        src={mainImage}
                        alt={product.name}
                    />
                </div>
                <p className="line-clamp-2 h-10 text-sm md:h-12 md:text-base mt-2">
                    {product.name}
                </p>
            </Link>
            <div className="flex justify-between items-end">
                {product.discount ? (
                    <div className="w-9 rounded-full bg-red-500 text-white py-1 text-center text-sm">
                        {product.discount.toLocaleString("fa-IR")}%
                    </div>
                ) : null}
                <div className="flex flex-col items-end">
                    {product.discount ? (
                        <span className="text-sm text-text-muted line-through decoration-red-400 md:text-base">
                          {product.price.toLocaleString("fa-IR")}
                        </span>
                    ) : null}
                    <p className="flex items-center text-primary gap-1 text-sm md:text-base">
                        <span className="font-black">{product.finalPrice?.toLocaleString("fa-IR")}</span>
                        <span className="font-light">تومان</span>
                    </p>
                </div>
            </div>
        </div>
    );
}