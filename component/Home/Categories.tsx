'use client';

import React from 'react';
import {CATEGORIES_DATA} from "@/constant";
import Link from "next/link";
import Image from "next/image";
import MotionWrapper from "@/component/MotionWrapper";
import {motion} from "framer-motion";

export default function Categories() {

    return (
        <MotionWrapper className="container grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-5" stagger={0.1}>
            {CATEGORIES_DATA.map(cat => (
                <motion.div
                    key={cat.id}
                    variants={{
                        hidden: {opacity: 0, x: -100, y: 0},
                        show: {opacity: 1, x: 0, y: 0, transition: {duration: 0.5, ease: "easeOut"}},
                    }}
                >
                    <Link
                        href={`/search/${cat.href}`}
                        className="flex rounded-md bg-background-secondary border border-border m-3 hover:scale-105 transition-transform overflow-hidden"
                    >
                        <div
                            className="w-1/3 sm:w-[40%] flex flex-col justify-center items-center bg-primary gap-2 px-2 py-3 text-center"
                        >
                            <span className="text-lg sm:text-xl md:text-2xl font-light leading-8 md:leading-10">
                                {cat.title}
                            </span>
                            <button className="text-[10px] sm:text-xs p-1 bg-white text-primary rounded-full">
                                مشاهده
                            </button>
                        </div>
                        <div className="flex items-center justify-center w-full h-full p-2 md:p-4">
                            <div className="relative flex items-center justify-center">
                                <Image
                                    src={cat.image}
                                    alt={cat.title}
                                    width={200}
                                    height={200}
                                    className="z-20"
                                />
                                <div className="absolute inset-0 rounded-full bg-white shadow-lg shadow-primary z-10"/>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </MotionWrapper>
    );
}
