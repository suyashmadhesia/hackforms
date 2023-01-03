import axios from "axios";
import { FormState } from "../store/formSlice";
import { apiServer, openServer } from "./axios";
import { decryptData, digestSHA256, loadPublicKeyData, retrieveFile } from "./security";
import { EncryptedData, EncryptedForm, EncryptedFormResponse, FormParams, GetFormResponse, ResponseData } from "./types";

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


interface DecryptedData<T= any, D = any> {
    encData: EncryptedData<T>;
    decryptedValue: D
}

export async function readEncryptedFile<T = any, D=any>(cid: string, secret?: string): Promise<DecryptedData<T,D>> {
    const file = await retrieveFile<T>(cid);
    if (file.header.access === 'public') {
        return {
            encData: file,
            decryptedValue: JSON.parse(file.payload.data) as D
        }
    }
    const keyChain = loadPublicKeyData();
    if (file.payload.subRecord[keyChain.pubKey] === undefined) {
        throw new Error('Decryption of data failed, no decryption key provided for you');
    }
    if (secret === undefined) throw new Error('Password authentication failed');
    const decryptedValue = JSON.parse(await decryptData(file.payload.data, secret));
    return {
        encData: file,
        decryptedValue
    }
}


export function getFormattedDateString(date: Date) {
    let day = (date.getDate() + 1 < 10) ? `0${date.getDate() + 1}` : (date.getDate() + 1).toString();
    let month = (date.getMonth() + 1  < 10) ? `0${date.getMonth() + 1}` : (date.getMonth() + 1).toString();
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
}


export async function fetchFormUsingId(formId: string) {
    const res = await apiServer.get(`/form/${formId}`);
    if (res.data.err) {
        throw new Error(res.data.err);
    }
    return res.data.data;
}

export function getUrlFromCid(cid: string) {
    return `https://${cid}.ipfs.w3s.link/`
}

export async function fetchFormContentUsingId(formId:string) {
    const res = await fetchFormUsingId(formId);
    const cid = res.form.cid; 
    const cidUrl = getUrlFromCid(cid)
    const formRes = await axios.get<EncryptedForm>(cidUrl)
    const form = formRes.data  
    return form;
}

export async function fetchFormResponseUsingFormId(formId: string) {
    const res = await apiServer.get<ResponseData<GetFormResponse>>(`/response/formId/${formId}`);
    if (res.data.err) {
        throw new Error(res.data.err);
    }
    return res.data;
}

export async function fetchResponseContentUsingFormId(formId: string) {
    const res = await fetchFormResponseUsingFormId(formId); 
    const cid = res.data?.formResponse.cid as string;
    const cidUrl = getUrlFromCid(cid);
    const formRes = await axios.get<EncryptedFormResponse>(cidUrl);
    return formRes.data;
}