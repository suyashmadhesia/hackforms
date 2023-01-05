import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { openServer } from "../common/axios";
import { LoginArgs, ResponseSchema, UserProfile } from "../common/types";
import { setAuthCode } from "../common/storage";

interface LoginResponse {
    user: UserProfile,
    token: string;
    
}

export const fetchUserEOAExistence = createAsyncThunk(
    'user/fetchUserEOAExistence',
    async (eoa: string, thunkAPI) => {
        const res = await openServer.post('/login/eoa', {
            eoa
        });
        return {
            status: res.status,
            data: res.data
        };           
    }
);


export const loginUser = createAsyncThunk(
    'user/login',
    async (args: Partial<LoginArgs>, thunkAPI) => {
        const res = await openServer.post('/login', args);
        return {
            status: res.status,
            data: res.data
        }
    }
);

export interface UserSliceState {
    eoaExists: boolean;
    hasError: boolean;
    error?: string;
    user?: UserProfile;
    args?: LoginArgs

}

const initialState: UserSliceState = {
    eoaExists: false,
    hasError: false
};


export const userSlice = createSlice({
    name: 'user',
    initialState, 
    reducers: {
        setLoginArgs(state, action: PayloadAction<LoginArgs>) {
            state.args = Object.assign({}, action.payload)
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.hasError = true
        },
        closeError(state, action?: PayloadAction<undefined>) {
            state.hasError = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserEOAExistence.fulfilled, 
            (state, action: PayloadAction<ResponseSchema<{exists: boolean}>>) => {
                state.eoaExists = action.payload.data.data?.exists as boolean;
        }) 
       // Case for successful login;
       .addCase(loginUser.fulfilled,
            (state, action: PayloadAction<ResponseSchema<LoginResponse>>) => {
                const respData = action.payload.data.data as LoginResponse;
                state.user = respData.user;
                setAuthCode(respData.token);
            }
        )
        // Case for failure login
        .addCase(loginUser.rejected, 
            (state, action) => {
                state.hasError = true;
                state.error = (action.payload as ResponseSchema<string>).data.err;
            }
        )
    }
});


export const userActions = userSlice.actions;

export const userGetters = (state: UserSliceState) => ({});

export default userSlice.reducer;