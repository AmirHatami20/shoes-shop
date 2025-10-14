import React from 'react';
import Overlay from "@/component/Overlay";
import {IoCloseCircleOutline} from "react-icons/io5";
import {SORT_BY} from "@/constant";
import {IoIosCheckmarkCircleOutline} from "react-icons/io";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    sortBy: string;
    setSortBy: (sortBy: string) => void;
}

export default function SortModal({isOpen, onClose, sortBy, setSortBy}: Props) {
    return (
        <>
            {isOpen && <Overlay closeOverlay={onClose}/>}
            <div
                className={`fixed z-50 bottom-0 left-0 right-0 rounded-t-2xl overflow-hidden bg-background-secondary transform transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between bg-primary/10 p-4">
                    <span className="text-lg font-semibold">مرتب سازی بر اساس</span>
                    <button>
                        <IoCloseCircleOutline size={25}/>
                    </button>
                </div>
                <div className="flex flex-col">
                    {SORT_BY.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => {
                                setSortBy(item.slug)
                                onClose()
                            }}
                            className={`flex items-center justify-between p-4 ${
                                sortBy === item.slug ? "text-primary" : ""
                            }`}
                        >
                            {item.name}
                            {sortBy === item.slug && <IoIosCheckmarkCircleOutline className="text-primary" size={20}/>}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
}