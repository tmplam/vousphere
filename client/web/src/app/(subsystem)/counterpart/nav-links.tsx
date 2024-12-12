import { Calendar, CalendarDays, FileQuestionIcon, Home, SubscriptIcon } from "lucide-react";

export const counterpartNavMain = [
    {
        title: "Dashboard",
        url: "/counterpart",
        icon: Home,
        isActive: false,
    },
    {
        title: "Event",
        url: "/counterpart/event",
        icon: CalendarDays,
        isActive: true,
        items: [
            {
                title: "Event Overview",
                url: "/counterpart/event",
                icon: Calendar,
            },
            {
                title: "Questions",
                url: "/counterpart/event/kahoot",
                icon: FileQuestionIcon,
            },
        ],
    },
    {
        title: "Subscription",
        url: "/counterpart/subscription",
        icon: SubscriptIcon,
        items: [
            {
                title: "My subscription",
                url: "/counterpart/subscription",
                icon: SubscriptIcon,
            },
            {
                title: "Register subscription",
                url: "/counterpart/subscription/subscribe",
                icon: SubscriptIcon,
            },
        ],
    },
];
