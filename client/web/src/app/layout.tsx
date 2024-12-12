"use client";
// import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/utility/theme-provider";
import { roboto } from "@/app/fonts/fonts";
import { Toaster } from "@/components/ui/toaster";
// import ReduxStoreProvider from "@/app/StoreProvider"; // I won't use this component in this project
// import ReactQueryProvider from "@/app/ReactQueryProvider";
import { Suspense } from "react";
// import { Provider } from "react-redux";
// import { persistor } from "@/lib/redux/store";
// import { PersistGate } from "redux-persist/integration/react";
// import ReduxStoreProvider from "@/app/ReduxStoreProvider";
export const dynamic = "force-dynamic";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head />
            <body className={`${roboto.className} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {/* <ReduxStoreProvider>
                        <PersistGate loading={null} persistor={persistor}>
                            <ReactQueryProvider> */}
                    <Suspense>{children}</Suspense>
                    <Toaster />
                    {/* </ReactQueryProvider>
                        </PersistGate>
                    </ReduxStoreProvider> */}
                </ThemeProvider>
            </body>
        </html>
    );
}

/**
 * suppressHydrationWarning is added to avoid warning message from Next.js when implementing dark mode
 * <ThemeProvider> is used to remark the current theme
 */
