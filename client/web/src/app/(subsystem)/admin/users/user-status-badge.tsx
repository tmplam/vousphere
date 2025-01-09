"use client";

import { Badge } from "@/components/ui/badge";
import { JSX } from "react";

export const getUserStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case "created":
            return <Badge className="bg-sky-500 text-white">{status}</Badge>;
        case "updateinforequired ":
            return <Badge className="bg-yellow-500 text-white">{status}</Badge>;
        case "verified":
            return <Badge className="bg-lime-500 text-white">{status}</Badge>;
        case "blocked":
            return <Badge className="bg-red-500 text-white">{status}</Badge>;
        default:
            return <Badge className="bg-violet-500 text-white">{status}</Badge>;
    }
};

export const getUserStatusTextClassname = (status: string) => {
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

export const resolveRoleBadge = (role: string): JSX.Element => {
    switch (role.toLowerCase()) {
        case "admin":
            return (
                <Badge key="admin" className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    Admin
                </Badge>
            );
        case "player":
            return (
                <Badge
                    key="user"
                    className="bg-gradient-to-br from-yellow-400 from-10% via-orange-500 via-30% to-rose-500 to-90% text-white"
                >
                    User
                </Badge>
            );
        case "brand":
            return (
                <Badge
                    key="brand"
                    className="bg-gradient-to-tr from-indigo-400 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white"
                >
                    Brand
                </Badge>
            );
        default:
            return <></>;
    }
};
