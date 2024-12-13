import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";
import userReducer from "@/lib/redux/slices/userSlice";

/**
 * @description Create a Redux store with persisted state using Redux Toolkit and Redux Persist
 * @reference https://redux-toolkit.js.org/usage/nextjs, https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
 * @returns {AppStore, RootState, AppDispatch} - Redux store, RootState and AppDispatch
 *
 */

const localPersistConfig = {
    key: "userState",
    storage,
    // whitelist: ["user", "isLoggedIn"],
};
const sessionPersistConfig = {
    key: "session",
    storageSession,
};

const rootReducer = combineReducers({
    userState: persistReducer(localPersistConfig, userReducer),
});

// const persistedReducer = persistReducer(localPersistConfig, rootReducer);

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const makeStore = () => {
    return configureStore({
        reducer: rootReducer,
        devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production",
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
                },
            }),
    });
};
export const persistor = persistStore(makeStore());

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
