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
    properties: QuestionControlType[]
}

export interface QuestionParams {
    isRequired?: boolean;
    requiredErrorText?: string;
    defaultValue?: string;
    placeholder?: string;

}

export interface Question {
    qid: number;
    type: string;
    title: string;
    params: Record<string, any>;
    choices: string[];
}