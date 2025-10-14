'use client'

import {useState} from 'react';
import {CiSearch} from "react-icons/ci";

export default function Header() {
    const [searchValue, setSearchValue] = useState('');

    const user = {name: "امیر"}

    return (
        <div
            className="flex flex-wrap items-center gap-4 justify-center md:justify-between bg-gradient-to-r shadow shadow-primary from-primary to-primary-dark border-b border-primary/50 p-2.5"
        >
            <div className="flex flex-col text-white">
                <span className="text-lg">
                    خوش امدید، {user?.name?.split(' ')[0]} جان
                </span>
                <span className="text-sm">اینجا میتونی محصولات و کاربران را کنترل کنی.</span>
            </div>
            <form
                className="flex rounded-md border px-2 py-1.5 w-xs justify-between items-center border-[#CBD5E1] bg-background"
            >
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="outline-none p-1 text-sm placeholder-text-muted"
                    placeholder="جستجو بین محولات و کاربران..."
                />
                <button>
                    <CiSearch size={25}/>
                </button>
            </form>
        </div>
    );
}