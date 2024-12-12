// todoSlice.js
import { UserType } from "@/schema/user.schema";
import { createSlice, Slice } from "@reduxjs/toolkit";
export type UserState = {
    id: string | null;
    user: UserType | null;
};
const initialState: UserState = {
    id: null,
    user: null,
};
const userSlice: Slice<any> = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser(state, action) {
            console.log(action.payload);
            state.id = action.payload.id;
            state.user = { ...state.user, ...action.payload.user };
        },
        updateUserId(state, action) {
            console.log(action.payload);
            state.id = action.payload.id;
        },
    },
});
export const { updateUser, updateUserId } = userSlice.actions;
export default userSlice.reducer;
