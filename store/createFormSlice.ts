import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppState } from "./index";
import { HYDRATE } from "next-redux-wrapper";

export interface CreateFormState {
    title: string
    tabName: string
}

const initialState: CreateFormState = {
    title: 'Untitled',
    tabName: 'create'
}

export const createFormSlice = createSlice({
    name: 'createForm',
    initialState,
    reducers: {
        reset(state, action){
            state = initialState;
        },
        setTitle(state, action: PayloadAction<string>) {
            state.title = action.payload;
        },
        setTabIndex(state, action: PayloadAction<string>) {
            state.tabName = action.payload;
        }
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.createForm
            }
        }
    }
});


export const createFormActions = createFormSlice.actions;

export default createFormSlice.reducer;