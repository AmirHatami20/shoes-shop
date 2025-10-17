import React from 'react';
import {productService} from "@/services/productService";
import ProductLayout from "@/component/product/ProductLayout";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({params}: PageProps) {
    const {id} = await params;
    const product = await productService.getOne(Number(id));

    return <ProductLayout product={product}/>;
}