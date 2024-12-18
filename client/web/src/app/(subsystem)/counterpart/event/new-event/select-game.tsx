"use client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import { GameType } from "@/schema/game.schema";
import Loading from "@/app/loading";
import { useCachedGameListQuery } from "@/lib/react-query/gameCache";
import AnimationColorfulButton, { AnimationButton } from "@/components/shared/custom-button";
import { useState } from "react";
import { SelectGameSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
export default function SelectGameModal({
    children,
    onAddingGames,
}: {
    children: React.ReactNode;
    onAddingGames: (game: GameType[]) => void;
}) {
    const [selectedGames, setSelectedGames] = useState<GameType[]>([]);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const { data: gameList, isLoading, isError, isFetched, isPaused } = useCachedGameListQuery();
    if (isError) return <p>Something went wrong</p>;
    if (isLoading || isPaused) return <SelectGameSkeleton />; // Isloading is true when api in queryFn was calling and data doesn't exist in cache
    if (isFetched) {
        if (!gameList) return <div>Error to display gmaeList</div>;
    }
    if (!gameList) return <div>There is an error to display movie</div>;

    const handleAddingGames = (e: any) => {
        onAddingGames(selectedGames);
        toast({
            title: "Success",
            className: "bg-lime-500",
            description: "Game added successfully",
        });
        setOpen(false);
    };
    const handleSelectedGames = (gameItem: GameType) => {
        const existGameIndex = selectedGames.findIndex((game) => game.id === gameItem.id);
        if (existGameIndex !== -1) {
            const newGameList = [...selectedGames];
            newGameList.splice(existGameIndex, 1);
            setSelectedGames(newGameList);
        } else {
            const selectedGame = { ...gameItem };
            setSelectedGames([...selectedGames, selectedGame]);
        }
    };
    console.log(selectedGames);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-85 md:max-w-[75vw] lg:max-w-[70vw] xl:max-w-[65vw] max-h-[88vh] border border-gray-300 overflow-y-auto py-4 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">SELECT GAME</DialogTitle>
                </DialogHeader>
                <div className="h-full w-full">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gameList.map((gameItem, index) => (
                            <div key={index} className="h-56">
                                <input
                                    className="image-checkbox"
                                    type="checkbox"
                                    id={`image-checkbox-${gameItem.id}`}
                                    checked={selectedGames.some((game) => game.id === gameItem.id)}
                                    onChange={() => handleSelectedGames(gameItem)}
                                />
                                <label
                                    className="image-checkbox-label w-full h-full shadow-sm shadow-gray-50 rounded-lg "
                                    htmlFor={`image-checkbox-${gameItem.id}`}
                                >
                                    <div className="bg-slate-100 dark:bg-slate-800 h-full rounded-lg overflow-hidden">
                                        <img src={gameItem.image} className="w-full h-40" />
                                        <p className="text-center dynamic-text-2 text-xl font-semibold">
                                            {gameItem.name}
                                        </p>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center mt-5">
                        <AnimationColorfulButton className="py-1 px-2" type="submit" onClick={handleAddingGames}>
                            Add games
                        </AnimationColorfulButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
