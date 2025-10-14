"use client";

import React, {useRef, useState} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Keyboard, Pagination} from "swiper/modules";
import {Swiper as SwiperType} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {IoClose} from "react-icons/io5";
import {IoIosMore} from "react-icons/io";
import {ProductColor, ProductImage} from "@/types";
import Overlay from "@/component/Overlay";

interface Props {
    colors: ProductColor[];
    productName: string;
    selectedColor: ProductColor;
}

export default function ProductGallery({colors, productName, selectedColor}: Props) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const mainSwiperRef = useRef<SwiperType | null>(null);

    const allImages = (selectedColor?.images ?? colors?.[0]?.images ?? []).filter(
        (img): img is ProductImage => "url" in img
    );

    const closeOverlay = () => {
        setSelectedImage(null);
    };

    return (
        <div className="w-full">
            {/* ✅ Mobile View */}
            <div className="block lg:hidden">
                <Swiper
                    modules={[Pagination]}
                    pagination={{clickable: true}}
                    spaceBetween={10}
                    className="rounded-2xl overflow-hidden"
                >
                    {allImages.map((img, i) => (
                        <SwiperSlide key={i}>
                            <img
                                src={img.url}
                                alt={`product-${i}`}
                                className="w-full h-78 object-cover rounded-2xl"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* ✅ Desktop View */}
            <div className="hidden lg:block">
                {/* Main image */}
                <div className="rounded-lg overflow-hidden border-2 border-primary">
                    <img
                        src={allImages[activeIndex]?.url}
                        alt={`product-main`}
                        className="w-full h-full object-cover cursor-zoom-in"
                        onClick={() => setSelectedImage(allImages[activeIndex]?.url)}
                    />
                </div>

                {/* Thumbnails */}
                <div className="relative mt-4 pb-2 gap-x-1">
                    <div className="flex gap-x-3 overflow-hidden">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`relative w-17 h-17 shrink-0 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                                    i === activeIndex
                                        ? "border-primary shadow-md"
                                        : "border-gray-300 hover:border-primary"
                                }`}
                            >
                                <img
                                    src={img.url}
                                    alt={`thumb-${i}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                    <button
                        className="absolute left-0 top-0 flex items-center justify-center bg-dark/90 shrink-0 w-19 h-17 border-2 border-border z-20"
                        onClick={() => setSelectedImage(allImages[activeIndex]?.url)}
                    >
                        <IoIosMore size={30}/>
                    </button>
                </div>
            </div>

            {/* ✅ Fullscreen Viewer */}
            {selectedImage && <Overlay closeOverlay={closeOverlay} full={true}/>}
            <div
                className={`hidden md:block fixed inset-0 z-40 m-auto space-y-3 bg-background-secondary border border-border rounded-lg shadow-lg w-[90%] h-fit max-w-6xl p-6 transition duration-500
                    ${!selectedImage ? "opacity-0 scale-0" : "opacity-100 scale-100"}`
                }
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className="text-lg">{productName}</span>
                    <button onClick={closeOverlay}>
                        <IoClose size={20}/>
                    </button>
                </div>

                {/* Main Swiper */}
                <Swiper
                    modules={[Navigation, Pagination, Keyboard]}
                    navigation
                    pagination={{clickable: true}}
                    keyboard
                    className="w-full h-[500px] rounded-lg overflow-hidden"
                    initialSlide={activeIndex}
                    onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                >
                    {allImages.map((img, i) => (
                        <SwiperSlide key={i}>
                            <img
                                src={img.url}
                                alt={`zoom-${i}`}
                                className="w-full h-full object-contain"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Thumbnails */}
                <div className="flex justify-center gap-x-3 mt-4">
                    {allImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setActiveIndex(i);
                                mainSwiperRef.current?.slideTo(i);
                            }}
                            className={`relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                                i === activeIndex
                                    ? "border-primary scale-105 shadow-md"
                                    : "border-gray-500 hover:border-primary"
                            }`}
                        >
                            <img
                                src={img.url}
                                alt={`thumb-${i}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
