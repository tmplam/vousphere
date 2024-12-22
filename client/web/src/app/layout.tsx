"use client";
import "./globals.css";
import { ThemeProvider } from "@/components/utility/theme-provider";
import { roboto } from "@/assets/fonts/fonts";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { persistor } from "@/lib/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import ReactQueryProvider from "@/lib/react-query/ReactQueryProvider";
import ReduxStoreProvider from "@/lib/redux/ReduxStoreProvider";
export const dynamic = "force-dynamic";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link href="https://api.mapbox.com/mapbox-gl-js/v1.10.1/mapbox-gl.css" rel="stylesheet" />
            </head>
            <body className={`${roboto.className} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    <ReduxStoreProvider>
                        <PersistGate loading={null} persistor={persistor}>
                            <ReactQueryProvider>
                                <Suspense>{children}</Suspense>
                                <Toaster />
                            </ReactQueryProvider>
                        </PersistGate>
                    </ReduxStoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

/**
 * suppressHydrationWarning is added to avoid warning message from Next.js when implementing dark mode
 * <ThemeProvider> is used to remark the current theme
 */
