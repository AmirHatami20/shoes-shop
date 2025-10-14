'use client'

import React from 'react';
import SwiperWrapper from "@/component/SwiperWrapper";
import {productService} from "@/services/productService";

export  async function Snickers() {
    const productsData = await productService.getAll()
    const products = productsData.data;

    return (
        <section className="container my-10">
            <SwiperWrapper title="کتونی" items={products}/>
        </section>
    );
}