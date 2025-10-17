import toast from "react-hot-toast";
import {CreateShippingAddress, RegisterData} from "@/types";

export const validateAuthForm = (form: RegisterData, mode: "login" | "register") => {
    if (mode === "register") {
        if (!form.firstName?.trim()) {
            toast.error("نام الزامی است.");
            return false;
        }
        if (!form.lastName?.trim()) {
            toast.error("نام خانوادگی الزامی است.");
            return false;
        }
        const persianRegex = /^[\u0600-\u06FF\s]+$/;
        if (!persianRegex.test(form.firstName) || !persianRegex.test(form.lastName)) {
            toast.error("نام و نام خانوادگی باید فقط فارسی باشد.");
            return false;
        }
    }

    if (!form.email.trim()) {
        toast.error("ایمیل الزامی است.");
        return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
        toast.error("ایمیل معتبر نیست.");
        return false;
    }

    if (!form.password.trim()) {
        toast.error("رمز عبور الزامی است.");
        return false;
    }
    if (form.password.length < 6) {
        toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد.");
        return false;
    }

    return true;
};

export const validateCheckoutForm = (
    form: CreateShippingAddress,
    setErrors: (errors: { [key: string]: string }) => void
) => {
    const newErrors: { [key: string]: string } = {};
    const persianRegex = /^[\u0600-\u06FF\s]+$/;

    // نام
    if (!form.firstName) newErrors.firstName = "نام الزامی است";
    else if (!persianRegex.test(form.firstName)) newErrors.firstName = "نام باید فارسی باشد";

    // نام خانوادگی
    if (!form.lastName) newErrors.lastName = "نام خانوادگی الزامی است";
    else if (!persianRegex.test(form.lastName)) newErrors.lastName = "نام خانوادگی باید فارسی باشد";

    // شماره همراه
    if (!form.phone) newErrors.phone = "شماره همراه الزامی است";
    else if (!/^09\d{9}$/.test(form.phone)) newErrors.phone = "شماره همراه معتبر نیست";

    // استان و شهر
    if (!form.province) newErrors.province = "انتخاب استان الزامی است";
    if (!form.city) newErrors.city = "انتخاب شهر الزامی است";

    // آدرس
    if (!form.street) newErrors.street = "وارد کردن خیابان الزامی است";
    if (!form.alley) newErrors.alley = "وارد کردن کوچه الزامی است";

    // پلاک و واحد
    if (!form.buildingNumber) newErrors.buildingNumber = "وارد کردن پلاک الزامی است";
    if (!form.apartment) newErrors.apartment = "وارد کردن واحد الزامی است";

    // کد پستی
    if (!form.postalCode) newErrors.postalCode = "کد پستی الزامی است";
    else if (!/^\d{10}$/.test(form.postalCode)) newErrors.postalCode = "کد پستی باید ۱۰ رقمی باشد";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
