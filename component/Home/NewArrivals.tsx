import React from 'react';
import SwiperWrapper from "@/component/SwiperWrapper";
import {productService} from "@/services/productService";

export  default async function NewArrivals() {
    const productsData = await productService.getAll()
    const products = productsData.data;

    return (
        <section className="container my-10">
            <SwiperWrapper title="جدید ترین محصولات" items={products}/>
        </section>
    );
}