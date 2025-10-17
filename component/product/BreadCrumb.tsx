import Link from "next/link";
import {IoHomeOutline} from "react-icons/io5";
import {Product} from "@/types";

export default function BreadCrumb({product}: { product: Product }) {
    return (
        <nav
            className="flex items-stretch w-full bg-background-secondary rounded-md px-3 my-5 shadow-sm overflow-x-hidden">
            <Link
                href="/"
                className="bread-crumb-item"
            >
                <IoHomeOutline size={22}/>
            </Link>
            <Divider/>
            <Link
                href={`/search/${product.category?.mainCategory.slug}`}
                className="bread-crumb-item"
            >
                {product.category?.mainCategory?.name}
            </Link>
            <Divider/>
            <Link
                href={`/search/${product.category?.parentCategory.slug}`}
                className="bread-crumb-item"
            >
                {product.category?.parentCategory?.name}
            </Link>
            <Divider/>
            <Link
                href={`/search/${product.category?.finalCategory.slug}`}
                className="bread-crumb-item"
            >
                {product.category?.finalCategory?.name}
            </Link>
            <Divider/>
            <span className="hidden md:block p-3 text-text-muted">{product.name}</span>
        </nav>
    );
}

function Divider() {
    return (
        <span
            className="w-[2px] bg-background mx-1 self-stretch shrink-0"
            style={{
                transform: "rotate(15deg)",
            }}
        />
    );
}
