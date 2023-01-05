const AUTH_CODE = 'cgh_id'
const CREATE_FORM = 'survey-json'
const FORM_TICKER = 'form-ticker'

export function storeItemInLocalStorage(key: string, value: string ) {
    window.localStorage.setItem(key, value);
}

export function getItemFromLocalStorage(key: string) {
    return window.localStorage.getItem(key);
}

export function removeItemFromLocalStorage(key: string) {
    window.localStorage.removeItem(key);
}

export function clearLocalStorage(){
    window.localStorage.clear();
}

export function isAuthCodeExists(){
    return getItemFromLocalStorage(AUTH_CODE) !== null;
}

export function setAuthCode(code: string) {
    storeItemInLocalStorage(AUTH_CODE, code);
}

export function getAuthCode(): string {
    return getItemFromLocalStorage(AUTH_CODE) as string;
}
export function storeForm(form: string) {
    storeItemInLocalStorage(CREATE_FORM, form);
}

export function removeAuthCode() {
    removeItemFromLocalStorage(AUTH_CODE)
}

export function getStoredForm() {
    return getItemFromLocalStorage(CREATE_FORM);
}

export function removeStoredForm() {
    removeItemFromLocalStorage(CREATE_FORM)
}

export function hasFormStored() {
    const form = getStoredForm();
    return form !== null && form !== 'null' && form.length > 0;
}

export function storeFormTicker(ticker: string) {
    storeItemInLocalStorage(FORM_TICKER, ticker);
}

export function getFormTicker() {
    return getItemFromLocalStorage(FORM_TICKER)
}

export function hasFormTicker(){
    return getFormTicker() !== null;
}
export function removeFormTicker() {
    removeItemFromLocalStorage(FORM_TICKER)
}
export function storeEOA(eoa: string) {
    storeItemInLocalStorage('eoa', eoa)
}
export function getEOA() {
    return getItemFromLocalStorage('eoa')
}