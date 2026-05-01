import { NextResponse } from "next/server";
import { productService } from "@/lib/services/product.service";

export async function GET() {
    try {
        const products = await productService.getAll();
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const product = await productService.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
