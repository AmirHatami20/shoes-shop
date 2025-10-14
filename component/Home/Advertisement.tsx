import React from 'react';
import {ADVERTISEMENT} from "@/constant";
import Link from "next/link";
import Image from "next/image";

export default function Advertisement() {
    return (
        <div className="container flex w-full flex-col justify-between gap-4 md:flex-row my-10">
            {ADVERTISEMENT.map(item => (
                <Link
                    className="w-full rounded-lg overflow-hidden border border-border"
                    href={`/search/${item.href}`}
                    key={item.id}
                >
                    <Image
                        width={1000}
                        height={200}
                        alt="advertisement"
                        src={item.image}
                    />
                </Link>
            ))}
        </div>
    );
}