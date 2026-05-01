import { z } from "zod";

export const ProductSchema = z.object({
    name: z.string().min(3, "Name must be 3+ characters"),
    price: z.number().positive("Price must be positive"),
    category: z.string().min(1, "Category is required"),
    countInStock: z.number().int().nonnegative("Stock cannot be negative"),
    image: z.string().url().optional(),
    brand: z.string().min(1, "Brand is required"),
    specs: z.string().min(10, "Specs must be detailed")
});

export const OrderSchema = z.object({
    items: z.array(z.any()).min(1, "Cart cannot be empty"),
    shippingAddress: z.object({
        city: z.string().min(1, "City is required"),
        street: z.string().min(1, "Street is required"),
        phone: z.string().min(9, "Valid phone required")
    }),
    paymentMethod: z.enum(["Click", "Payme", "Cash"]),
    total: z.number().positive()
});
