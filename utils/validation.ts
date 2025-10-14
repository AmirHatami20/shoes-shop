import toast from "react-hot-toast";
import { RegisterData } from "@/types";

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
