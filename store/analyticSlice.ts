import {GridColDef } from '@mui/x-data-grid';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { EncryptedForm, EncryptedFormResponse, FormResponseData, ResponseData, SerializedFormAnalytics } from '../common/types';
import { apiServer } from '../common/axios';
import axios from 'axios';
import { decryptAES, decryptWithPrivateKey, generateAESKeyFromSeed, importAESKey, loadPrivateKeys, loadPublicKeyData } from '../common/security';
import { AppState } from '.';

export interface AnalyticSliceState {
    cols: GridColDef[];
    rows: Record<string, string>[];
    numOfRes: number;
    showLoader: boolean;
    errorText?: string;
    showPassDialog: boolean;
}

const initialState: AnalyticSliceState = {
    cols: [],
    rows: [],
    showLoader: false,
    numOfRes: 0,
    showPassDialog: false
}

const getTruncatedString = (str: string) => {
    return (str.length < 10) ? str: str.slice(0, 11) + '...';
}

const getColsDef = (data: FormResponseData) => {
    const _cols: GridColDef[] = [{
        field: 'responseId',
        headerName: 'Response Id',
        width: 120
    },{
        field: 'cid',
        headerName: 'Response Cid',
        width: 120
    }];
    for(const [questionTitle, questionId] of Object.entries(data.dataFrame)) {
        _cols.push({
            field: questionId,
            headerName: getTruncatedString(questionTitle),
            description: questionTitle,
            sortable: false,
            width: 160
        });
    }
    return _cols;
}

const getRow = (responseId: string, cid: string, data: FormResponseData) => {
    return Object.assign({responseId, cid}, data.res);
}


export const fetchFormAnalyticsAndContent = createAsyncThunk(
    'analytics/fetchFormAnalyticsAndContent',
    async ({form, secret}: {form: EncryptedForm, secret?: string}, {getState, dispatch} ) => {
        dispatch(analyticsActions.setShowLoader(true));
        const state = getState() as AppState;
        const res = await apiServer.get<ResponseData<SerializedFormAnalytics>>(`/form/analytics/${form.payload.meta.formId}`);
        if (res.data.err) throw new Error(res.data.err);
        const analytics = res.data.data as SerializedFormAnalytics;
        console.log(analytics);
        dispatch(analyticsActions.setNumOfRows(analytics.numberOfResponse));
        let privateKey = ''
        const pubKey = loadPublicKeyData();
        if (form.header.access !== "public" ) {
            
            const encryptedPrivateKey = loadPrivateKeys();
            const generatedAesKey = await generateAESKeyFromSeed(secret as string);
            privateKey = await decryptAES(encryptedPrivateKey, generatedAesKey);
        }
        
        for (const formResponseData of analytics.responses){
            const encResponseRes = await axios.get<EncryptedFormResponse>(formResponseData.url);
            const encryptedFormResponse = encResponseRes.data;
            let decryptedResponseData = encResponseRes.data.payload.data;
            if (form.header.access !== "public") {
                const decryptedResponseAESKey = await decryptWithPrivateKey(
                    privateKey,
                    form.payload.subRecord[pubKey.pubKey]
                );
                decryptedResponseData = await decryptAES(
                    encryptedFormResponse.payload.data,
                    await importAESKey(decryptedResponseAESKey)
                )
            }
            const responseData = JSON.parse(decryptedResponseData) as FormResponseData;
            if (state.analytics.cols.length === 0){
                dispatch(analyticsActions.setCol(getColsDef(responseData)));
                console.log(getColsDef(responseData));
                
            }
            dispatch(analyticsActions.addRow(
                getRow(formResponseData.id, formResponseData.cid, responseData)
            ));
            console.log(getRow(formResponseData.id, formResponseData.cid, responseData));
        }
        dispatch(analyticsActions.setShowLoader(true));
        return analytics.numberOfResponse;
    }
)

export const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        setCol(state, action: PayloadAction<GridColDef[]>) {
            state.cols = action.payload;
        },
        addRow(state, action: PayloadAction<Record<string, string>>){
            state.rows.push(action.payload);
        },
        setRows(state, action: PayloadAction<Record<string, string>[]>){
            state.rows = action.payload;
        },
        setNumOfRows(state, action: PayloadAction<number>){
            state.numOfRes = action.payload;
        },
        setShowLoader(state, action: PayloadAction<boolean>){
            state.showLoader = action.payload;
        },
        setErrorText(state, action: PayloadAction<string | undefined>) {
            state.errorText = action.payload;
        },
        setOpenPassDialog(state, action: PayloadAction<boolean>) {
            state.showPassDialog = action.payload;
        }
    }
})


export const analyticsActions = analyticsSlice.actions;

export default analyticsSlice.reducer;