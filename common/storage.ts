const AUTH_CODE = 'cgh_id'

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