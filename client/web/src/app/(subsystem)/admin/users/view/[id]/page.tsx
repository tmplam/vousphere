"use client";
import { CardSkeleton } from "@/app/(subsystem)/admin/skeletons";
import { resolveRoleBadge } from "@/app/(subsystem)/admin/users/user-status-badge";
import { UpdateUserForm } from "@/app/(subsystem)/admin/users/view/[id]/user-update-form";
import ErrorPage from "@/app/error";
import { AnimationButton } from "@/components/shared/custom-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useCachedUserQuery } from "@/lib/react-query/userCache";
import { getQueryParams } from "@/lib/utils";
import { UserType } from "@/schema/auth.schema";
import { ErrorResponse } from "@/schema/http.schema";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function UserDetails() {
    const [update, setUpdate] = useState<boolean>(false);
    const userId = getQueryParams<string>(useParams(), "id");
    const { data: user, isLoading, isError, isPaused } = useCachedUserQuery(userId); // Get query status
    if (isError || user === null) return <ErrorPage />;
    if (isLoading || isPaused || !user) return <CardSkeleton />; // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    if (!isLoading && !user) {
        const error = user as ErrorResponse;
        toast({
            title: "User not found",
            description: error?.message,
            variant: "destructive",
        });
        return <ErrorPage />;
    }
    console.log(user);
    return (
        <>
            {update ? (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold">Update info</h1>
                    </div>
                    <div className="w-[70vw] mx-4 sm:w-sm md:w-sm lg:w-sm xl:w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-black shadow-xl rounded-lg ">
                        <UpdateUserForm user={user} back={() => setUpdate(!update)} />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold">User information</h1>
                    </div>
                    <div className="w-[70vw] mx-4 sm:w-sm md:w-sm lg:w-sm xl:w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white dark:bg-black shadow-xl rounded-lg">
                        <div className="rounded-t-lg h-48 overflow-hidden">
                            <img
                                className="object-cover object-top w-full"
                                src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                alt="Mountain"
                            />
                        </div>
                        <div className="mx-auto w-52 h-52 relative -mt-32 border-4 border-white rounded-full overflow-hidden">
                            <img
                                className="object-cover object-center h-52"
                                src={
                                    user?.image ||
                                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                                }
                                alt="Woman looking front"
                            />
                        </div>
                        <div className="flex flex-col mt-2 justify-center items-center gap-1">
                            <h2 className="font-semibold text-2xl">Sarah Smith</h2>
                            <div className="flex gap-2">{resolveRoleBadge(user.role)}</div>
                        </div>
                        <div className="info-section bg-white dark:bg-black shadow-md border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                            <div className="info-item flex justify-between items-center py-2 border-b">
                                <span className="info-label font-medium ">ID:</span>
                                <span className="info-value">{user.id}</span>
                            </div>
                            <div className="info-item flex justify-between items-center py-2 border-b">
                                <span className="info-label font-medium ">Email:</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-item flex justify-between items-center py-2 border-b">
                                <span className="info-label font-medium ">Phone:</span>
                                <span className="info-value">{user.phoneNumber || "N/A"}</span>
                            </div>
                            <div className="info-item flex justify-between items-center py-2 border-b">
                                <span className="info-label font-medium ">Role:</span>
                                <Badge
                                    variant={user.status ? "default" : "destructive"}
                                    className={`rounded-full text-white ${user.status ? "bg-violet-600" : ""}`}
                                >
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="info-item flex justify-between items-center py-2">
                                <span className="info-label font-medium ">Status:</span>
                                <span
                                    className={`info-value font-bold ${
                                        user.status === "Verified" ? "text-green-500" : "text-red-500"
                                    }`}
                                >
                                    {user.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-center items-center py-5 gap-4">
                            <Button className="cancel-btn-color text-md">
                                <Link href="/admin/users">Back</Link>
                            </Button>
                            <AnimationButton onClick={() => setUpdate(!update)} className="px-2 py-[.39rem]">
                                Update info
                            </AnimationButton>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
