'use client';

import React, {useState, useEffect} from "react";
import FormField from "@/component/Form/FormField";
import provincesData from "@/constant/ostan.json";
import citiesData from "@/constant/shahr.json";
import {FaAngleDown, FaAngleUp} from "react-icons/fa";
import {CreateShippingAddress} from "@/types";

type Province = { id: number; name: string };
type City = { id: number; name: string; ostan: number };

interface Props {
    form: CreateShippingAddress;
    setForm: (form: CreateShippingAddress | ((prev: CreateShippingAddress) => CreateShippingAddress)) => void;
    errors: { [key: string]: string };
    onChange?: (data: CreateShippingAddress) => void;
}

export default function CheckoutForm({form, setForm, errors, onChange,}: Props) {
    const [provinces] = useState<Province[]>(provincesData);
    const [cities, setCities] = useState<City[]>([]);
    const [provinceOpen, setProvinceOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);

    useEffect(() => {
        if (form.province) {
            const province = provinces.find((p) => p.name === form.province);
            if (province) {
                setCities(citiesData.filter((c) => c.ostan === province.id));
                setForm((prev) => ({...prev, city: ""}));
            }
        } else {
            setCities([]);
        }
    }, [form.province, provinces, setForm]);

    // انتخاب استان
    const handleSelectProvince = (name: string) => {
        setForm((prev) => ({
            ...prev,
            province: name,
            city: ""
        }));
        setProvinceOpen(false);
        onChange?.({...form, province: name, city: ""});
    };

    // انتخاب شهر
    const handleSelectCity = (name: string) => {
        setForm((prev) => ({
            ...prev,
            city: name,
        }));
        setCityOpen(false);
        onChange?.({...form, city: name});
    };

    // هندل تغییرات ورودی‌ها
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        let newForm;

        if (name === "buildingNumber" || name === "apartment") {
            const num = value.replace(/\D/g, "");
            newForm = {...form, [name]: num ? Number(num) : ""};
        } else if (name === "phone" || name === "postalCode") {
            newForm = {...form, [name]: value.replace(/\D/g, "")};
        } else {
            newForm = {...form, [name]: value};
        }

        setForm(newForm);
        onChange?.(newForm);
    };

    const selectedProvince = provinces.find((p) => p.name === form.province);
    const selectedCity = cities.find((c) => c.name === form.city);

    return (
        <form className="flex flex-col space-y-3 p-3.5 bg-background-secondary">
            {/* نام و نام خانوادگی */}
            <div className="grid grid-cols-2 gap-x-3">
                <FormField
                    name="firstName"
                    label="نام"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    placeholder="نام..."
                    error={errors.firstName}
                />
                <FormField
                    name="lastName"
                    label="نام خانوادگی"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    placeholder="نام خانوادگی..."
                    error={errors.lastName}
                />
            </div>

            {/* شماره همراه */}
            <FormField
                name="phone"
                label="شماره همراه"
                value={form.phone || ""}
                onChange={handleChange}
                required
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                error={errors.phone}
            />

            {/* استان و شهر */}
            <div className="grid grid-cols-2 gap-x-3">
                {/* استان */}
                <div className="flex flex-col relative gap-y-1">
                    <label className="flex gap-x-1">
                        استان <span className="text-red-500">*</span>
                    </label>
                    <div
                        className="bg-background border border-border rounded-xl p-2 cursor-pointer relative text-sm flex justify-between items-center"
                        onClick={() => setProvinceOpen((prev) => !prev)}
                    >
                        <span>
                          {selectedProvince ? selectedProvince.name : "انتخاب استان..."}
                        </span>
                        {!provinceOpen ? <FaAngleDown size={15}/> : <FaAngleUp size={15}/>}
                    </div>
                    <div
                        className={`absolute left-0 right-0 top-full border border-border rounded-xl shadow max-h-52 overflow-auto z-50 ${
                            provinceOpen ? "block" : "hidden"
                        }`}
                    >
                        {provinces.map((p) => (
                            <div
                                key={p.id}
                                className="p-2 cursor-pointer"
                                onClick={() => handleSelectProvince(p.name)}
                            >
                                {p.name}
                            </div>
                        ))}
                    </div>
                    {errors.province && (
                        <span className="text-red-500 text-xs">{errors.province}</span>
                    )}
                </div>

                {/* شهر */}
                <div className="flex flex-col relative gap-y-1">
                    <label className="flex gap-x-1">
                        شهر <span className="text-red-500">*</span>
                    </label>
                    <div
                        className={`bg-background border border-border rounded-xl p-2 cursor-pointer relative text-sm flex justify-between items-center ${
                            !form.province ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => form.province && setCityOpen((prev) => !prev)}
                    >
                        <span>{selectedCity ? selectedCity.name : "انتخاب شهر..."}</span>
                        {!cityOpen ? <FaAngleDown size={15}/> : <FaAngleUp size={15}/>}
                    </div>
                    <div
                        className={`absolute left-0 right-0 top-full border border-border rounded-xl shadow max-h-52 overflow-auto z-50 ${
                            cityOpen ? "block" : "hidden"
                        }`}
                    >
                        {cities.map((c) => (
                            <div
                                key={c.id}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectCity(c.name)}
                            >
                                {c.name}
                            </div>
                        ))}
                    </div>
                    {errors.city && (
                        <span className="text-red-500 text-xs">{errors.city}</span>
                    )}
                </div>
            </div>

            {/* خیابان و کوچه */}
            <div className="grid grid-cols-2 gap-x-3">
                <FormField
                    name="street"
                    label="خیابان"
                    value={form.street}
                    onChange={handleChange}
                    required
                    placeholder=" خیابان یا بلوار..."
                    error={errors.street}
                />
                <FormField
                    name="alley"
                    label="کوچه"
                    value={form.alley}
                    onChange={handleChange}
                    required
                    placeholder="کوچه..."
                    error={errors.alley}
                />
            </div>

            {/* پلاک و واحد */}
            <div className="grid grid-cols-2 gap-x-3">
                <FormField
                    name="buildingNumber"
                    label="پلاک"
                    value={form.buildingNumber === 0 ? "" : form.buildingNumber}
                    onChange={handleChange}
                    required
                    placeholder="پلاک..."
                    error={errors.buildingNumber}
                />
                <FormField
                    name="apartment"
                    label="واحد"
                    value={form.apartment === 0 ? "" : form.apartment}
                    onChange={handleChange}
                    placeholder="واحد..."
                    required
                    error={errors.apartment}
                />
            </div>

            {/* کد پستی */}
            <FormField
                name="postalCode"
                label="کدپستی"
                value={form.postalCode || ""}
                onChange={handleChange}
                placeholder="کدپستی ۱۰ رقمی"
                required
                error={errors.postalCode}
            />
        </form>
    );
}
