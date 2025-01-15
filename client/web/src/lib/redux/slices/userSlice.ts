// todoSlice.js
import { isClient } from "@/lib/utils";
import { UserType } from "@/schema/user.schema";
import { createSlice, Slice } from "@reduxjs/toolkit";

const persistedStateName = "persist:root";

export const initialState = (): { user: UserState } => {
    try {
        if (isClient()) {
            const persistedData = localStorage.getItem(persistedStateName);
            if (persistedData) {
                const parsedData = JSON.parse(persistedData); // Parse chuỗi JSON
                return parsedData; // Tách dữ liệu state (nested JSON)
            }
        }
    } catch (error) {
        console.error("Error parsing persisted state:", error);
    }
    return {
        user: null,
    };
};

export type UserState = UserType | null;

const userSlice: Slice<any> = createSlice({
    name: "user",
    initialState: initialState(),
    reducers: {
        updateUser(state, action) {
            localStorage.removeItem(persistedStateName);
            state.user = state.user ? { ...state.user, ...action.payload } : { ...action.payload };
            // localStorage.setItem(persistedStateName, JSON.stringify(state));
        },
        updateUserId(state, action) {
            // console.log(action.payload);
            state.id = action.payload.id;
        },
    },
});
export const { updateUser, updateUserId } = userSlice.actions;
export default userSlice.reducer;
