'use client';

import {ReactNode} from "react";
import {motion, Variants} from "framer-motion";

interface MotionWrapperProps {
    children: ReactNode;
    className?: string;
    stagger?: number;
}

export default function MotionWrapper({children, className = "", stagger = 0.2}: MotionWrapperProps) {
    const containerVariants: Variants = {
        hidden: {},
        show: {transition: {staggerChildren: stagger}},
    };

    const childVariants: Variants = {
        hidden: {opacity: 0, x: -50, y: 0, scale: 0.95},
        show: {opacity: 1, x: 0, y: 0, scale: 1, transition: {duration: 0.5, ease: "easeOut"}},
    };

    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            whileInView="show"
            viewport={{once: true, amount: 0.2}}
        >
            {Array.isArray(children)
                ? children.map((child, i) => (
                    <motion.div key={i} variants={childVariants}>
                        {child}
                    </motion.div>
                ))
                : <motion.div variants={childVariants}>{children}</motion.div>}
        </motion.div>
    );
}
