import React from "react";
import {Brand} from "@/types";
import {FaAngleLeft, FaAngleDown} from "react-icons/fa";
import PriceSlider from "@/component/search/PriceSlider";

interface Props {
    brands: Brand[];
    selectedBrand: string | null;
    setSelectedBrand: (brand: string | null) => void;
    selectedSizes: number[];
    setSelectedSizes: (selectedSizes: number[]) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    sizes: number[];
    openBrandList: boolean;
    setOpenBrandList: React.Dispatch<React.SetStateAction<boolean>>;
    openSizeList: boolean;
    setOpenSizeList: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilterContent(
    {
        brands,
        selectedBrand,
        setSelectedBrand,
        selectedSizes,
        setSelectedSizes,
        priceRange,
        setPriceRange,
        sizes,
        openBrandList,
        setOpenBrandList,
        openSizeList,
        setOpenSizeList,
    }: Props) {

    const handleBrandClick = (brand: Brand) => {
        if (selectedBrand === brand.slug) {
            setSelectedBrand(null);
        } else {
            setSelectedBrand(brand.slug);
        }
    };

    const handleSizeChange = (size: number) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    }

    return (
        <>
            {/* Price */}
            <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange}/>

            {/* Brand */}
            <div>
                <button
                    onClick={() => setOpenBrandList((prev) => !prev)}
                    className="flex items-center justify-between py-2.5 w-full"
                >
                    <span className="font-medium">برندها</span>
                    {openBrandList ? <FaAngleDown/> : <FaAngleLeft/>}
                </button>

                {openBrandList && (
                    <ul className="mt-1 border-t border-border pt-2 space-y-2">
                        {brands.map((brand) => (
                            <li key={brand.id}>
                                <button
                                    onClick={() => handleBrandClick(brand)}
                                    className={`w-full flex items-center justify-between p-2 rounded-md transition ${
                                        selectedBrand === brand.slug ? "text-primary font-semibold" : ""
                                    }`}
                                >
                                    <span>{brand.name}</span>
                                    <span>{brand.slug}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Size */}
            <div>
                <button
                    onClick={() => setOpenSizeList((prev) => !prev)}
                    className="flex items-center justify-between py-2.5 w-full"
                >
                    <span className="font-medium">سایزها</span>
                    {openSizeList ? <FaAngleDown/> : <FaAngleLeft/>}
                </button>

                {openSizeList && (
                    <ul className="mt-1 border-t border-border pt-2 space-y-2 max-h-48 overflow-y-auto">
                        {sizes.map((size) => {
                            const isSelected = selectedSizes.includes(size);
                            return (
                                <li key={size} className="flex items-center gap-x-2">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSizeChange(size)}
                                        id={`size-${size}`}
                                        className={` w-5 h-5 rounded-md cursor-pointer border border-border appearance-none transition-all duration-200 flex-shrink-0 ${
                                            isSelected ? "bg-primary" : "bg-background"
                                        }`}
                                    />
                                    <label htmlFor={`size-${size}`} className="cursor-pointer select-none">
                                        {size.toLocaleString("fa-IR")}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </>
    );
}
