"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/shared/sidebar/app-sidebar";
import { CSSProperties } from "react";
import { DarkModeToggle } from "@/components/utility/mode-toggle";
import { AuthenticatedRoute, ROLE_ADMIN } from "@/components/shared/authenticatedRoutes";
import Footer from "@/components/shared/footer";

/**
 * @description Layout for dashboard, contains sidebar and main content
 * @references https://ui.shadcn.com/docs/components/sidebar
 */

const sidebarStyle = {
    "--sidebar-width": "17rem",
    "--sidebar-width-mobile": "17rem",
} as CSSProperties;

const Layout = ({ children }: { children: React.ReactNode }) => {
    // const defaultOpen = sessionStorage.get("sidebar:state")?.value === "true";
    return (
        <SidebarProvider style={sidebarStyle}>
            <AdminSidebar side="left" variant="floating" collapsible="offcanvas" />
            <main className="w-full custom-bg-dashboard">
                <div className="px-3 sm:px-8 flex justify-between items-center py-2 custom-bg-dashboard-header mb-6 border-b">
                    <SidebarTrigger />
                    <DarkModeToggle />
                </div>
                <div className="mx-3 sm:mx-8 min-h-screen">{children}</div>
                <Footer />
            </main>
        </SidebarProvider>
    );
};

export default AuthenticatedRoute(Layout, ROLE_ADMIN);
