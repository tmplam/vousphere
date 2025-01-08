import { Gamepad2, Home, MessageCircleQuestion, PartyPopper, Shapes, UserSquare2Icon } from "lucide-react";

export const adminNavMain = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
        isActive: false,
    },
    {
        title: "User management",
        url: "/admin/users",
        icon: UserSquare2Icon,
        isActive: false,
    },
    {
        title: "Event management",
        url: "/admin/event",
        icon: PartyPopper,
        isActive: false,
    },
    {
        title: "Game management",
        url: "/admin/games",
        icon: Gamepad2,
        isActive: true,
        // items: [
        //     {
        //         title: "Collections",
        //         url: "/admin/games",
        //         icon: Shapes,
        //         isActive: true,
        //     },
        // ],
    },
];
