'use client'

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import {ADMIN_SIDEBAR} from "@/constant";
import {usePathname} from "next/navigation";
import {TbLogout2} from "react-icons/tb";
import {FaBarsStaggered} from "react-icons/fa6";
import Overlay from "@/component/Overlay";
import {User} from "@/types";

export default function Sidebar({user}: { user: User | null }) {
    const [openSidebar, setOpenSidebar] = useState(false);
    const pathName = usePathname()

    const handleSidebar = () => {
        setOpenSidebar(prevState => !prevState);
    }

    useEffect(() => {
        setOpenSidebar(false);
    }, [pathName]);

    return (
        <aside className="bg-background-secondary">
            <div
                className={`fixed h-full right-0 z-40 bg-background-secondary md:z-10 w-64 flex flex-col md:shadow shadow-primary duration-300 ease-in-out ${
                    openSidebar ? 'translate-x-0' : 'translate-x-full'
                } md:translate-x-0`}
            >
                {/* Logo */}
                <div className="px-4 py-3 border-b border-dashed border-border">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-x-2">
                            <Image src="/logo.png" alt="logo" width={55} height={55}/>
                            <span className="font-bold text-lg hidden md:inline">فروشگاه کفش</span>
                        </Link>
                        <button className="text-xl md:hidden" onClick={handleSidebar}>
                            x
                        </button>
                    </div>
                </div>
                <div className="flex flex-col justify-between flex-1">
                    <ul className="flex flex-col space-y-1 p-4">
                        {ADMIN_SIDEBAR.map((link, index) => (
                            <li key={index}>
                                <Link
                                    href={link.route}
                                    className={`flex items-center gap-x-2 p-2 rounded-lg ${
                                        link.route === pathName ? "bg-primary text-white" : ""
                                    }`}
                                >
                                    <link.Icon className="text-xl "/>
                                    <span>{link.text}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div
                        className="flex items-center rounded-full border border-border mx-3 py-1.5 px-2.5 justify-between mb-4">
                        <Image src="/no-profile.jpg" alt="no-profile" width={40} height={40} className="rounded-full"/>
                        <div className="flex flex-col">
                            <span className="text-sm">{user?.firstName}{" "}{user?.lastName}</span>
                            <span className="text-[10px] text-text-muted">{user?.email}</span>
                        </div>
                        <Link href="/" className="cursor-pointer">
                            <TbLogout2 className="text-2xl text-red-500"/>
                        </Link>

                    </div>
                </div>
            </div>

            {openSidebar && (
                <Overlay closeOverlay={() => setOpenSidebar(false)}/>
            )}

            {/* Trigger btn */}
            <button className="px-5 py-3 block md:hidden" onClick={handleSidebar}>
                <FaBarsStaggered className='text-xl'/>
            </button>
        </aside>
    );
}