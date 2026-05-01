"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SeedPage() {
    const router = useRouter()

    useEffect(() => {
        // Automatically redirect to home after 3 seconds
        const timer = setTimeout(() => {
            router.push("/")
        }, 3000)
        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-4xl font-black">
                !
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Access Denied</h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest text-center max-w-sm">
                The database seeding module has been decommissioned for security. 
                You will be redirected shortly.
            </p>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-progress" />
            </div>
        </div>
    )
}
