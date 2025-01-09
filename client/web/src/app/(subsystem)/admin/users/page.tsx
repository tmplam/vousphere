"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import CustomShadcnPagination from "@/components/shared/custom-pagination";
import { Ban, ChevronDown, Eye, LockKeyholeOpen, LucideSettings, Search, UserPlus2 } from "lucide-react";
import { CreateUserDialog } from "@/app/(subsystem)/admin/users/create-user";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import ViewUser from "@/app/(subsystem)/admin/users/view-user";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCachedUserList } from "@/lib/react-query/userCache";
import Loading from "@/app/loading";
import { AnimationButton } from "@/components/shared/custom-button";
import { toggleBlockUser } from "@/apis/user-api";
import { getUserStatusBadge, resolveRoleBadge } from "@/app/(subsystem)/admin/users/user-status-badge";

const userRoleList = ["Admin", "Brand", "Player"];

export default function UserManagement() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const currentPageNullable = searchParams.get("page");
    const role = searchParams.get("role") || "";
    const keyword = searchParams.get("keyword") || "";
    const currentPage = currentPageNullable ? parseInt(currentPageNullable) : 1;
    const { toast } = useToast();
    const {
        data: currentUsers,
        isLoading,
        isError,
        isFetched,
        isPaused,
        refetch,
    } = useCachedUserList(currentPage, 5, keyword, role);
    if (isError) return <p>Something went wrong</p>;
    if (isLoading || isPaused || !currentUsers) return <Loading />; // Isloading is true when api in queryFn was calling and data doesn't exist in cache
    if (isFetched) {
        if (currentUsers == null) return <div>Error to display movie info</div>;
    }
    if (currentUsers == null) return <div>There is an error to display movie</div>;
    const handlePageChange = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = new URLSearchParams(searchParams);
        params.set("keyword", e.target.value);
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    const resetAllFilter = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("keyword");
        params.delete("role");
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    async function handleStatusChange(id: string, status: boolean) {
        setLoading(true);
        const result = await toggleBlockUser(id);
        if (result?.statusCode !== 200) {
            toast({
                title: "Error",
                description: result?.message,
                className: "bg-red-500 text-white",
            });
        } else {
            refetch();
            toast({
                title: "Success",
                description: "User status updated successfully",
                className: "bg-lime-500 text-white",
            });
        }
        setLoading(false);
    }
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }
    const handleFilter = (role: string) => {
        const params = new URLSearchParams(searchParams);
        if (role === "all") {
            params.delete("role");
        } else {
            params.set("role", role);
        }
        const newUrl = `${pathname}?${params.toString()}`;
        replace(newUrl);
    };

    return (
        <div className="rounded-sm">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">User Management</h1>
                <CreateUserDialog>
                    <AnimationButton className="py-[.37rem] px-3 flex items-center">
                        Create User <UserPlus2 size={20} />
                    </AnimationButton>
                </CreateUserDialog>
            </div>
            <div className="flex items-center justify-between my-2 gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="border-gray-200">
                            Sort by:
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => handleFilter("")}>All</DropdownMenuItem>
                                        {userRoleList.map((role) => (
                                            <DropdownMenuItem key={role} onClick={() => handleFilter(role)}>
                                                {role}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        {/* <DropdownMenuItem>Name</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
                {(keyword || role) && (
                    <Badge onClick={resetAllFilter} className="cursor-pointer px-2 py-1 cancel-btn-color text-white">
                        Reset
                    </Badge>
                )}
                <div className="relative w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pr-10 rounded-full border border-gray-200 bg-white dark:bg-black"
                        defaultValue={keyword}
                        onChange={handleSearch}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 px-2">
                        <Search className="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white dark:bg-slate-900 border-gray-200">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-200 hover:bg-gray-200 dark:bg-gray-800">
                            <TableHead>No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead> Actions </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No user found
                                </TableCell>
                            </TableRow>
                        )}
                        {currentUsers.data.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{resolveRoleBadge(user.role)}</TableCell>
                                <TableCell className="content-center">{getUserStatusBadge(user.status)}</TableCell>
                                <TableCell className="flex gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild className="cursor-pointer">
                                            {user.status != "Blocked" ? (
                                                <Ban size={24} strokeWidth={3} color="red" />
                                            ) : (
                                                <LockKeyholeOpen size={24} strokeWidth={3} color="lime" />
                                            )}
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] border border-gray-200">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {user.status != "Blocked" ? "Suspend account" : "Activate account"}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {user.status
                                                        ? "Are you sure you want to suspend this user?"
                                                        : "Are you sure you want to activate this user?"}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button onClick={() => handleStatusChange(user.id, !user.status)}>
                                                        {user.status != "Blocked" ? "Suspend" : "Activate"}
                                                    </Button>
                                                </DialogClose>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <ViewUser user={user}>
                                        <Eye size={25} strokeWidth={3} color="blue" />
                                    </ViewUser>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
                Showing {1} to {5} users
            </div>
            <div className="flex items-center justify-center mt-3">
                <CustomShadcnPagination
                    currentPage={currentUsers.page}
                    totalPages={currentUsers.totalPage}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
