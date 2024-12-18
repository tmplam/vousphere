"use client";
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
import { CreateUserForm } from "@/app/(subsystem)/admin/users/user-create-form";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CreateUserDialog({ children }: { children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[80vw] sm:max-w-[60vw] md:max-w-[70vw] lg:max-w-[70vw] xl:max-w-[60vw] rounded-md">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl uppercase text-gradient">Create user</DialogTitle>
                </DialogHeader>
                <ScrollArea className="max-h-[80vh]">
                    <CreateUserForm />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
