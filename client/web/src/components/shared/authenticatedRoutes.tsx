"use client";

import PageNotFound from "@/app/not-found";
import Loading from "@/app/loading";
import ErrorPage from "@/app/error";
import { useCachedUserInfo } from "@/lib/react-query/userCache";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateUser } from "@/lib/redux/slices/userSlice";

export const hasRole = (role: string | null | undefined, specificRole: string) => {
    if (!role) return false;
    return role.toLowerCase() === specificRole.toLowerCase();
};

// export const includeRole = (roles: RoleType[] | null | undefined, specificRole: string) => {
//     console.log(roles);
//     console.log(specificRole);
//     if (!roles) return false;
//     return roles.some((role) => role.name?.toLowerCase() === specificRole.toLowerCase());
// };

export const ROLE_ADMIN = "admin";
export const ROLE_COUNTERPART = "brand";
export const ROLE_PLAYER = "player";

export const AuthenticatedRoute = (Component: any, role: string) => {
    return function AuthRoute(props: any) {
        const dispatch = useAppDispatch();
        const { data: currentUser, isLoading, isError, isFetched } = useCachedUserInfo();
        if (isError) return <ErrorPage />;
        if (isFetched) {
            if (currentUser == null) return <PageNotFound />;
        }
        if (!isLoading && currentUser == null) {
            return <PageNotFound />;
        }
        if (currentUser) {
            if (hasRole(currentUser.role, role)) {
                dispatch(updateUser(currentUser));
                return <Component {...props} />;
            } else {
                return <PageNotFound />;
            }
        }
        return <Loading />;
    };
};
