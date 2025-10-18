'use client';

import React from 'react';
import Image from 'next/image';

export default function Hero() {
    return (
        <div
            className="bg-gradient-to-l from-primary/15 via-primary/40 to-primary/80 p-6 lg:p-12 w-full mt-1"
        >
            <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                {/* Text Section */}
                <div
                    className="flex flex-col items-center text-center lg:text-start lg:items-start space-y-6 order-2 lg:order-1"
                >
                    <h1 className="text-4xl lg:text-5xl font-bold leading-snug">
                        بهترین کفش‌ها، بهترین تجربه
                    </h1>

                    <p className="text-base md:text-lg text-text-muted max-w-md leading-relaxed">
                        جدیدترین مدل‌های کفش با کیفیت عالی و قیمت مناسب برای هر سلیقه‌ای.
                        راحتی، استایل و دوام را همزمان تجربه کنید.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 mt-2">
                        <button
                            className="text-sm md:text-base bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition"
                        >
                            خرید اکنون
                        </button>
                        <button
                            className="text-sm md:text-base bg-white text-primary border border-primary px-6 py-3 rounded-lg hover:bg-primary/10 transition"
                        >
                            مشاهده محصولات
                        </button>
                    </div>
                </div>

                {/* Image Section */}
                <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                    <Image
                        src="/hero.png"
                        width={520}
                        height={420}
                        className="object-contain z-20"
                        alt="hero-image"
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
