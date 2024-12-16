"use client";
import { adminNavMain } from "@/app/(subsystem)/admin/nav-links";
import { counterpartNavMain } from "@/app/(subsystem)/counterpart/nav-links";
import { NavMain } from "@/components/shared/sidebar/admin-dashboard/nav-main";
import { NavUser } from "@/components/shared/sidebar/nav-user";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { Frame, PieChart, User2Icon } from "lucide-react";

const projects = [
    {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
    },
    {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
    },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props} className="border-gray-50 p-1 pr-0">
            <SidebarHeader className="bg-gray-100 dark:bg-slate-800 border-b-gray-50">
                <h3 className="text-3xl text-center font-bold dynamic-text-2 py-3">ADMIN PAGE</h3>
            </SidebarHeader>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarContent className="bg-white dark:bg-black">
                <NavMain items={adminNavMain} />
                {/* <NavProjects projects={projects} /> */}
            </SidebarContent>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarFooter className="bg-gray-100 dark:bg-slate-800">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

export function CounterpartSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const teamWorkspaces = [
        {
            name: "VouSphere",
            logo: User2Icon,
            plan: "Group information",
        },
    ];
    return (
        <Sidebar {...props} className="border-gray-50 p-1 pr-0">
            <SidebarHeader className="bg-gray-100 dark:bg-slate-800 border-b-gray-50">
                {/* <TeamSwitcher teams={teamWorkspaces} /> */}
                <h3 className="text-3xl text-center font-semibold uppercase dynamic-text-2">counterpart page</h3>
            </SidebarHeader>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarContent className="bg-white dark:bg-black">
                <NavMain items={counterpartNavMain} />
                {/* <NavProjects projects={projects} /> */}
            </SidebarContent>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarFooter className="bg-gray-100 dark:bg-slate-800">
                <NavUser />
            </SidebarFooter>
            {/* <SidebarRail /> */}
        </Sidebar>
    );
}
