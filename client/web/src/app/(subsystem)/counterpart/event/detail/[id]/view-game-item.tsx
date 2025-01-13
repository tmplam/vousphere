"use client";

import { getAllGamesAndQuizzes } from "@/apis/game-api";
import ViewGameModal from "@/app/(subsystem)/counterpart/event/detail/[id]/view-game-modal";
import { GameItemSkeleton } from "@/app/(subsystem)/counterpart/skeletons";
import { Badge } from "@/components/ui/badge";
import { defaultGameImage, printDateTime } from "@/lib/utils";
import { GameQuizItemType } from "@/schema/event.schema";
import { GameAndQuizListType, GameType, QuizType } from "@/schema/game.schema";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

export function RenderGameItemList({ itemList }: { itemList: GameQuizItemType[] }) {
    const [gameAndQuizList, setGameAndQuizList] = useState<GameAndQuizListType>({
        games: [],
        quizzes: [],
    });
    useEffect(() => {
        const getGamesAndQuizzes = async () => {
            const result = await getAllGamesAndQuizzes();
            if (result) {
                setGameAndQuizList(result);
            }
        };
        getGamesAndQuizzes();
    }, []);
    if (gameAndQuizList.games?.length == 0) {
        return <GameItemSkeleton />;
    }
    return (
        <>
            {itemList!.map((item, index) => {
                const game = gameAndQuizList.games?.find((g) => g.id === item.gameId)!;
                let quiz = null;
                if (item.quizzCollectionId) {
                    quiz = gameAndQuizList.quizzes?.find((q) => q.id === item.quizzCollectionId) || null;
                }
                return (
                    <GameItem
                        key={index}
                        game={game}
                        allowTrading={item.popUpItemsEnabled}
                        startTime={item.startTime}
                        quiz={quiz}
                    />
                );
            })}
        </>
    );
}

export default function GameItem({
    game,
    allowTrading = false,
    startTime,
    quiz,
}: {
    game: GameType;
    allowTrading: boolean;
    startTime?: string;
    quiz?: QuizType | null;
}) {
    return (
        <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200 pb-1">
            <div className="p-2 basis-[5rem] h-[5rem]">
                <img
                    src={game.image || defaultGameImage}
                    alt="Voucher image"
                    className="w-full h-full object-cover border"
                />
            </div>
            <div className="flex flex-[1] flex-col">
                <p className="font-semibold text-md">
                    <span className="dynamic-text text-lg">{game.name}</span>
                </p>
                <span
                    className="text-xs line-clamp-2 min-h-[2.2rem]"
                    dangerouslySetInnerHTML={{ __html: game.description }}
                ></span>
                <div className="flex gap-x-5 flex-wrap">
                    <span className="text-xs">
                        <b className="mr-2">Allow trading:</b>
                        {allowTrading ? (
                            <span className="text-gradient border border-gray-200 px-1 py-[.05rem] rounded-sm text-xs font-semibold">
                                Yes
                            </span>
                        ) : (
                            <span className="bg-red-500 text-white px-1 py-[.05rem] rounded-sm text-xs">No</span>
                        )}
                    </span>
                    {quiz && (
                        <span className="text-xs">
                            <b className="mr-1">Start time:</b> {printDateTime(startTime ? new Date(startTime) : null)}
                        </span>
                    )}
                </div>
                {quiz && (
                    <span className="text-xs font-semibold">
                        Quiz: <span className="text-gradient">{quiz.name}</span>
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4 px-3">
                <ViewGameModal item={game}>
                    <Info color="blue" strokeWidth={3} className="cursor-pointer" />
                </ViewGameModal>
            </div>
        </div>
    );
}
