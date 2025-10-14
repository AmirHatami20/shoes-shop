"use client";

import React, {useRef, useState, useEffect} from "react";

interface Props {
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    min?: number;
    max?: number;
}

export default function PriceSlider({priceRange, setPriceRange, min = 0, max = 5000000}: Props) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderWidth, setSliderWidth] = useState(0);
    const thumbWidth = 20;
    const STEP = Math.round((max - min) / 100);

    useEffect(() => {
        if (sliderRef.current) setSliderWidth(sliderRef.current.offsetWidth);
        const handleResize = () => {
            if (sliderRef.current) setSliderWidth(sliderRef.current.offsetWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getPosition = (value: number) => {
        const ratio = (value - min) / (max - min);
        return ratio * sliderWidth;
    };

    const getValueFromPosition = (pos: number) => {
        let ratio = pos / sliderWidth;
        ratio = Math.max(0, Math.min(1, ratio));
        const value = min + ratio * (max - min);
        return Math.round(value / STEP) * STEP;
    };

    const handleDrag = (index: 0 | 1, e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        const moveEvent = (ev: MouseEvent | TouchEvent) => {
            const clientX = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
            if (!sliderRef.current) return;
            const rect = sliderRef.current.getBoundingClientRect();
            let pos = rect.right - clientX; // RTL: right - clientX
            pos = Math.max(0, Math.min(pos, sliderWidth));
            let value = getValueFromPosition(pos);

            if (index === 0) {
                value = Math.min(value, priceRange[1]);
                setPriceRange([value, priceRange[1]]);
            } else {
                value = Math.max(value, priceRange[0]);
                setPriceRange([priceRange[0], value]);
            }
        };

        const upEvent = () => {
            window.removeEventListener("mousemove", moveEvent);
            window.removeEventListener("mouseup", upEvent);
            window.removeEventListener("touchmove", moveEvent);
            window.removeEventListener("touchend", upEvent);
        };

        window.addEventListener("mousemove", moveEvent);
        window.addEventListener("mouseup", upEvent);
        window.addEventListener("touchmove", moveEvent);
        window.addEventListener("touchend", upEvent);
    };

    const leftPos = getPosition(priceRange[0]);
    const rightPos = getPosition(priceRange[1]);

    return (
        <div dir="rtl" className="py-3 w-full">
            <h3 className="font-medium mb-4">محدوده قیمت</h3>
            <div ref={sliderRef} className="relative h-1 bg-background rounded-full">
                {/* Active Track */}
                <div
                    className="absolute h-1 bg-primary rounded-full"
                    style={{left: sliderWidth - rightPos, width: rightPos - leftPos}}
                />
                {/* Min Thumb */}
                <div
                    className="absolute w-5 h-5 bg-background rounded-full top-[-7px] cursor-pointer"
                    style={{left: sliderWidth - leftPos - thumbWidth / 2}}
                    onMouseDown={(e) => handleDrag(0, e)}
                    onTouchStart={(e) => handleDrag(0, e)}
                />
                {/* Max Thumb */}
                <div
                    className="absolute w-5 h-5 bg-background rounded-full top-[-7px] cursor-pointer"
                    style={{left: sliderWidth - rightPos - thumbWidth / 2}}
                    onMouseDown={(e) => handleDrag(1, e)}
                    onTouchStart={(e) => handleDrag(1, e)}
                />
            </div>
            <div className="flex justify-between mt-3 text-sm">
                <span>{priceRange[0].toLocaleString("fa-IR")}</span>
                <span>{priceRange[1].toLocaleString("fa-IR")}</span>
            </div>
        </div>
    );
}
