import React from 'react';
import {productService} from "@/services/productService";
import ProductLayout from "@/component/product/ProductLayout";
import {cookies} from "next/headers";
import {verifyToken} from "@/lib/auth";
import {authService} from "@/services/authService";

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function Page({params}: PageProps) {
    const {id} = await params;
    const product = await productService.getOne(Number(id));

    const token = (await cookies()).get("access_token")?.value;
    const userId = token ? verifyToken(token)?.id : null;

    let user = null;
    if (userId) {
        user = await authService.getMe(token as string);
    }

    return <ProductLayout product={product} user={user}/>;
}