"use client";
import { adminNavMain } from "@/app/(subsystem)/admin/nav-links";
import { counterpartNavMain } from "@/app/(subsystem)/counterpart/nav-links";
import { NavMain } from "@/components/shared/sidebar/admin-dashboard/nav-main";
import { NavUser } from "@/components/shared/sidebar/admin-dashboard/nav-user";
import { TeamSwitcher } from "@/components/shared/sidebar/team-switcher";
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
        <Sidebar {...props}>
            <SidebarHeader className="custom-bg-slate">
                <h3 className="text-lg text-center">ADMIN PAGE</h3>
            </SidebarHeader>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarContent className="custom-bg-white">
                <NavMain items={adminNavMain} />
                {/* <NavProjects projects={projects} /> */}
            </SidebarContent>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarFooter className="custom-bg-slate">
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
        <Sidebar {...props}>
            <SidebarHeader className="custom-bg-slate">
                <TeamSwitcher teams={teamWorkspaces} />
            </SidebarHeader>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarContent className="custom-bg-white">
                <NavMain items={counterpartNavMain} />
                {/* <NavProjects projects={projects} /> */}
            </SidebarContent>
            <Separator orientation="horizontal" className="mt-0" />
            <SidebarFooter className="custom-bg-slate">
                <NavUser />
            </SidebarFooter>
            {/* <SidebarRail /> */}
        </Sidebar>
    );
}
