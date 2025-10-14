import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const res = NextResponse.json({message: "خروج موفقیت‌آمیز بود"});
    res.cookies.delete("access_token");
    return res;
}
