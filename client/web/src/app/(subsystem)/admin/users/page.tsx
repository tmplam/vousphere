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
import { UserType } from "@/schema/auth.schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCachedUserList } from "@/lib/react-query/userCache";
import Loading from "@/app/loading";
import { AnimationButton } from "@/components/shared/custom-button";

export const resolveRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
        case "admin":
            return (
                <Badge key="admin" variant="default">
                    Admin
                </Badge>
            );
        case "user":
            return (
                <Badge key="user" className="bg-amber-600 text-white">
                    User
                </Badge>
            );
        case "counterpart":
            return (
                <Badge key="counterpart" className="bg-blue-600 text-white">
                    Counterpart
                </Badge>
            );
        default:
            return null;
    }
};

export default function UserManagement() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const { replace } = useRouter();
    const searchParams = useSearchParams();
    const currentPageNullable = searchParams.get("page");
    const currentPage = currentPageNullable ? parseInt(currentPageNullable) : 1;
    const { toast } = useToast();
    const totalPages = 1;
    const { data: currentUsers, isLoading, isError, isFetched, isPaused } = useCachedUserList(currentPage);
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
        console.log(newUrl);
        replace(newUrl);
    };
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    async function handleStatusChange(id: string, status: boolean) {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        toast({
            title: "Success",
            description: "User status updated successfully",
            className: "bg-green-500 text-white",
        });
    }
    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="rounded-sm">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">User Management</h1>
                <CreateUserDialog>
                    <AnimationButton className="py-1 px-2 font-semibold flex items-center">
                        Create User <UserPlus2 size={20} />
                    </AnimationButton>
                </CreateUserDialog>
            </div>
            <div className="flex items-center justify-between my-2 gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            Sort by:
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {/* <DropdownMenuItem>Role</DropdownMenuItem> */}

                        <DropdownMenuGroup>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Role</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Admin</DropdownMenuItem>
                                        <DropdownMenuItem>Counterpart</DropdownMenuItem>
                                        {/* <DropdownMenuSeparator /> */}
                                        <DropdownMenuItem>User</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuGroup>
                        <DropdownMenuItem>Name</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="relative w-full max-w-md">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="pr-10 rounded-full " // Extra padding to accommodate the button
                        onChange={handleSearch}
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 px-2">
                        <Search className="w-4 h-4" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto rounded-md border bg-white dark:bg-slate-900">
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
                        {currentUsers.length === 0 && (
                            <TableCell colSpan={6} className="text-center">
                                No users found
                            </TableCell>
                        )}
                        {currentUsers.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {user.roles.map((role) => resolveRoleBadge(role.name))}
                                    </div>
                                </TableCell>
                                <TableCell className="content-center">
                                    <Badge
                                        variant={user.status ? "default" : "destructive"}
                                        className={`rounded-full text-white ${user.status ? "bg-green-600" : ""}`}
                                    >
                                        {user.status ? "Active" : "Suspended"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="flex gap-3">
                                    <Dialog>
                                        <DialogTrigger asChild className="cursor-pointer">
                                            {user.status ? (
                                                <Ban size={24} strokeWidth={3} color="red" />
                                            ) : (
                                                <LockKeyholeOpen size={24} strokeWidth={3} color="lime" />
                                            )}
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {user.status ? "Suspend account" : "Activate account"}
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
                                                        {user.status ? "Suspend" : "Activate"}
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
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
