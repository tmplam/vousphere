"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CounterpartSidebar } from "@/components/shared/sidebar/app-sidebar";
import { CSSProperties } from "react";
import { DarkModeToggle } from "@/components/utility/mode-toggle";
import { AuthenticatedRoute, ROLE_ADMIN, ROLE_COUNTERPART } from "@/components/shared/authenticatedRoutes";

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
            <CounterpartSidebar side="left" variant="floating" collapsible="offcanvas" />
            <main className="w-full custom-bg-dashboard">
                <div className="px-3 sm:px-8 flex justify-between items-center py-2 custom-bg-dashboard-header mb-6 border-b">
                    <SidebarTrigger />
                    <DarkModeToggle />
                </div>
                <div className="mx-3 sm:mx-8 ">{children}</div>
                <div className="my-14 text-center"> Footer </div>
            </main>
        </SidebarProvider>
    );
};

export default AuthenticatedRoute(Layout, ROLE_COUNTERPART);
