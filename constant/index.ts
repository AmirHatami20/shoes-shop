import {HiOutlineUser} from "react-icons/hi";
import {LiaShoppingBasketSolid} from "react-icons/lia";
import {IoHomeOutline} from "react-icons/io5";
import {AiOutlineProduct} from "react-icons/ai";
import {LuUsers} from "react-icons/lu";
import {TbCategory, TbBrandApple} from "react-icons/tb";
import {
    FaUndo,
    FaDollarSign,
    FaHeadset,
    FaShippingFast,
    FaClipboardList,
    FaMoneyCheckAlt,
    FaNewspaper
} from "react-icons/fa";

export const HEADER_NAV = [
    {icon: IoHomeOutline, title: "صفحه اصلی", href: "/"},
    {icon: FaNewspaper, title: "وبلاگ", href: "/blog"},
];

export const HEADER_USER_MENU = [
    {icon: HiOutlineUser, title: "پروفایل", href: "/"},
    {icon: LiaShoppingBasketSolid, title: "سبد خرید", href: "/cart"},
];

export const CATEGORIES_DATA = [
    {
        id: 1,
        title: "کفش مردانه",
        image: "/categories/men-shoes.png",
        href: "men-shoes"
    },
    {
        id: 2,
        title: "کفش زنانه",
        image: "/categories/women-shoes.png",
        href: "women-shoes"
    },
    {
        id: 3,
        title: "کتونی مردانه",
        image: "/categories/men-sneakers.png",
        href: "men-sneakers"
    },
    {
        id: 4,
        title: "کتونی زنانه",
        image: "/categories/women-sneakers.png",
        href: "women-sneakers"
    },
];

export const ADMIN_SIDEBAR = [
    {
        Icon: IoHomeOutline,
        route: "/admin",
        text: "صفحه اصلی",
    },
    {
        Icon: AiOutlineProduct,
        route: "/admin/product",
        text: "محصولات",
    },
    {
        Icon: TbCategory,
        route: "/admin/category",
        text: "دسته بندی ها",
    },
    {
        Icon: TbBrandApple,
        route: "/admin/brand",
        text: "برندها",
    },
    {
        Icon: LuUsers,
        route: "/admin/user",
        text: "کاربران",
    },
    {
        Icon: FaClipboardList,
        route: "/admin/order",
        text: "سفارشات",
    },
    {
        Icon: FaMoneyCheckAlt,
        route: "/admin/payment",
        text: "پرداخت ها",
    },
];

export const ADVERTISEMENT = [
    {id: 1, image: "/advertisement/classic-Shoes.jpg", href: "leather-men-shoes"},
    {id: 2, image: "/advertisement/women-collection.jpg", href: "medical-women-shoes"},
]

export const PRODUCT_SERVICES = [
    {
        id: 1,
        title: "هفت روز ضمانت بازگشت کالا",
        icon: FaUndo
    },
    {
        id: 2,
        title: "امکان خرید اقساطی",
        icon: FaDollarSign
    },
    {
        id: 3,
        title: "مشاوره و پشتیبانی تلفنی",
        icon: FaHeadset
    },
    {
        id: 4,
        title: "ارسال سریع به سراسر کشور",
        icon: FaShippingFast
    }
];

export const SORT_BY = [
    {name: "همه محصولات", slug: "newest"},
    {name: "ارزان‌ترین", slug: "price_asc"},
    {name: "گران‌ترین", slug: "price_desc"},
    {name: "بیشترین تخفیف", slug: "discount_desc"},
    {name: "پرفروش ترین", slug: "bestseller"},
];


