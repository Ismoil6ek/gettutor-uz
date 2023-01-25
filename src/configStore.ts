import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { stringMiddleWare } from "./middleware/stringMiddleware";
import { reducer } from "./redux/rootReducer";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stringMiddleWare),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => AppDispatch = useDispatch;
