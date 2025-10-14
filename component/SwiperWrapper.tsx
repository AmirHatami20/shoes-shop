'use client'

import {Swiper, SwiperSlide} from "swiper/react";
import {Swiper as SwiperType} from "swiper";
import {Navigation, Pagination, Autoplay} from "swiper/modules";
import {PiCaretLeftBold, PiCaretRightBold} from "react-icons/pi";
import React, {useRef, useEffect, useState} from "react";
import {Product} from "@/types";
import ProductCard from "@/component/card/ProductCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {NavigationOptions} from "swiper/types";
import {FaAngleLeft} from "react-icons/fa";
import Link from "next/link";
import {motion} from "framer-motion";

interface Props {
    title: string;
    items: Product[];
}

const breakpointsConfig = {
    0: {slidesPerView: 1, spaceBetween: 10},
    360: {slidesPerView: 2, spaceBetween: 12},
    640: {slidesPerView: 3.5, spaceBetween: 14},
    1024: {slidesPerView: 4.5, spaceBetween: 16},
    1280: {slidesPerView: 5.5, spaceBetween: 20},
};

function SwiperWrapper({title, items}: Props) {
    const prevBtnRef = useRef<HTMLButtonElement>(null);
    const nextBtnRef = useRef<HTMLButtonElement>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        if (swiperRef.current && swiperRef.current.navigation) {
            swiperRef.current.navigation.destroy();
            swiperRef.current.navigation.init();
            swiperRef.current.navigation.update();
        }
    }, []);

    if (!items.length) {
        return (
            <div className="text-center text-red-500 my-10">
                محصولی یافت نشد.
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center w-full mb-4">
                <div className="flex justify-between items-center w-full">
                    <h2 className="font-semibold text-xl">
                        {title}
                    </h2>
                    <Link href="/search/shoes" className="secondary-button">
                        <span>مشاهده همه</span>
                        <FaAngleLeft size={15}/>
                    </Link>
                </div>
            </div>

            {/* Slider Wrapper with Buttons */}
            <div className="relative">
                {/* Buttons */}
                <div
                    className="absolute inset-y-0 left-0 right-0 flex h-fit my-auto items-center justify-between px-2 z-20">
                    <button
                        className={`flex items-center justify-center border border-border w-8 h-8 rounded-full transition-colors ${
                            isBeginning ? "bg-background-secondary/65" : "bg-background-secondary"
                        }`}
                        ref={prevBtnRef}
                    >
                        <PiCaretRightBold/>
                    </button>
                    <button
                        className={`flex items-center justify-center border border-border w-8 h-8 rounded-full transition-colors ${
                            isEnd ? "bg-background-secondary/65" : "bg-background-secondary"
                        }`}
                        ref={nextBtnRef}
                    >
                        <PiCaretLeftBold/>
                    </button>
                </div>

                {/* Swiper */}
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                        setTimeout(() => {
                            if (swiper.navigation && prevBtnRef.current && nextBtnRef.current) {
                                const nav = swiper.params.navigation as NavigationOptions;
                                nav.prevEl = prevBtnRef.current;
                                nav.nextEl = nextBtnRef.current;
                                swiper.navigation.destroy();
                                swiper.navigation.init();
                                swiper.navigation.update();
                            }
                            setIsBeginning(swiper.isBeginning);
                            setIsEnd(swiper.isEnd);
                        });
                    }}
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    breakpoints={breakpointsConfig}
                    modules={[Pagination, Navigation, Autoplay]}
                >
                    {items.map((product) => (
                        <SwiperSlide key={product.id}>
                            <motion.div
                                initial={{opacity: 0, x: -50, scale: 0.95}}
                                whileInView={{opacity: 1, x: 0, scale: 1}}
                                viewport={{once: true, amount: 0.3}}
                                transition={{duration: 0.5, ease: "easeOut"}}
                            >
                                <ProductCard product={product}/>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default SwiperWrapper;
