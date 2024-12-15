import { commonOptions } from "@/lib/react-query/options";
import { GameType } from "@/schema/game.schema";
import { useQuery } from "@tanstack/react-query";

export function useCachedGameQuery(id: string) {
    return useQuery({
        queryKey: ["game", id],
        queryFn: () => {
            return getGameById(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

async function getGameById(id: string): Promise<GameType> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
        id: "UUDI-123D",
        name: "John Doe dsfsd",
        type: "Quiz",
        image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQHTS5qluf5pGj6LUlIkPUXGK0ez0V0p67SCr-sZOnWVsLF4LwiqPbz4-qqVrMQygAuJWFE_Ima1aIE1Xn3MRHAihHqAIBx1JkZusra7dFGig",
        allowTrading: true,
        guide: "User will have to answer the questions and win the game if they get it right.",
    };
}
