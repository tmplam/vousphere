"use client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameType } from "@/schema/game.schema";
import ViewGame from "@/app/(subsystem)/admin/games/(management)/view-game";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";

const games: GameType[] = [
    {
        id: "HDFS-sdfd",
        name: "HQ Trivia Game",
        type: "Quiz",
        image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQHTS5qluf5pGj6LUlIkPUXGK0ez0V0p67SCr-sZOnWVsLF4LwiqPbz4-qqVrMQygAuJWFE_Ima1aIE1Xn3MRHAihHqAIBx1JkZusra7dFGig",
        allowTrading: true,
        guide: "User will have to answer the questions and win the game if they get it right.",
    },
    {
        id: "HDFS-2323",
        name: "Shake your phone",
        type: "collect",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCSjazoiTIpiz00YLORty3X6_r9XzbgaIOaw&s",
        allowTrading: false,
        guide: "Shake your phone to randomly receive rewards or combine items to exchange for rewards.",
    },
];

export default function GameCard() {
    return (
        <>
            <h1 className="text-2xl md:text-4xl font-bold">Game Management</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 py-5 dark:text-white">
                {games.map((game, index) => (
                    <Card
                        className="w-full max-w-md border shadow-sm hover:shadow-md transition-all shadow-slate-50 dark:hover:shadow-slate-50 rounded-lg"
                        key={index}
                    >
                        <CardHeader className="relative !p-0">
                            <img src={game.image} alt="Game" className="h-48 w-full object-cover rounded-t" />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-2 text-lg font-bold w-full">
                                {game.name}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-1 p-4">
                            <div className="text-sm  flex items-center gap-3">
                                <span className="font-semibold">Game type:</span>
                                <span className={`${getBadge()} capitalize`}>{game.type}</span>
                            </div>
                            <div className="text-sm  flex items-center gap-3">
                                <span className="font-semibold">Allow trading: </span>
                                {game.allowTrading ? (
                                    <Badge className="bg-green-500 text-white">Allow</Badge>
                                ) : (
                                    <Badge className="bg-red-500 text-white">Not allow</Badge>
                                )}
                            </div>
                            <div className="text-sm ">
                                <span className="font-semibold line-clamp-2">Guide:</span> {game.guide}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-center">
                            <Link href={`/admin/games/${game.id}`}>
                                <Button>View details</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>{" "}
        </>
    );
}
