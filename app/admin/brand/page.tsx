'use client'

import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from "react-icons/ai";
import { IoTrashOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/Hooks";
import { BrandPayload } from "@/types";
import Overlay from "@/component/Overlay";
import FormField from "@/component/Form/FormField";
import Spinner from "@/component/Spinner";
import { createBrand, deleteBrand, fetchBrands } from "@/redux/slices/brandSlice";

export default function Page() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState<BrandPayload>({ name: "", slug: "" });

    const dispatch = useAppDispatch();
    const { brands, loading } = useAppSelector(state => state.brand);

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        if (!form.name || !form.slug) {
            toast.error("لطفا همه فیلدها را پر کنید!");
            return;
        }

        try {
            await dispatch(createBrand(form)).unwrap();
            toast.success("برند با موفقیت ساخته شد ✅");
            setForm({ name: "", slug: "" });
            setShowCreateModal(false);
            dispatch(fetchBrands());
        } catch (error) {
            toast.error(error as string);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteBrand(id)).unwrap();
            toast.success("برند با موفقیت حذف شد ✅");
            dispatch(fetchBrands());
        } catch (error) {
            toast.error(error as string);
        }
    };

    return (
        <div className="admin-section">
            {/* Header */}
            <div className="admin-section__header flex justify-between items-center">
                <h3 className="admin-section__title">تمام برندها</h3>
                <button
                    className="primary-button flex items-center gap-2"
                    onClick={() => setShowCreateModal(true)}
                >
                    <AiOutlinePlus /> ساخت برند جدید
                </button>
            </div>

            {/* List */}
            <div className="mt-6 space-y-4">
                {loading.fetch && (
                    <p className="text-center py-10">در حال بارگیری...</p>
                )}

                {!loading.fetch && brands.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {brands.map(brand => (
                            <div key={brand.id} className="border border-border rounded-lg p-4 bg-background/20 shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{brand.name}</p>
                                    <p className="text-text-muted">{brand.slug}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(brand.id)}
                                    className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-primary"
                                >
                                    {loading.deleteId === brand.id ? <Spinner size={15} /> : <IoTrashOutline size={15} />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!loading.fetch && brands.length === 0 && (
                    <p className="text-center py-10 text-text-muted">برندی وجود ندارد</p>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && <Overlay closeOverlay={() => setShowCreateModal(false)} />}
            <div
                className={`fixed inset-0 z-40 m-auto space-y-3 bg-background-secondary border border-border rounded-lg shadow-lg w-[90%] h-fit max-w-md p-6 transition duration-500
                    ${!showCreateModal ? "opacity-0 scale-0" : "opacity-100 scale-100"}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4">ایجاد برند جدید</h3>

                <FormField
                    label="نام برند"
                    value={form.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="مثال: نایکی"
                    required
                />

                <FormField
                    label="اسلاگ برند"
                    value={form.slug}
                    onChange={handleChange}
                    name="slug"
                    placeholder="نام انگلیسی"
                    required
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => setShowCreateModal(false)}
                        className="px-3 font-semibold text-gray-700 py-2 rounded-sm border bg-white border-gray-300 hover:bg-gray-100 transition"
                    >
                        انصراف
                    </button>
                    <button
                        className="primary-button px-3 py-2 flex items-center justify-center"
                        onClick={handleSave}
                        disabled={loading.create}
                    >
                        {loading.create ? "در حال ذخیره..." : "ذخیره"}
                    </button>
                </div>
            </div>
        </div>
    );
}
