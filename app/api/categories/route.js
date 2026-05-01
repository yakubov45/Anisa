import { NextResponse } from "next/server";
import { categoryService } from "@/lib/services/category.service";

export async function GET() {
    const categories = await categoryService.getAll();
    return NextResponse.json(categories);
}
