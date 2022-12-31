import { FormState } from "../store/formSlice";

export const EDITABLE_FORM_STATE = 'state-form';


export function getEditableFormStateFromStorage() {
    const formState =  window.localStorage.getItem(EDITABLE_FORM_STATE)
    if (formState !== null) {
        return JSON.parse(formState) as FormState;
    }
    return null;
}

export function setEditableFormStateFromStorage(formState: FormState) {
    window.localStorage.setItem(EDITABLE_FORM_STATE, JSON.stringify(formState))
}
