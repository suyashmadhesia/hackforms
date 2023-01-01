

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
