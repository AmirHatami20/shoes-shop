'use client';

import React, {useEffect, useState} from 'react';
import FormField from "@/component/Form/FormField";
import {Category, Product} from "@/types";
import {useAppDispatch, useAppSelector} from "@/redux/Hooks";
import {fetchCategories} from "@/redux/slices/categorySlice";
import {fetchBrands} from "@/redux/slices/brandSlice";
import {IoTrashOutline} from "react-icons/io5";
import {AiOutlinePlus} from "react-icons/ai";
import toast from "react-hot-toast";
import {createProduct, fetchProduct, updateProduct} from "@/redux/slices/productSlice";
import Spinner from "@/component/Spinner";

export default function ProductForm({id}: { id?: number }) {
    const [form, setForm] = useState<Product>({
        name: '',
        description: '',
        price: 0,
        discount: 0,
        categoryId: 0,
        brandId: 0,
        material: '',
        colors: [{color: "", images: [], sizes: [{size: 0, stock: 0}]}]
    });

    const dispatch = useAppDispatch();
    const {categories} = useAppSelector(state => state.category);
    const {brands} = useAppSelector(state => state.brand)
    const {selectedProduct, loading} = useAppSelector(state => state.product);

    const [selectedParent, setSelectedParent] = useState<Category | null>(null);
    const [selectedSub, setSelectedSub] = useState<Category | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchProduct(id));
        }
        dispatch(fetchCategories());
        dispatch(fetchBrands());
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedProduct && id) {
            setForm({
                name: selectedProduct.name,
                description: selectedProduct.description || "",
                price: selectedProduct.price,
                discount: selectedProduct.discount || 0,
                categoryId: selectedProduct.categoryId,
                brandId: selectedProduct.brandId,
                material: selectedProduct.material || "",
                colors: selectedProduct.colors || [{color: "", images: [], sizes: [{size: 0, stock: 0}]}]
            });
        }
    }, [selectedProduct, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;

        setForm(prev => {
            if (name === "price" || name === "discount") {
                if (/^\d*$/.test(value)) {
                    return {...prev, [name]: value === "" ? 0 : Number(value)};
                }
                return prev;
            }
            return {...prev, [name]: value};
        });
    }

    const updateColor = (colorIndex: number, value: string) => {
        setForm(prev => ({
            ...prev,
            colors: prev.colors.map((color, idx) => (
                idx === colorIndex ? {...color, color: value} : color
            ))
        }))
    }

    const updateSize = (colorIndex: number, sizeIndex: number, key: 'size' | 'stock', value: number) => {
        if (isNaN(value) || value < 0) return;

        setForm(prev => ({
            ...prev,
            colors: prev.colors.map((color, colorIdx) =>
                colorIdx === colorIndex
                    ? {
                        ...color,
                        sizes: color.sizes.map((size, sizeIdx) => sizeIdx === sizeIndex ? {...size, [key]: value} : size)
                    }
                    : color
            )
        }));
    };

    const addColor = () => {
        setForm(prev => ({
            ...prev,
            colors: [...prev.colors, {color: "", images: [], sizes: [{size: 0, stock: 0}]}]
        }));
    };

    const removeColor = (colorIndex: number) => {
        setForm(prev => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== colorIndex)
        }));
    };

    const addSize = (colorIndex: number) => {
        setForm(prev => ({
                ...prev,
                colors: prev.colors.map((color, colorIdx) =>
                    colorIdx === colorIndex
                        ? {...color, sizes: [...color.sizes, {size: 0, stock: 0}]}
                        : color
                )
            })
        );
    };

    const removeSize = (colorIndex: number, sizeIndex: number) => {
        setForm(prev => {
            const newColors = [...prev.colors];
            newColors[colorIndex].sizes = newColors[colorIndex].sizes.filter((_, i) => i !== sizeIndex);
            return {...prev, colors: newColors};
        });
    };

    const handleImage = (colorIndex: number, files: FileList | null) => {
        if (!files) return;

        setForm(prev => {
            const newColors = prev.colors.map((color, idx) => {
                if (idx === colorIndex) {
                    return {
                        ...color,
                        images: [...(color.images || []), ...Array.from(files)],
                    };
                }
                return color;
            });

            return {...prev, colors: newColors};
        });
    };

    const handleRemoveImage = (colorIndex: number, imageIndex: number) => {
        setForm(prev => ({
            ...prev,
            colors: prev.colors.map((color, colorIdx) =>
                colorIdx === colorIndex
                    ? {...color, images: color.images.filter((_, i) => i !== imageIndex)}
                    : color
            )
        }));
    };

    const clearInputs = () => {
        setForm({
            name: '',
            description: '',
            price: 0,
            discount: 0,
            categoryId: 0,
            brandId: 0,
            material: '',
            colors: [{color: "", images: [], sizes: [{size: 0, stock: 0}]}]
        });

        setSelectedParent(null);
        setSelectedSub(null);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (key !== "colors") {
                formData.append(key, value.toString());
            }
        });

        const variantsWithoutFiles = form.colors.map(c => ({
            color: c.color,
            sizes: c.sizes,
        }));
        formData.append("variants", JSON.stringify(variantsWithoutFiles));

        form.colors.forEach((color, colorIndex) => {
            color.images.forEach((img, fileIndex) => {
                if (img instanceof File) {
                    formData.append(`color_${colorIndex}_image_${fileIndex}`, img);
                } else if ("url" in img) {
                    formData.append(`color_${colorIndex}_existing_${fileIndex}`, img.url);
                }
            });
        });

        try {
            if (id && selectedProduct) {
                await dispatch(updateProduct({id, formData})).unwrap();
                toast.success('محصول با موفقیت آپدیت شد.');
            } else {
                await dispatch(createProduct(formData)).unwrap();
                toast.success('محصول با موفقیت ساخته شد.');
                clearInputs();
            }
        } catch (error) {
            toast.error(error as string);
        }
    };

    if (id && loading.fetchOne) {
        return (
            <div className="flex justify-center items-center py-10">
                <Spinner size={40}/>
            </div>
        );
    }

    return (
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            <FormField
                name="name"
                label="نام محصول"
                value={form.name}
                onChange={handleChange}
                placeholder="مثال: کفش جردن"
                required={true}
                error=""
            />

            <FormField
                name="price"
                label="قیمت محصول"
                value={form.price === 0 ? "" : form.price}
                onChange={handleChange}
                placeholder="به تومان"
                required={true}
                error=""
            />

            <FormField
                name="discount"
                label="درصد تخفیف"
                value={form.discount === 0 ? "" : form.discount!}
                onChange={handleChange}
                placeholder="بین 1 تا 100"
                error=""
            />

            <FormField
                name="material"
                label="جنس محصول"
                value={form.material!}
                onChange={handleChange}
                placeholder="مثال: چرم اصل"
                error=""
            />

            {/* Category selection */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm">
                    دسته ‌بندی <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Main category */}
                    <select
                        value={selectedParent?.id || ""}
                        onChange={(e) => {
                            const category = categories.find((c) => c.id === Number(e.target.value)) || null;
                            setSelectedParent(category)
                            setSelectedSub(null)
                            setForm(prev => ({...prev, categoryId: 0}))
                        }}
                        className="admin-input"
                    >
                        <option value="">دسته بندی اصلی</option>
                        {categories.filter((c) => c.parentId === null).map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    {/* Subcategory */}
                    <select
                        value={selectedSub?.id || ""}
                        onChange={(e) => {
                            const subCategory = selectedParent?.children?.find((c) => c.id === Number(e.target.value)) || null;
                            setSelectedSub(subCategory)
                            setForm(prev => ({...prev, categoryId: 0}))
                        }}
                        className={`admin-input ${!selectedParent ? "!bg-gray-700 text-gray-400" : ""}`}
                        disabled={!selectedParent}
                    >
                        <option value="">زنانه یا مردانه...</option>
                        {selectedParent?.children?.map((subCat) => (
                            <option value={subCat.id} key={subCat.id}>{subCat.name}</option>
                        ))}

                    </select>

                    {/* Final category */}
                    <select
                        value={form.categoryId}
                        onChange={(e) => {
                            const finalCat = selectedSub?.children?.find(c => c.id === Number(e.target.value)) || null;
                            setForm(prev => ({...prev, categoryId: finalCat?.id ? finalCat.id : 0}));
                        }}
                        disabled={!selectedSub}
                        className={`admin-input ${!selectedSub ? "!bg-gray-700 text-gray-400" : ""}`}
                    >
                        <option value="">دسته بندی...</option>
                        {selectedSub?.children?.map((finalCat) => (
                            <option value={finalCat.id} key={finalCat.id}>{finalCat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Brand selection */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm">
                    برند <span className="text-red-500">*</span>
                </label>
                <select
                    value={form.brandId}
                    onChange={(e) => {
                        const brand = Number(e.target.value);
                        setForm(prev => ({...prev, brandId: brand}));
                    }}
                    className="admin-input"
                >
                    <option value="">برند...</option>
                    {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                    ))}
                </select>
            </div>

            {/* description */}
            <div className="flex flex-col space-y-1 col-span-full">
                <label htmlFor="description" className="text-sm">
                    توضیحات <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="description"
                    className="admin-input min-h-40"
                    placeholder="توضیحات محصول..."
                    value={form.description}
                    onChange={handleChange}
                />
            </div>

            {/* Colors */}
            <div className="flex flex-col space-y-3 col-span-full">
                <label className="text-sm">
                    رنگ ها <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4 gap-2">
                    {form.colors.map((colorObj, colorIndex) => (
                        <div className="bg-dark p-3 border border-gray-700 rounded-lg space-y-2" key={colorIndex}>
                            {/* Color */}
                            <div className="flex items-center w-full gap-2 ">
                                <input
                                    type="text"
                                    placeholder="نام رنگ (مثال: مشکی)"
                                    value={colorObj.color}
                                    onChange={(e) => updateColor(colorIndex, e.target.value)}
                                    className="admin-input"
                                />
                                {form.colors.length > 1 && (
                                    <button
                                        className="admin-delete-btn"
                                        onClick={() => removeColor(colorIndex)}
                                    >
                                        <IoTrashOutline size={20}/>
                                    </button>
                                )}
                            </div>

                            {/* Images */}
                            <div>
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => document.getElementById(`images-${colorIndex}`)?.click()}
                                >
                                    <span>آپلود عکس</span>
                                    <AiOutlinePlus size={15}/>
                                </button>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    id={`images-${colorIndex}`}
                                    className="hidden"
                                    onChange={(e) => handleImage(colorIndex, e.target.files)}
                                />

                                <div
                                    className="flex gap-2 items-center h-32 border border-gray-700 rounded-lg mt-2 p-3 overflow-x-auto overflow-y-hidden whitespace-nowrap"
                                >
                                    {colorObj.images?.length ?
                                        colorObj.images.map((img, idx) => (
                                            <div className="relative" key={idx}>
                                                <img
                                                    src={img instanceof File ? URL.createObjectURL(img) : img.url}
                                                    alt="preview"
                                                    className="h-24 w-28 object-contain rounded bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(colorIndex, idx)}
                                                    className="absolute top-1 left-1 flex items-center justify-center w-5 h-5 rounded-full bg-primary"
                                                >
                                                    <IoTrashOutline size={15}/>
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="m-auto text-gray-400">
                                                لطفا عکس های محصول رو آپلود نمایید.
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* Sizes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {colorObj.sizes?.map((sizeObj, sizeIndex) => (
                                    <div className="flex gap-2 items-center rounded-lg border border-gray-600 p-2"
                                         key={sizeIndex}>
                                        <input
                                            value={sizeObj.size === 0 ? "" : sizeObj.size}
                                            onChange={(e) => updateSize(colorIndex, sizeIndex, 'size', Number(e.target.value))}
                                            className="admin-input"
                                            placeholder="سایز به عدد"
                                        />

                                        <input
                                            value={sizeObj.stock === 0 ? "" : sizeObj.stock}
                                            onChange={(e) => updateSize(colorIndex, sizeIndex, 'stock', Number(e.target.value))}
                                            className="admin-input"
                                            placeholder="موجودی"
                                        />

                                        {colorObj.sizes!.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeSize(colorIndex, sizeIndex)}
                                                className="admin-delete-btn"
                                            >
                                                <IoTrashOutline size={18}/>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => addSize(colorIndex)}
                                className="secondary-button"
                            >
                                <span>افزودن سایز</span>
                                <AiOutlinePlus size={15}/>
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    className="primary-button w-fit"
                    onClick={addColor}
                >
                    <span>افزودن رنگ</span>
                    <AiOutlinePlus size={15}/>
                </button>
            </div>

            <div className="col-span-full w-full md:w-1/2 mx-auto">
                <button
                    type="submit"
                    className={loading.create || loading.update ? "primary-button-pending w-full" : "primary-button w-full"}
                    disabled={loading.create || loading.update}
                >
                    {id ? loading.update ? "در حال بروزرسانی..." : "بروزرسانی محصول"
                        : loading.create ? "در حال ساخت..." : "ساخت محصول"}
                </button>
            </div>
        </form>
    );
}