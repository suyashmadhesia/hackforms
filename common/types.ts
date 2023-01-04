export const QuestionControlInputType = {
    Toggle: 'toggle',
    Input: 'input'
}


export interface QuestionControlType {
    [propsName: string]: {
        inputType: string;
        defaultValue: any
    }
}

export interface QuestionType {
    type: string;
    name: string;
    color: string;
    properties: QuestionControlType[]
}

export interface QuestionParams {
    isRequired?: boolean;
    requiredErrorText?: string;
    defaultValue?: string;
    placeholder?: string;
  
}

export interface Question {
    qid?: string;
    index?: number;
    type: string;
    title: string;
    description?: string;
    
    choices: string[];
}

export interface Page {
    pageId: number;
    questions: Question[];
    params: Record<string, any>;
}

export interface FormTheme {
    questionTextColor: string;
    answerTextColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
    backgroundColor: string;
    backgroundImage?: string;
    opacity?:number;
    icon?: string
}

export interface FormIntro {
    banner?: string;
    title: string;
    description?: string;
}

export type FormOutro = FormIntro;

export interface FormParams {
    startDate?: string;
    endDate?: string;
    isClosed: boolean;
    isPayable: boolean;
    rate?: number;
    maxNumberOfResponse?: number;
    formId?: string;
    title: string;
    description?: string;
    access: string;
    banner?: string;
}


export interface FormResponseParams {
    formId: string;
    responseId?: string;
    creationDate?: string;
    access: string;
}

export interface EncryptedData<T> {
    header: {
        alg: string;
        keyEncAlg: string;
        access: "public" | "private" | "protected"
    },
    payload: {
        data: string;
        meta: T,
        iss: string;
        owner: string;
        subRecord: Record<string, string>;
        inviteList: string[]
    },
    proof: {
        hash: string;
        signature?: string;
        keyHash?: string;
    }
}

export type EncryptedForm = EncryptedData<FormParams>;
export type EncryptedFormResponse = EncryptedData<FormResponseParams>;

export interface ResponseData<T> {
    data?: T;
    err?: string
}

export interface ResponseSchema<T> {
    status: number;
    data: ResponseData<T>
}



export interface LoginArgs {
    route: "ud" | "wa",
    eoa: string;
    ud?: {
        message: string;
        signature: string;
    },
    wa?: {
        appPubKey: string;
        idToken: string;
        isEOAWeb2: boolean;
    },
    pubKey?: string;
    secretKey?: string;
}


export interface UserProfile {
    id: number;
    createdOn: string;
    eoa: string;
    pubKey: string;
    secretKey:string;
    isEOAWeb2: boolean;
}

export interface LoginResponse {
    user: UserProfile,
    token: string;
}


export interface GetFormResponse {
    formResponse: {
        title: string,
        formCid: string;
        cid: string;
        formId: string;
        responseId: string;
    },
    formContentUrl: string;
    responseContentUrl: string
}



export type FormResponse = {
    id: string
    createdOn: Date
    updatedOn: Date
    formId: string
    ownerEOA: string
    ownerpubKey: string
    cid: string
    userId: number
    access: string
  }

  
export interface SerializedFormResponse {
    formResponse: Partial<FormResponse>;
    rawContentUrl: string;
}

export interface CompactResponseData {
    id: string,
    cid: string,
    url: string
}
export interface SerializedFormAnalytics {
    numberOfResponse: number;
    responses: Array<CompactResponseData>
}

export interface FormResponseData {
    res: Record<string, string>;
    dataFrame: Record<string, string>;
}