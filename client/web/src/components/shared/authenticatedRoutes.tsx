"use client";

import PageNotFound from "@/app/not-found";
import { UserType } from "@/schema/user.schema";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { RoleType } from "@/schema/types/common";

export const hasRole = (role: string | null | undefined, specificRole: string) => {
    if (!role) return false;
    return role.toLowerCase() === specificRole.toLowerCase();
};

export const includeRole = (roles: RoleType[] | null | undefined, specificRole: string) => {
    if (!roles) return false;
    return roles.some((role) => role.name?.toLowerCase() === specificRole.toLowerCase());
};

export const ROLE_ADMIN = "admin";
export const ROLE_COUNTERPART = "counterpart";

export const AuthenticatedRoute = (Component: any, role: string) => {
    return function AuthRoute(props: any) {
        const authenticatedUser = useAppSelector((state) => state.userState) as { isLoggedIn: boolean; user: UserType };
        const router = useRouter();
        useLayoutEffect(() => {
            if (!authenticatedUser.isLoggedIn) {
                router.push("/login");
            }
        }, [router, authenticatedUser]);
        if (!includeRole(authenticatedUser?.user?.roles, role)) return <PageNotFound />;
        if (!authenticatedUser.isLoggedIn) return null;
        return <Component {...props} />;
    };
};
