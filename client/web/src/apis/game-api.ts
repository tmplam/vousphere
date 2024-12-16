import { GameType } from "@/schema/game.schema";

export async function getAllGames(): Promise<GameType[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
        {
            id: "HDFS-sdfd",
            name: "HQ Trivia Game",
            type: "Quiz",
            image: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQHTS5qluf5pGj6LUlIkPUXGK0ez0V0p67SCr-sZOnWVsLF4LwiqPbz4-qqVrMQygAuJWFE_Ima1aIE1Xn3MRHAihHqAIBx1JkZusra7dFGig",
            allowTrading: true,
            // guide: "User will have to answer the questions and win the game if they get it right.",
            guide: "User will have to ",
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
}

export async function getGameById(id: string): Promise<GameType> {
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
