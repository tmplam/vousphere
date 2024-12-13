"use client";

import PageNotFound from "@/app/not-found";
import { UserType } from "@/schema/user.schema";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { RoleType } from "@/schema/types/common";

export const hasRole = (role: string | null | undefined, specificRole: string) => {
    if (!role) return false;
    return role.toLowerCase() === specificRole.toLowerCase();
};

export const includeRole = (roles: RoleType[] | null | undefined, specificRole: string) => {
    console.log(roles);
    console.log(specificRole);
    if (!roles) return false;
    return roles.some((role) => role.name?.toLowerCase() === specificRole.toLowerCase());
};

export const ROLE_ADMIN = "admin";
export const ROLE_COUNTERPART = "counterpart";

export const AuthenticatedRoute = (Component: any, role: string) => {
    return function AuthRoute(props: any) {
        const router = useRouter();
        const authenticatedUserState = useAppSelector((state) => state.userState);
        useEffect(() => {
            if (!authenticatedUserState) {
                console.log("Null");
                router.push("/login");
            }
        }, []);
        if (!authenticatedUserState) return null;
        const authenticatedUser = authenticatedUserState.user as UserType;
        if (!includeRole(authenticatedUser.roles, role)) {
            console.log("False");
            return <PageNotFound />;
        }
        return <Component {...props} />;
    };
};
