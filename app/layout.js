import { Inter, Oxygen, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { UserProvider } from "@/lib/UserContext";
import { LanguageProvider } from "@/lib/LanguageContext";
import { CartSyncProvider } from "@/lib/CartSyncProvider";
import IntroOverlay from "@/components/layout/IntroOverlay";
import ToastContainer from "@/components/common/ToastContainer";
import ConfirmModal from "@/components/common/ConfirmModal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
    title: "OnePC | Premium Hardware Store",
    description: "Elite PC systems and hardware for professionals.",
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/icons/icon-192x192.png",
        apple: "/icons/icon-512x512.png",
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} font-sans`}>
            <body className="bg-surface text-surface-900 selection:bg-primary/10">
                <LanguageProvider>
                    <UserProvider>
                        <CartSyncProvider>
                            <IntroOverlay />
                            <ToastContainer />
                            <ConfirmModal />
                            <div className="min-h-screen flex flex-col">
                                <Navbar />
                                <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 md:px-12 pt-20 md:pt-32 pb-12">
                                    {children}
                                </main>
                                <Footer />
                            </div>
                        </CartSyncProvider>
                    </UserProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
