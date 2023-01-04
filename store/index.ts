import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import {formSlice} from "./formSlice";
import {userSlice} from "./userSlice";
import {analyticsSlice} from "./analyticSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      [formSlice.name]: formSlice.reducer,
      [userSlice.name]: userSlice.reducer,
      [analyticsSlice.name]: analyticsSlice.reducer
    },
    devTools: true,
  });


export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);