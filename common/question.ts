import { QuestionType } from "./types"

export enum QuestionTypesEnum {
    MCQ = 'mcq',
    Text = 'text',
    Boolean = 'boolean',
    Rating = 'rating',
    File = 'file',
    Date = 'date',
}


export const QuestionTypesData: Record<QuestionTypesEnum, QuestionType> = {
    [QuestionTypesEnum.MCQ]: {
        type: QuestionTypesEnum.MCQ,
        name: 'Multiple Choice',
        color: '#FDE69A',
        properties: []
    },
    [QuestionTypesEnum.Text]: {
        type: QuestionTypesEnum.Text,
        name: 'Text',
        color: '#369CFA',
        properties: []
    },
    [QuestionTypesEnum.Boolean]: {
        type: QuestionTypesEnum.Boolean,
        name: 'Boolean',
        color: '#EBACCD',
        properties: []
    },
    [QuestionTypesEnum.Rating]: {
        type: QuestionTypesEnum.Rating,
        name: 'Rating',
        color: '#FACE36',
        properties: []
    },
    [QuestionTypesEnum.File]: {
        type: QuestionTypesEnum.File,
        name: 'File',
        color: '#FDD09B',
        properties: []
    },
    [QuestionTypesEnum.Date]: {
        type: QuestionTypesEnum.Date,
        name: 'Date',
        color: '#85E0D6',
        properties: []
    }
}