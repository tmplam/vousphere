"use client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameType } from "@/schema/game.schema";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getBadge } from "@/app/(subsystem)/admin/games/[id]/badge-ui";
import ErrorPage from "@/app/error";
import { GameListSkeleton } from "@/app/(subsystem)/admin/(dashboard)/skeletons";
import { useCachedGameListQuery } from "@/lib/react-query/gameCache";
import AnimationColorfulButton from "@/components/shared/custom-button";

export default function GameCard() {
    const { data: gameList, isLoading, isError, isPaused } = useCachedGameListQuery();
    if (isError || gameList === null) return <ErrorPage />;
    if (isLoading || isPaused || !gameList)
        return (
            <>
                <h1 className="text-2xl md:text-4xl font-bold text-gradient">Game Management</h1>
                <GameListSkeleton total={2} />
            </>
        ); // isLoading is true when api in queryFn was calling and data doesn't exist in cache
    return (
        <>
            <h1 className="text-2xl md:text-4xl font-bold text-gradient">Game Management</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 py-5 dark:text-white">
                {gameList.map((game, index) => (
                    <Card
                        className="w-full max-w-md border shadow-sm hover:shadow-md transition-all shadow-slate-50 dark:hover:shadow-slate-50 rounded-lg"
                        key={index}
                    >
                        <CardHeader className="relative !p-0">
                            <img src={game.image} alt="Game" className="h-48 w-full object-cover rounded-t" />
                            <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white p-2 text-lg font-bold w-full">
                                <span className="line-clamp-1 text-center">{game.name}</span>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-1 p-4">
                            <div className="text-sm flex items-center gap-3">
                                <span className="font-semibold">Game type:</span>
                                <span className={`${getBadge()} capitalize`}>{game.type}</span>
                            </div>
                            <div className="text-sm flex items-center gap-3">
                                <span className="font-semibold">Allow trading: </span>
                                {game.allowTrading ? (
                                    <Badge className="bg-green-500 text-white">Allow</Badge>
                                ) : (
                                    <Badge className="bg-red-500 text-white">Not allow</Badge>
                                )}
                            </div>
                            <div className="text-sm h-12">
                                <span className="font-semibold">Guide:</span>{" "}
                                <span className=" line-clamp-2">{game.guide}</span>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-center !p-3">
                            <Link href={`/admin/games/${game.id}`}>
                                <AnimationColorfulButton className="px-3 py-1">View details</AnimationColorfulButton>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>{" "}
        </>
    );
}
