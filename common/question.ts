import { QuestionType } from "./types"

export enum QuestionTypesEnum {
    MCQ = 'mcq',
    Text = 'text'
}


export const QuestionTypesData: Record<QuestionTypesEnum, QuestionType> = {
    [QuestionTypesEnum.MCQ]: {
        type: QuestionTypesEnum.MCQ,
        name: 'Multiple Choice',
        properties: []
    },
    [QuestionTypesEnum.Text]: {
        type: QuestionTypesEnum.Text,
        name: 'Text',
        properties: []
    }
}