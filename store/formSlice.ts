import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import {  FormIntro, FormOutro, FormParams, FormTheme, Page, Question } from "../common/types";
import { QuestionTypesData, QuestionTypesEnum } from "../common/question";



export interface FormState {
    tabName: string
    access: string
    openQuestionSelectionDialog: boolean;
    pages: Page[]
    currentPageIndex: number;
    formTheme?: FormTheme;
    formIntro: FormIntro;
    formOutro: FormOutro;
    formParams: FormParams;
}

const initialState: FormState = {
    tabName: 'create',
    access: 'private',
    openQuestionSelectionDialog: false,
    pages: [],
    currentPageIndex: 1,
    formIntro : {
        title: 'Untitled',
    },
    formOutro: {
        title: 'Thanks You!'
    },
    formParams: {
        startDate: Date.now(),
        isClosed: false
    }
}


function parseQuestionIndex(index: string): number[] {
    return index.split('.').map(parseInt);
}


function _removePageAtIndex(pages: Page[], index: number) {
    return pages.filter((page) => page.pageId !== index).map((_page) => {
        if(_page.pageId > index) {
            _page.pageId -= 1;
        }
        return _page
    });
}

export const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        setTitle(state, action: PayloadAction<string>) {
            state.formIntro.title = action.payload;
        },
        setTabIndex(state, action: PayloadAction<string>) {
            state.tabName = action.payload;
        },
        setAccess(state, action: PayloadAction<string>) {
            state.access = action.payload;
        },
        setOpenQuestionSelectDialogState(state, action: PayloadAction<boolean>) {
            state.openQuestionSelectionDialog = action.payload;
        },
        addQuestion(state, action: PayloadAction<{question: Question, index?: string}>) {
            let page: Page = {
                pageId: state.pages.length + 1,
                questions: [],
                params: {}
            }
            if (action.payload.index !== undefined) {
                page = formGetters(state).getPage(action.payload.index);
            }
            const ques = action.payload.question;
            ques.qid = page.pageId.toString();
            ques.index = page.questions.length;
            if (page.questions.length == 1) {
                page.questions[0].qid = `${page.pageId}.1`
            }
            if (page.questions.length > 0) {
                ques.qid = `${page.pageId}.${page.questions.length + 1}`;
            }
            page.questions.push(ques);
            state.pages[page.pageId - 1] = page;
            state.currentPageIndex = page.pageId;

        },
        removeQuestionAtIndex(state, action: PayloadAction<string>) {
            // The method to be overlooked
            // This method is created to accompany future implementation
            // Which can support multiple question in single page
            const getter = formGetters(state);
            const page = getter.getPage(action.payload);
            const quesIndex = getter.getQuestionIndex(action.payload);
            page.questions = page.questions.filter((ques, index) => index !== quesIndex);
            state.pages[page.pageId - 1] = page;

            // Filter out the page and update the pageId of pages below
            if (page.questions.length == 0) {
                state.pages = _removePageAtIndex(state.pages, page.pageId);
            }
        },
        removePageAtIndex(state, action: PayloadAction<number>){
            state.pages = _removePageAtIndex(state.pages, action.payload);
        },
        updateQuestionAtIndex(state, action: PayloadAction<{question: Question, index: string}>) {
            const getter = formGetters(state);
            const page = getter.getPage(action.payload.index);

            page.questions[action.payload.question.index as number] = action.payload.question;
            state.pages[page.pageId - 1] = page;
        },
        swapPages(state, action: PayloadAction<[number, number]>) {
            const getter = formGetters(state);
            const p1 = getter.getPage(action.payload[0].toString());
            const p2 = getter.getPage(action.payload[1].toString());
            p2.pageId = action.payload[0];
            p1.pageId = action.payload[1];   
            state.pages[action.payload[0] - 1] = p2;
            state.pages[action.payload[1] - 1] = p1;
        },
        setCurrentPageIndex(state, action: PayloadAction<number>){
            state.currentPageIndex = action.payload;
        }

    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.form
            }
        }
    }
});


export const formActions = formSlice.actions;


export const formGetters = (state: FormState) => ({
    getQuestionIndex(index: string) {
        const indexes = parseQuestionIndex(index);
        if (indexes.length === 2) return indexes[1] - 1;
        return 0;
    },
    getPage(index: string) {
        const numberIndexes = parseQuestionIndex(index);
        return state.pages[numberIndexes[0] - 1];
    },
    getQuestionAtIndex(index: string) {
        const numberIndexes = parseQuestionIndex(index);
        const page = this.getPage(index);
        return page.questions[this.getQuestionIndex(index)];
    },
    getPageBarTitle(index: string) {
        const question = this.getQuestionAtIndex(index);
        return question.title;
    },
    getPageCount() {
        return state.pages.length;
    },
    getPageQuestionTypeData(index: number) {
        const page = this.getPage(index.toString())
        const question = page.questions[0];
        return QuestionTypesData[question.type as QuestionTypesEnum];
    },
    getCurrentPageIndex() {
        return state.currentPageIndex;
    }
    
});

export default formSlice.reducer;