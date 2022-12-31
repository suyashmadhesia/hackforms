export const QuestionControlInputType = {
    Toggle: 'toggle',
    Input: 'input'
}


export interface QuestionControlType {
    [propsName: string]: {
        inputType: string;
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
    startDate: number;
    endDate?: number;
    isClosed: boolean;
}