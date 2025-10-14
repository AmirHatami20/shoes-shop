import Link from "next/link";
import Image from "next/image";
import {FaInstagram, FaTelegramPlane, FaTwitter, FaGithub, FaPhone, FaMapMarkerAlt, FaEnvelope} from "react-icons/fa";

export default function Footer() {
    const persianYear = new Date().getFullYear().toString().replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[+d]);

    return (
        <footer className="bg-background-secondary border-t mt-10 border-border">
            <div className="container py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center md:items-start gap-3 col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="logo" width={70} height={70} className="rounded-sm"/>
                        <h1 className="text-xl font-semibold">فروشگاه کفش</h1>
                    </div>
                    <p className="text-text-muted text-sm leading-6 text-center md:text-start">
                        فروشگاه آنلاین ما، ارائه‌دهنده‌ی جدیدترین محصولات دیجیتال با بهترین قیمت و پشتیبانی حرفه‌ای است.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-start gap-2 col-span-1 md:col-span-1">
                    <h3 className="text-primary text-lg font-semibold mb-2">لینک‌های مفید</h3>
                    <ul className="flex flex-col gap-2 text-gray-800 dark:text-gray-200 text-sm">
                        <li><Link href="/products" className="hover:text-primary transition">محصولات</Link></li>
                        <li><Link href="/" className="hover:text-primary transition">درباره ما</Link></li>
                        <li><Link href="/" className="hover:text-primary transition">تماس با ما</Link></li>
                        <li><Link href="/" className="hover:text-primary transition">سؤالات متداول</Link></li>
                    </ul>
                </div>

                <div className="flex flex-col items-center md:items-start gap-3 col-span-1 md:col-span-1">
                    <h3 className="text-primary text-lg font-semibold">تماس</h3>

                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <FaPhone className="min-w-[20px]"/>
                        <a href="tel:+982100000000" className="hover:text-primary transition">
                            تلفن: ‎+۹۸ ۲۱ ۰۰۰۰ ۰۰۰۰
                        </a>
                    </div>

                    <div className="flex items-center gap-2 text-text-muted text-sm">
                        <FaEnvelope className="min-w-[20px]"/>
                        <a href="mailto:info@fakeshop.test" className="hover:text-primary transition">
                            ایمیل: info@fakeshop.test
                        </a>
                    </div>

                    <div className="flex items-start gap-2 text-text-muted text-sm">
                        <FaMapMarkerAlt className="min-w-[20px] mt-0.5"/>
                        <div>
                            <div className="font-medium">آدرس:</div>
                            <div>خیابان مثال، پلاک ۱۲۳، طبقهٔ ۲، تهران</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-start gap-3 col-span-1 md:col-span-1">
                    <h3 className="text-primary text-lg font-semibold">ما را دنبال کنید</h3>
                    <div className="flex items-center gap-4 text-text-muted">
                        <Link href="https://instagram.com" target="_blank" className="hover:text-primary transition">
                            <FaInstagram size={22}/>
                        </Link>
                        <Link href="https://t.me" target="_blank" className="hover:text-primary transition">
                            <FaTelegramPlane size={22}/>
                        </Link>
                        <Link href="https://twitter.com" target="_blank" className="hover:text-primary transition">
                            <FaTwitter size={22}/>
                        </Link>
                        <Link href="https://github.com" target="_blank" className="hover:text-primary transition">
                            <FaGithub size={22}/>
                        </Link>
                    </div>

                    <p className="text-text-muted text-sm mt-3">
                        با ما در شبکه‌های اجتماعی در ارتباط باشید 🌐
                    </p>
                </div>
            </div>

            <div className="border-t border-border py-4 text-center text-text-muted text-sm bg-background">
                © {persianYear} تمام حقوق برای <span className="text-primary font-semibold">فروشگاه من</span> محفوظ است.
            </div>
        </footer>
    );
}
