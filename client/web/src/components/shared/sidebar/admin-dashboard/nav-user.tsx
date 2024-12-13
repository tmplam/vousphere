"use client";

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useAppSelector } from "@/lib/redux/hooks";
import { useToast } from "@/hooks/use-toast";
import { UserType } from "@/schema/user.schema";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { defaultAvatar } from "@/lib/utils";

export function NavUser() {
    const { isMobile } = useSidebar();
    const { toast } = useToast();
    const router = useRouter();
    const userAuth = useAppSelector((state) => state.userState) as UserType;
    useLayoutEffect(() => {
        if (!userAuth) router.push("/login");
    }, [userAuth]);
    const handleLogout = () => {
        toast({
            title: "Logout",
            description: "You are logging out",
            variant: "default",
            duration: 3000,
        });
        localStorage.removeItem("persist:userState");
        localStorage.removeItem("persist:root");
        router.push("/login");
    };
    if (!userAuth) {
        return null;
    }
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={defaultAvatar} alt="Default Avatar" />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">{userAuth.name}</span>
                                <span className="truncate text-xs">{userAuth.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={defaultAvatar} alt={"Default Avatar"} />
                                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{userAuth.name}</span>
                                    <span className="truncate text-xs">{userAuth.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                <Sparkles />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator /> */}
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="cursor-pointer">
                                <BadgeCheck />
                                Account
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
