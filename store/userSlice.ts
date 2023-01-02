import { createSlice } from "@reduxjs/toolkit";


export interface UserSliceState {

}

const initialState: UserSliceState = {};


export const userSlice = createSlice({
    name: 'user',
    initialState, 
    reducers: {}
});


export const userActions = userSlice.actions;

export const userGetters = (state: UserSliceState) => ({});

export default userSlice.reducer;