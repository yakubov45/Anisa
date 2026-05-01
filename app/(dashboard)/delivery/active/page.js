import { redirect } from "next/navigation";

export default function ActiveDeliveriesPage() {
    // Empty pages cause build errors in Next.js. 
    // Redirecting to the main orders queue where active jobs are managed.
    redirect("/delivery/orders");
}
