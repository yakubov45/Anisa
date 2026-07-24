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
import CurrencyInitializer from "@/components/common/CurrencyInitializer";
import CartDrawer from "@/components/layout/CartDrawer";
import NotificationsDrawer from "@/components/layout/NotificationsDrawer";
import CompareWidget from "@/components/common/CompareWidget";
import SmoothScrollProvider from "@/components/common/SmoothScroll";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
    metadataBase: new URL('https://onepc.uz'),
    title: {
        template: '%s | OnePC',
        default: 'OnePC | Premium Hardware & Gaming Setup',
    },
    description: "Elite PC systems, custom builds, hardware components and gaming setups for professionals. Top quality hardware acquisition ecosystem.",
    openGraph: {
        title: 'OnePC | Premium Hardware Store',
        description: 'Elite PC systems and hardware for professionals.',
        url: 'https://onepc.uz',
        siteName: 'OnePC',
        images: [
            {
                url: '/videos/og-banner.jpg', // Placeholder for now
                width: 1200,
                height: 630,
            },
        ],
        locale: 'uz_UZ',
        type: 'website',
    },
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/icons/logo.svg",
        apple: "/icons/logo.svg",
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable} font-sans`} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                if (sessionStorage.getItem("onepc_intro_shown")) {
                                    document.documentElement.classList.add("no-intro");
                                }
                            } catch (e) {}
                        `,
                    }}
                />
            </head>
            <body className="bg-surface text-surface-900 selection:bg-primary/10" suppressHydrationWarning>
                <LanguageProvider>
                    <UserProvider>
                        <CartSyncProvider>
                            <SmoothScrollProvider>
                                <IntroOverlay />
                                <ToastContainer />
                                <ConfirmModal />
                                <CurrencyInitializer />
                                <CartDrawer />
                                <NotificationsDrawer />
                                <CompareWidget />
                                <div className="min-h-screen flex flex-col">
                                    <Navbar />
                                    <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 md:px-12 pt-16 md:pt-24 pb-12">
                                        {children}
                                    </main>
                                    <Footer />
                                </div>
                            </SmoothScrollProvider>
                        </CartSyncProvider>
                    </UserProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
