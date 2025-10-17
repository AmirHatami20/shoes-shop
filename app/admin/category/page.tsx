'use client'

import React, {useEffect, useState} from 'react';
import {AiOutlinePlus} from "react-icons/ai";
import toast from "react-hot-toast";
import {IoTrashOutline} from "react-icons/io5";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import {createCategory, deleteCategory, fetchCategories} from "@/redux/slices/categorySlice";
import {Category, CategoryPayload} from "@/types";
import Overlay from "@/component/Overlay";
import FormField from "@/component/Form/FormField";
import Spinner from "@/component/Spinner";

interface CategoryTreeProps {
    cats: Category[];
    selectedParent: number | null;
    setSelectedParent: (id: number | null) => void;
}

const CategoryTree = ({cats, selectedParent, setSelectedParent}: CategoryTreeProps) => {
    return (
        <div className="grid grid-cols-3 gap-2">
            {cats.map((cat) => (
                <div key={cat.id}>
                    <button
                        onClick={() => setSelectedParent(cat.id)}
                        className={`w-full text-center py-1 border rounded transition ${
                            selectedParent === cat.id ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {cat.name}
                    </button>
                    {cat.children && cat.children.length > 0 && (
                        <div className="flex flex-col space-y-2 mt-2">
                            {cat.children.map((child) => (
                                <button
                                    key={child.id}
                                    onClick={() => setSelectedParent(child.id)}
                                    className={`block w-full text-center py-1 text-xs rounded ${
                                        selectedParent === child.id ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {child.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

            ))}

        </div>
    );
};

export default function Page() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [form, setForm] = useState<CategoryPayload>({name: "", slug: "", parentId: null});
    const [selectedParent, setSelectedParent] = useState<number | null>(null);

    const dispatch = useAppDispatch();
    const {categories, loading} = useAppSelector(state => state.category);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSave = async () => {
        if (!form.name || !form.slug) {
            toast.error("لطفا همه فیلدها را پر کنید!");
            return;
        }

        try {
            await dispatch(createCategory({...form, parentId: selectedParent})).unwrap();
            toast.success("دسته‌بندی با موفقیت ساخته شد ✅");
            setShowCreateModal(false);
            setForm({name: "", slug: "", parentId: null});
            setSelectedParent(null);
            dispatch(fetchCategories());
        } catch (error) {
            toast.error(error as string);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await dispatch(deleteCategory(id)).unwrap();
            toast.success("دسته‌بندی با موفقیت حذف شد ✅");
            dispatch(fetchCategories());
        } catch (error) {
            toast.error(error as string);
        }
    };


    return (
        <div className="admin-section">
            {/* Header */}
            <div className="admin-section__header">
                <h3 className="admin-section__title">تمام دسته‌بندی‌ها</h3>
                <button
                    className="primary-button"
                    onClick={() => setShowCreateModal(true)}
                >
                    <span>ساخت دسته بندی جدید</span>
                    <AiOutlinePlus/>
                </button>
            </div>

            {/* List */}
            <div className="mt-6 space-y-4">
                {loading.fetch && (
                    <p className="text-lg py-10 text-center">در حال بارگیری...</p>
                )}

                {!loading.fetch && categories.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.filter(cat => cat.parentId === null).map(parent => (
                            <div key={parent.id} className="border rounded-lg p-4 bg-background/20 shadow-sm">
                                {/* Parent */}
                                <div className="flex justify-between items-center">
                                    <div className="text-lg">
                                        <p className="font-semibold">{parent.name}</p>
                                        <p className="text-text-muted">{parent.slug}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(parent.id)}
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-primary"
                                    >
                                        {loading.deleteId === parent.id ?
                                            <Spinner size={15}/> :
                                            <IoTrashOutline size={15}/>
                                        }
                                    </button>
                                </div>

                                {/* First Child */}
                                {parent.children && parent.children.length > 0 && (
                                    <div className="mt-3 pr-4 border-r space-y-2">
                                        {parent.children.map(child => (
                                            <div className="" key={child.id}>
                                                <div
                                                    className="flex justify-between items-center text-base bg-background-secondary rounded p-2 hover:bg-background transition"
                                                >
                                                    <div>
                                                        <p className="font-medium">{child.name}</p>
                                                        <p className="text-text-muted">{child.slug}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(child.id)}
                                                        className="flex items-center justify-center w-7 h-7 rounded-full bg-background border border-border text-primary"
                                                    >
                                                        {loading.deleteId === child.id ?
                                                            <Spinner size={15}/> :
                                                            <IoTrashOutline size={15}/>
                                                        }
                                                    </button>
                                                </div>
                                                {/* Second Child */}
                                                {child.children && child.children.length > 0 && (
                                                    <div className="mt-3 px-4 border-r space-y-2">
                                                        {child.children.map(secChild => (
                                                            <div
                                                                key={secChild.id}
                                                                className="flex justify-between  text-xs items-center bg-background-secondary rounded p-2 hover:bg-background transition"
                                                            >
                                                                <div>
                                                                    <p className="text-sm font-medium">{secChild.name}</p>
                                                                    <p className="text-xs text-gray-400">{secChild.slug}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete(secChild.id)}
                                                                    className="flex items-center justify-center w-6 h-6 rounded-full bg-background border border-border text-primary"
                                                                >
                                                                    {loading.deleteId === secChild.id ?
                                                                        <Spinner size={15}/> :
                                                                        <IoTrashOutline size={15}/>
                                                                    }
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {!loading.fetch && categories.length === 0 && (
                    <p className="text-center py-10 text-text-muted">برندی وجود ندارد</p>
                )}
            </div>


            {/* Modal */}
            {showCreateModal && <Overlay closeOverlay={() => setShowCreateModal(false)}/>}
            <div
                className={`fixed inset-0 z-40 m-auto space-y-3 bg-background-secondary border border-border rounded-lg shadow-lg w-[90%] h-fit max-w-md p-6 transition duration-500
                    ${!showCreateModal ? "opacity-0 scale-0" : "opacity-100 scale-100"}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4">ایجاد دسته بندی جدید</h3>

                <FormField
                    label="نام دسته بندی"
                    value={form.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="مثال: کفش"
                    required
                />

                <FormField
                    label="اسلاگ دسته بندی"
                    value={form.slug}
                    onChange={handleChange}
                    name="slug"
                    placeholder="نام انگلیسی"
                    required
                />

                <div className="mt-4">
                    <p className="mb-2 font-medium">انتخاب والد (اختیاری)</p>
                    <div className="flex flex-col gap-1 max-h-60 overflow-y-auto border p-2 rounded">
                        <button
                            onClick={() => setSelectedParent(null)}
                            className={`px-3 py-1 border rounded mb-1 ${
                                selectedParent === null ? "bg-primary text-white" : "bg-white text-gray-700"
                            }`}
                        >
                            بدون والد
                        </button>

                        <CategoryTree
                            cats={categories.filter(c => c.parentId === null)}
                            selectedParent={selectedParent}
                            setSelectedParent={setSelectedParent}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => setShowCreateModal(false)}
                        className="px-3 font-semibold text-gray-700 py-2 rounded-sm border bg-white border-gray-300 hover:bg-gray-100 transition cursor-pointer"
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