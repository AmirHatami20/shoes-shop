import React from 'react';
import {Brand} from "@/types";
import FilterContent from "@/component/search/FilterContent";
import {IoCloseSharp} from "react-icons/io5";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    resetFilter: () => void;
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

export default function FilterModal(
    {
        isOpen,
        onClose,
        resetFilter,
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
        setOpenSizeList
    }: FilterModalProps) {
    return (
        <div
            className={`fixed inset-0 z-50 bg-background-secondary transform transition-transform duration-300 ${
                isOpen ? "translate-y-0" : "translate-y-full"
            } flex flex-col`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
                <span className="text-lg font-semibold">فیلتر ها</span>
                <button
                    onClick={() => {
                        onClose();
                        resetFilter();
                    }}
                    className="flex items-center gap-x-1.5 text-primary font-semibold text-sm"
                >
                    حذف فیلتر ها
                    <IoCloseSharp/>
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5">
                <FilterContent
                    brands={brands}
                    selectedBrand={selectedBrand}
                    setSelectedBrand={setSelectedBrand}
                    selectedSizes={selectedSizes}
                    setSelectedSizes={setSelectedSizes}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    sizes={sizes}
                    openBrandList={openBrandList}
                    setOpenBrandList={setOpenBrandList}
                    openSizeList={openSizeList}
                    setOpenSizeList={setOpenSizeList}
                />
            </div>

            {/* Apply Button */}
            <div className="p-5 border-t border-border">
                <button
                    onClick={onClose}
                    className="w-full py-3 rounded-md bg-primary text-white font-medium"
                >
                    اعمال فیلتر
                </button>
            </div>
        </div>
    );
}
