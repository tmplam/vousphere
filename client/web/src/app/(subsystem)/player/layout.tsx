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

    return (
        <div className="my-section bg-gradient-to-r from-sky-50 to-fuchsia-50 dark:from-gray-950 dark:to-gray-950">
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
