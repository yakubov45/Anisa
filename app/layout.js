import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
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
import AdminOrderListener from "@/components/common/AdminOrderListener";

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });

export const metadata = {
    metadataBase: new URL('https://cucinastudio.com'),
    title: {
        template: '%s | Cucina Studio',
        default: 'Cucina Studio | Premium Kitchenware & Culinary Goods',
    },
    description: "Discover premium cookware, artisan knives, elegant tableware, and professional kitchen appliances. Curated for the discerning home chef.",
    openGraph: {
        title: 'Cucina Studio | Premium Kitchenware & Culinary Goods',
        description: 'Premium cookware, knives, and kitchen essentials for the discerning chef.',
        url: 'https://cucinastudio.com',
        siteName: 'Cucina Studio',
        images: [
            {
                url: '/videos/og-banner.jpg', // Placeholder for now
                width: 1200,
                height: 630,
            },
        ],
        locale: 'en_US',
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
        <html lang="en" className={`${playfair.variable} ${jakarta.variable} font-sans`} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                if (sessionStorage.getItem("cucina_intro_shown")) {
                                    document.documentElement.classList.add("no-intro");
                                }
                            } catch (e) {}
                        `,
                    }}
                />
            </head>
            <body className="bg-background text-foreground selection:bg-primary/10" suppressHydrationWarning>
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
                                <AdminOrderListener />
                                <CompareWidget />
                                <div className="min-h-screen flex flex-col">
                                    <Navbar />
                                    <main className="flex-1 w-full bg-[#FBF9F5]">
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
