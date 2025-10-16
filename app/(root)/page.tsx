import React from 'react';
import Hero from "@/component/Home/Hero";
import Categories from "@/component/Home/Categories";
import {NewArrivals} from "@/component/Home/NewArrivals";
import {Snickers} from "@/component/Home/Snickers";
import {MostDiscount} from "@/component/Home/MostDiscount";
import Advertisement from "@/component/Home/Advertisement";

export default async function Home() {
    return (
        <>
            <Hero/>
            <Categories/>
            <NewArrivals/>
            <Advertisement/>
            <MostDiscount/>
            <Snickers/>
        </>
    );
}