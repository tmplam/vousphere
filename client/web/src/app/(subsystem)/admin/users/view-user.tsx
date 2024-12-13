"use client";
import { resolveRoleBadge } from "@/app/(subsystem)/admin/users/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { UserType } from "@/schema/user.schema";
import { Ban } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ViewUser({ children, user }: { children: React.ReactNode; user: UserType }) {
    const handleActiveUser = (user: UserType) => {
        alert("Activate user");
    };
    return (
        <>
            <Dialog>
                <DialogTrigger asChild className="cursor-pointer">
                    {children}
                </DialogTrigger>
                <DialogContent className="max-w-[425px] sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>User info</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <Card>
                            <CardContent className="grid p-4">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                    <div className="font-medium">Full Name:</div>
                                    <div>{user.name}</div>
                                    <div className="font-medium">Email:</div>
                                    <div>{user.email}</div>
                                    <div className="font-medium">Phone:</div>
                                    <div>{user.phone}</div>
                                    <div className="font-medium">Role:</div>
                                    <div className="flex gap-2 divide-x">
                                        {user.roles.map((role) => resolveRoleBadge(role.name))}
                                    </div>
                                    <div className="font-medium">Status:</div>
                                    <div>
                                        <Badge
                                            variant={user.status ? "default" : "destructive"}
                                            className="rounded-full"
                                        >
                                            {user.status ? "Active" : "Suspended"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex justify-center items-center gap-4">
                        <Button className="bg-sky-600" onClick={() => handleActiveUser(user)}>
                            Activate user
                        </Button>
                        <Link href={`/admin/users/view/${user.id}`}>
                            <Button className="bg-lime-600">View and Update</Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
