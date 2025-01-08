export const getCounterpartStatistics = async (): Promise<any> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return null;
        // const [totalUser, totalOrder, totalProduct] = await Promise.all([
        //     axios.get(`${BASE_API}/admin/get-total-user`, {
        //         headers: { Authorization: `Bearer ${accessToken}` },
        //     }),
        //     axios.get(`${BASE_API}/admin/get-total-order`, {
        //         headers: { Authorization: `Bearer ${accessToken}` },
        //     }),
        //     axios.get(`${BASE_API}/admin/get-total-product`, {
        //         headers: { Authorization: `Bearer ${accessToken}` },
        //     }),
        // ]);
        // const successResponse = result.data as SuccessResponse<any>[];
        return {
            data: [
                {
                    data: "12100",
                    trending: "1230",
                },
                {
                    data: "12100",
                    trending: "1230",
                },
                {
                    data: "12100",
                    trending: "1230",
                },
            ],
        };
    } catch (error: any) {
        // throw error;
        return null;
    }
};
