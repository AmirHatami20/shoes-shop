import React from "react";
import SearchLayout from "@/component/search/SearchLayout";
import {brandService} from "@/services/brandService";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({params}: PageProps) {
    const resolvedParams = await params;
    const brands = await brandService.getAll()

    return <SearchLayout slug={resolvedParams.slug} brands={brands}/>;
}
