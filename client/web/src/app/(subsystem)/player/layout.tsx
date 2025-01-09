"use client";
import { CSSProperties } from "react";
import { DarkModeToggle } from "@/components/utility/mode-toggle";
import { AuthenticatedRoute, ROLE_PLAYER } from "@/components/shared/authenticatedRoutes";
import Footer from "@/components/shared/footer";
import { Bell } from "lucide-react";
import Notification from "@/app/(subsystem)/admin/notification";

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
        <div className="my-section bg-gradient-to-r from-sky-50 to-fuchsia-50 dark:from-gray-950 dark:to-gray-950">
            {/* <main className="w-full custom-bg-dashboard">
            <div className="px-3 sm:px-8 flex justify-between items-center py-2 mb-3 border-b bg-white dark:bg-slate-800 dark:border-b-gray-50">
                <div className="flex items-center gap-5">
                    <Notification>
                        <Bell size={22} />
                    </Notification>
                    <DarkModeToggle />
                </div>
            </div>
            <Footer />
        </main> */}
            {children}
            <div className="snowflakes" aria-hidden="true">
                <div className="snowflake !text-violet-200">❅</div>
                <div className="snowflake !text-purple-200">❅</div>
                <div className="snowflake !text-fuchsia-200">❆</div>
                <div className="snowflake !text-pink-200">❄</div>
                <div className="snowflake !text-rose-200">❅</div>
                <div className="snowflake !text-lime-200">❆</div>
                <div className="snowflake !text-sky-200">❄</div>
                <div className="snowflake !text-cyan-200">❅</div>
                <div className="snowflake !text-teal-200">❆</div>
                <div className="snowflake !text-yellow-200">❄</div>
            </div>
        </div>
    );
};

export default AuthenticatedRoute(Layout, ROLE_PLAYER);
