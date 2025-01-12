import { Calendar, CalendarDays, FileQuestionIcon, Home, SubscriptIcon } from "lucide-react";

export const counterpartNavMain = [
    {
        title: "Dashboard",
        url: "/counterpart",
        icon: Home,
        isActive: false,
    },
    {
        title: "Events",
        url: "/counterpart/event",
        icon: CalendarDays,
        isActive: true,
        items: [
            {
                title: "My events",
                url: "/counterpart/event",
                icon: Calendar,
            },
            {
                title: "Quizzes",
                url: "/counterpart/event/kahoot",
                icon: FileQuestionIcon,
            },
        ],
    },
    {
        title: "Subscription",
        url: "/counterpart/subscription",
        icon: SubscriptIcon,
        // items: [
        //     {
        //         title: "My subscription",
        //         url: "/counterpart/subscription",
        //         icon: SubscriptIcon,
        //     },
        //     {
        //         title: "Register subscription",
        //         url: "/counterpart/subscription/subscribe",
        //         icon: SubscriptIcon,
        //     },
        // ],
    },
];
