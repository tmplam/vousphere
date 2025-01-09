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
import { GameType, QuizType } from "@/schema/game.schema";
import AnimationColorfulButton, { AnimationButton } from "@/components/shared/custom-button";
import { useState } from "react";
import { SelectGameSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import { useCachedGameAndQuizListQuery } from "@/lib/react-query/eventCache";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { set } from "date-fns";
import { GameQuizType } from "@/app/(subsystem)/counterpart/event/new-event/page";
import { defaultGameImage } from "@/lib/utils";

const QUIZ_TYPE = "Quiz";

export default function SelectGameModal({
    children,
    gamesAndQuizzes,
    onAddingGamesAndQuizzes,
}: {
    children: React.ReactNode;
    gamesAndQuizzes: GameQuizType[];
    onAddingGamesAndQuizzes: (game: GameQuizType[]) => void;
}) {
    const [selectedGames, setSelectedGames] = useState<GameQuizType[]>(gamesAndQuizzes);
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const { data: gameQuizList, isLoading, isError, isFetched, isPaused } = useCachedGameAndQuizListQuery();
    if (isError) return <p>Something went wrong</p>;
    if (isLoading || isPaused) return <SelectGameSkeleton />; // Isloading is true when api in queryFn was calling and data doesn't exist in cache
    if (isFetched) {
        if (!gameQuizList) return <div>Error to display gmaeList</div>;
    }
    if (!gameQuizList) return <div>There is an error to display movie</div>;
    const handleAddingGames = (e: any) => {
        onAddingGamesAndQuizzes(selectedGames);
        toast({
            title: "Success",
            className: "bg-lime-500 text-white",
            description: "Game added successfully",
        });
        setOpen(false);
    };

    const handleSelectedGames = (gameItem: GameType) => {
        const existGameIndex = selectedGames.findIndex((game) => game.game.id === gameItem.id);
        if (existGameIndex !== -1) {
            const newGameList = [...selectedGames];
            newGameList.splice(existGameIndex, 1);
            setSelectedGames(newGameList);
        } else {
            let defaultQuiz: QuizType | null = null;
            if (gameItem.type === QUIZ_TYPE) {
                if (gameQuizList.quizzes?.length != 0) {
                    defaultQuiz = gameQuizList.quizzes![0];
                }
            }
            const selectedGame: GameQuizType = { game: { ...gameItem }, quiz: defaultQuiz, popUpItemsEnabled: false };
            setSelectedGames([...selectedGames, selectedGame]);
        }
    };

    const setAllowTrading = (value: boolean, item: GameType) => {
        const newGameList = [...selectedGames];
        const index = newGameList.findIndex((game) => game.game.id === item.id);
        newGameList[index].popUpItemsEnabled = value;
        setSelectedGames(newGameList);
    };

    const setQuizCollection = (quizId: string, item: GameType) => {
        const newGameList = [...selectedGames];
        const index = newGameList.findIndex((game) => game.game.id === item.id);
        const quizEntity = gameQuizList.quizzes?.find((quiz) => quiz.name === quizId || quiz.id === quizId);
        newGameList[index].quiz = quizEntity!;
        setSelectedGames(newGameList);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-85 md:max-w-[75vw] lg:max-w-[70vw] xl:max-w-[65vw] max-h-[88vh] border border-gray-300 overflow-y-auto py-4 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl">SELECT GAME</DialogTitle>
                </DialogHeader>
                <div className="w-full overflow-y-auto py-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 h-[30vh] p-3">
                        <RenderGameQuizList
                            gameQuizList={gameQuizList}
                            selectedGames={selectedGames}
                            handleSelectedGames={handleSelectedGames}
                            setAllowTrading={setAllowTrading}
                            setQuizCollection={setQuizCollection}
                        />
                    </div>
                    <div className="flex justify-center items-center mt-20">
                        <AnimationColorfulButton className="py-[.37rem] px-3" type="submit" onClick={handleAddingGames}>
                            Add games
                        </AnimationColorfulButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function RenderGameQuizList({
    gameQuizList,
    selectedGames,
    handleSelectedGames,
    setAllowTrading,
    setQuizCollection,
}: {
    gameQuizList: {
        games: GameType[] | null;
        quizzes: QuizType[] | null;
    };
    selectedGames: GameQuizType[];
    handleSelectedGames: (gameItem: GameType) => void;
    setAllowTrading: (value: boolean, gameItem: GameType) => void;
    setQuizCollection: (quizId: string, gameItem: GameType) => void;
}) {
    const [isSelected, setIsSelected] = useState(false);
    const isSelectedGameQuiz = (item: GameType) => {
        return selectedGames.some((game) => game.game.id === item.id);
    };

    const getDefaultQuizValue = (gameItemClone: GameType) => {
        if (gameQuizList.quizzes?.length == 0) return undefined;
        if (selectedGames.length == 0) return gameQuizList.quizzes![0].name;
        const idx = selectedGames.findIndex((item) => item.game.id === gameItemClone.id);
        if (idx === -1) return gameQuizList.quizzes![0].name;
        if (!selectedGames[idx].quiz) return gameQuizList.quizzes![0].name;
        return selectedGames[idx].quiz!.name;
    };

    return (
        <>
            {gameQuizList.games!.map((gameItem, index) => (
                <div key={index} className="min-h-14">
                    <input
                        className="image-checkbox"
                        type="checkbox"
                        id={`image-checkbox-${gameItem.id}`}
                        checked={selectedGames.some((game) => game.game.id === gameItem.id)}
                        onChange={() => {
                            setIsSelected(!isSelected);
                            handleSelectedGames(gameItem);
                        }}
                    />
                    <label
                        className="image-checkbox-label w-full h-full shadow-sm shadow-gray-50 rounded-lg "
                        htmlFor={`image-checkbox-${gameItem.id}`}
                    >
                        <div className="bg-slate-100 dark:bg-slate-800 h-full rounded-lg overflow-hidden">
                            <img src={gameItem.image || defaultGameImage} className="w-full h-40" />
                            <p className="text-center dynamic-text-2 text-xl font-semibold">{gameItem.name}</p>
                        </div>
                    </label>
                    <>
                        {isSelectedGameQuiz(gameItem) && (
                            <>
                                <div className="quiz-section border border-gray-100 rounded-sm p-1">
                                    <div className="flex justify-between">
                                        {gameItem.type === QUIZ_TYPE && (
                                            <label htmlFor="add-quiz-selection">Select Quiz: </label>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="add-allow-trading">Allow trading: </label>
                                            <input
                                                type="checkbox"
                                                id="add-allow-trading"
                                                onChange={(e) => {
                                                    setAllowTrading(e.target.checked, gameItem);
                                                }}
                                                checked={
                                                    selectedGames.find((game) => game.game.id === gameItem.id)!
                                                        .popUpItemsEnabled
                                                }
                                            />
                                        </div>
                                    </div>
                                    {gameItem.type === QUIZ_TYPE && (
                                        <select
                                            id="quizList"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-[.3rem] dark:bg-black dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            onChange={(e) => {
                                                setQuizCollection(e.target.value, gameItem);
                                            }}
                                            defaultValue={getDefaultQuizValue(gameItem)}
                                        >
                                            {gameQuizList.quizzes!.map((quiz, idx) => (
                                                <option key={idx} value={quiz.id}>
                                                    {quiz.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                </div>
            ))}
        </>
    );
}
