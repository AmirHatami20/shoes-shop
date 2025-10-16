import React from 'react';
import SwiperWrapper from "@/component/SwiperWrapper";
import {productService} from "@/services/productService";

export async function MostDiscount() {
    const productsData = await productService.getAll({sort: "mostDiscount"})
    const products = productsData.data;

    return (
        <div className="bg-gradient-to-l from-primary/80 via-primary/40 to-primary/15 py-5 my-5">
            <section className="container">
                <SwiperWrapper title="بیشترین تخفیف" items={products}/>
            </section>
        </div>
    );
}