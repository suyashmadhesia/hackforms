import { FormState } from "../store/formSlice";
import { digestSHA256 } from "./security";
import { FormParams } from "./types";

export const EDITABLE_FORM_STATE = 'state-form';


export function getEditableFormStateFromStorage() {
    const formState =  window.localStorage.getItem(EDITABLE_FORM_STATE)
    if (formState !== null) {
        return JSON.parse(formState) as FormState;
    }
    return null;
}

export function setEditableFormStateFromStorage(formState: FormState) {
    // window.localStorage.setItem(EDITABLE_FORM_STATE, JSON.stringify(formState))
}


export function getContentHash<H,P>(header: H, payload:P) {
    return digestSHA256(JSON.stringify({header, payload}))
}


export function getFormattedSchema<T>(data: string, ops: {
    owner: string;
    iss: string;
    meta: T & {
        access: string
    };
    subRecord: Record<string, string>;
    inviteList: string[];
}) {
    const header =  {
        alg: 'AES-GCM',
        keyEncAlg: 'ECDSA',
        access: ops.meta.access
    };

    const payload = {
        data: data,
        meta: ops.meta,
        iss: ops.iss,
        owner: ops.owner,
        subRecord: ops.subRecord,
        inviteList: ops.inviteList
    };

    const hash = getContentHash(header, payload);
    const proof = {
        hash: hash
    }

    return {header, payload, proof};
}
