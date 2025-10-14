import React from "react";

interface SpinnerProps {
    size?: number;
    color?: string;
}

export default function Spinner({size = 16, color = "#CC0000"}: SpinnerProps) {
    return (
        <div
            className={`animate-spin rounded-full ${size > 40 ? "border-3" : "border-2"} border-t-transparent border-[${color}]`}
            style={{width: size, height: size}}
        />
    );
}

