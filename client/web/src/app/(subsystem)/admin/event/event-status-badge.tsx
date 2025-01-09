"use client";

import { Badge } from "@/components/ui/badge";

export const getBadgeCSS = (status: string) => {
    switch (status.toLowerCase()) {
        case "created":
            return <Badge className="bg-sky-500 text-white">{status}</Badge>;
        case "pending":
            return <Badge className="bg-yellow-500 text-white">{status}</Badge>;
        case "ended":
            return <Badge className="bg-violet-500 text-white">{status}</Badge>;
        case "rejected":
            return <Badge className="bg-red-500 text-white">{status}</Badge>;
        case "happening":
            return <Badge className="bg-lime-500 text-white">{status}</Badge>;
    }
};

export const getEventStatusClassname = (status: string) => {
    switch (status.toLowerCase()) {
        case "created":
            return "text-sky-500 border border-sky-500";
        case "pending":
            return "text-yellow-500  border border-yellow-500";
        case "happening":
            return "text-violet-500  border border-violet-500";
        case "ended":
            return "text-black dark:text-white  border border-black dark:border-white-500";
        case "rejected":
            return "text-red-500 border border-red-500";
        default:
            return "";
    }
};
