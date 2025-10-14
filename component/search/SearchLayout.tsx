"use client";

import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import {fetchProducts} from "@/redux/slices/productSlice";
import {Brand, ProductQueryParams} from "@/types";
import {useSearchParams} from "next/navigation";
import FilterContent from "@/component/search/FilterContent";
import SearchGrid from "@/component/search/SearchGrid";
import {FaSortAmountDown} from "react-icons/fa";
import {SORT_BY} from "@/constant";
import {IoFilter} from "react-icons/io5";
import SortModal from "@/component/search/SortModal";
import FilterModal from "@/component/search/FilterModal";

interface Props {
    slug: string,
    brands: Brand[],
}

let debounceTimer: NodeJS.Timeout;

function debounce(func: () => void, delay: number) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}

export default function SearchLayout({slug, brands}: Props) {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();

    const {products, pagination, loading} = useAppSelector((state) => state.product);

    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");
    const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]); // [min, max]

    const [showSortModal, setShowSortModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const [openBrandList, setOpenBrandList] = useState(false);
    const [openSizeList, setOpenSizeList] = useState(false);

    const sizes: number[] = Array.from({length: 48 - 36 + 1}, (_, i) => 36 + i);

    useEffect(() => {
        const query: ProductQueryParams = {};

        if (slug) query.categorySlug = slug;
        if (selectedBrand) query.brandSlug = selectedBrand;
        if (selectedSizes.length > 0) query.size = selectedSizes.map(Number);
        if (priceRange[0] !== 0) query.minPrice = priceRange[0];
        if (priceRange[1] !== 5000000) query.maxPrice = priceRange[1];

        query.page = page;
        query.sort = sortBy;

        debounce(() => {
            dispatch(fetchProducts(query));
        }, 500);

    }, [slug, selectedBrand, selectedSizes, priceRange, page, sortBy, dispatch, searchParams]);

    const resetFilter = () => {
        setPage(1);
        setSortBy("newest");
        setSelectedBrand(null);
        setSelectedSizes([]);
        setPriceRange([0, 5000000])
    }

    return (
        <div className="container my-6">
            <div className="grid grid-cols-12 md:gap-5">
                <div className="col-span-full md:col-span-3">
                    {/* Desktop Filter */}
                    <div
                        className="hidden md:block bg-background-secondary rounded-md shadow-sm border border-border p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg font-semibold">فیلترها</span>
                            <button
                                onClick={() => {
                                    resetFilter();
                                    setSelectedBrand(null);
                                }}
                                className="text-primary text-sm"
                            >
                                حذف همه
                            </button>
                        </div>
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
                    {/* Mobile Filter & Sort */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            className="flex items-center justify-center bg-background-secondary gap-x-3 w-1/2 py-2 rounded-md shadow border border-border"
                            onClick={() => setShowFilterModal(true)}
                        >
                            <IoFilter className="text-xl text-primary"/>
                            فیلتر
                        </button>

                        <button
                            className="flex items-center justify-center bg-background-secondary gap-x-3 w-1/2 py-2 rounded-md shadow border border-border"
                            onClick={() => setShowSortModal(true)}
                        >
                            <FaSortAmountDown className="text-xl text-primary"/>
                            بر اساس
                        </button>
                    </div>
                </div>
                <div className="col-span-full md:col-span-9">
                    {/* Sort Desktop */}
                    <div
                        className="hidden md:flex items-center gap-x-6 px-4 h-14 border border-border shadow-sm bg-background-secondary rounded-md overflow-x-hidden"
                    >
                        <div className="flex items-center h-full shrink-0 gap-x-2">
                            <FaSortAmountDown className="text-2xl"/>
                            <span>فیلتر بندی بر اساس</span>
                        </div>
                        <div className="flex gap-x-5 lg:gap-x-8 h-full">
                            {SORT_BY.map((item, index) => (
                                <span
                                    key={index}
                                    onClick={() => setSortBy(item.slug)}
                                    className={`flex h-full items-center cursor-pointer px-3 py-1 transition-colors duration-200 shrink-0 ${
                                        sortBy === item.slug ? "text-primary border-y-2 border-primary" : ""
                                    }`}
                                >
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>
                    <SearchGrid
                        products={products}
                        page={page}
                        setPage={setPage}
                        totalPages={pagination.totalPages}
                        isLoadingProducts={loading.fetchAll}
                        resetFilter={resetFilter}
                    />
                </div>
            </div>

            {/* Mobile Modals */}
            <FilterModal
                isOpen={showFilterModal}
                onClose={() => setShowFilterModal(false)}
                resetFilter={resetFilter}
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

            <SortModal
                isOpen={showSortModal}
                onClose={() => setShowSortModal(false)}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />
        </div>
    );
}
