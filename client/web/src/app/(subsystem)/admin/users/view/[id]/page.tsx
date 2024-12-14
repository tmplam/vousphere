"use client";
import { CardSkeleton } from "@/app/(subsystem)/admin/(dashboard)/skeletons";
import { resolveRoleBadge } from "@/app/(subsystem)/admin/users/page";
import { UpdateUserForm } from "@/app/(subsystem)/admin/users/view/[id]/user-update-form";
import ErrorPage from "@/app/error";
import { Button } from "@/components/ui/button";
import { useCachedUserQuery } from "@/lib/react-query/userCache";
import { getQueryParams } from "@/lib/utils";
import { UserType } from "@/schema/auth.schema";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function UserDetails() {
    const [update, setUpdate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const userId = getQueryParams<string>(useParams(), "id");
    const { data: user, isLoading, isError, isPaused } = useCachedUserQuery(userId); // Get query status
    if (isError || user === null) return <ErrorPage />;
    if (isLoading || isPaused || !user) return <CardSkeleton />; // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    return (
        <>
            {update ? (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold">Update info</h1>
                    </div>
                    <div className="w-[70vw] mx-4 sm:w-sm md:w-sm lg:w-sm xl:w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white shadow-xl rounded-lg text-gray-900">
                        <UpdateUserForm user={user} back={() => setUpdate(!update)} />
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold">User information</h1>
                    </div>
                    <div className="w-[70vw] mx-4 sm:w-sm md:w-sm lg:w-sm xl:w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-white shadow-xl rounded-lg text-gray-900">
                        <ViewUserInfo user={user} />
                        <div className="flex justify-center items-center py-5 gap-4">
                            <Button>
                                <Link href="/admin/users">Back</Link>
                            </Button>
                            <Button onClick={() => setUpdate(!update)} className="bg-lime-500 hover:bg-lime-600">
                                Update info
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

function ViewUserInfo({ user }: { user: UserType }) {
    return (
        <>
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
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
                    alt="Woman looking front"
                />
            </div>
            <div className="flex flex-col mt-2 justify-center items-center gap-1">
                <h2 className="font-semibold">Sarah Smith</h2>
                <div className="flex gap-2">{user.roles.map((role) => resolveRoleBadge(role.name))}</div>
            </div>
            <div className="info-section bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
                <div className="info-item flex justify-between items-center py-2 border-b">
                    <span className="info-label font-medium text-gray-600">ID:</span>
                    <span className="info-value text-gray-800">{user.id}</span>
                </div>
                <div className="info-item flex justify-between items-center py-2 border-b">
                    <span className="info-label font-medium text-gray-600">Username:</span>
                    <span className="info-value text-gray-800">{user.username}</span>
                </div>
                <div className="info-item flex justify-between items-center py-2 border-b">
                    <span className="info-label font-medium text-gray-600">Email:</span>
                    <span className="info-value text-gray-800">{user.email}</span>
                </div>
                <div className="info-item flex justify-between items-center py-2 border-b">
                    <span className="info-label font-medium text-gray-600">Phone:</span>
                    <span className="info-value text-gray-800">{user.phone}</span>
                </div>
                <div className="info-item flex justify-between items-center py-2">
                    <span className="info-label font-medium text-gray-600">Status:</span>
                    <span className={`info-value font-bold ${user.status ? "text-green-500" : "text-red-500"}`}>
                        {user.status ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>
        </>
    );
}
