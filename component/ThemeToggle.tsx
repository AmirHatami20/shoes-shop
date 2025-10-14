"use client";

import React, {useEffect, useState} from "react";
import {FiSun, FiMoon} from "react-icons/fi";

export default function ThemeToggle() {
    const [dark, setDark] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("theme");
            return saved ? saved === "dark" : true;
        }
        return true;
    });

    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <button onClick={() => setDark(!dark)} className="header-button">
            {dark ? <FiSun/> : <FiMoon/>}
        </button>
    );
}
