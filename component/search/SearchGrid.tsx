import React from 'react';
import {Product} from "@/types";
import ProductCard from "@/component/card/ProductCard";
import {IoChevronBack, IoChevronForward} from "react-icons/io5";
import {FiBox} from "react-icons/fi";
import Spinner from "@/component/Spinner";

interface ProductGridProps {
    products: Product[];
    isLoadingProducts: boolean;
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    resetFilter: () => void;
}

export default function SearchGrid(
    {
        products,
        isLoadingProducts,
        page,
        setPage,
        totalPages,
        resetFilter,
    }: ProductGridProps
) {
    if (isLoadingProducts) {
        return (
            <div className="my-20 flex flex-col gap-y-3 items-center justify-center">
                <Spinner size={60}/>
                <span className="font-medium animate-pulse">در حال بارگیری..</span>
            </div>
        );
    }

    if (!isLoadingProducts && products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-20 text-text-muted">
                <FiBox size={48} className="mb-3"/>
                <span>محصولی موجود نیست.</span>
                <button className="primary-button mt-3" onClick={resetFilter}>
                    حذف فیلتر ها
                </button>
            </div>
        );
    }


    return (
        <>
            {/* Grid */}
            <div
                id="products-grid"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-5"
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2 flex-wrap">
                {/* Prev */}
                <button
                    onClick={() => page > 1 && setPage(page - 1)}
                    disabled={page === 1}
                    className={`flex items-center justify-center h-10 w-10 rounded-full shadow-md transition-colors duration-200 ${
                        page === 1
                            ? "bg-gray-300 text-border cursor-not-allowed"
                            : "bg-white text-primary-dark"
                    }`}
                >
                    <IoChevronForward size={18}/>
                </button>

                {Array.from({length: totalPages}, (_, i) => i + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`flex items-center justify-center h-10 w-10 rounded-full shadow-md transition-colors duration-200 ${
                            page === p
                                ? "bg-primary text-white"
                                : "bg-white text-primary-dark"
                        }`}
                    >
                        {p.toLocaleString("fa-IR")}
                    </button>
                ))}

                {/* Next */}
                <button
                    onClick={() => page < totalPages && setPage(page + 1)}
                    disabled={page === totalPages}
                    className={`flex items-center justify-center h-10 w-10 rounded-full shadow-md transition-colors duration-200 ${
                        page === totalPages
                            ? "bg-gray-300 text-border cursor-not-allowed"
                            : "bg-white text-primary-dark"
                    }`}
                >
                    <IoChevronBack size={18}/>
                </button>
            </div>
        </>
    );
}
