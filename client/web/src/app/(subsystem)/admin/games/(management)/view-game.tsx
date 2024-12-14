"use client";
import { GameType } from "@/schema/game.schema";
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
import React from "react";
import Image from "next/image";

export default function ViewGame({ children, game }: { children: React.ReactNode; game: GameType }) {
    return (
        <Dialog>
            <DialogTrigger asChild className="cursor-pointer">
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-[425px] sm:max-w-[900px]">
                <DialogHeader>
                    <DialogTitle>User info</DialogTitle>
                </DialogHeader>

                <div className="flex justify-center items-center gap-4">
                    <Button className="bg-sky-600">Update status</Button>
                    <Button className="bg-lime-600">Update game</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
