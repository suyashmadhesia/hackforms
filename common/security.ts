import * as cryptojs from 'crypto-js';
import EthCrypto from 'eth-crypto';


export function getStringFromArrayBuffer(buffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, (new Uint8Array(buffer) as any));
}

export function getArrayBufferFromString(str: string) {
    const buffer = new ArrayBuffer(str.length);
    const bufferView = new Uint8Array(buffer);
    for (let index = 0, strLen = str.length; index < strLen; index++){
        bufferView[index] = str.charCodeAt(index);
    }
    return buffer;
}

export function getBase64FromArrayBuffer(buffer: ArrayBuffer): string {
    return globalThis.btoa(getStringFromArrayBuffer(buffer));
}


export function getArrayBufferFromBase64(str: string) {
    const decoded = atob(str);
    return getArrayBufferFromString(decoded);
}

export async function generateAESKey() {
    return await crypto.subtle.generateKey({
        name: 'AES-GCM',
        length: 256
    }, true, ['encrypt', 'decrypt']);
}

export async function exportAESKey(key: CryptoKey) {
    const keyExport = await crypto.subtle.exportKey('raw', key);
    return getBase64FromArrayBuffer(keyExport);
}

export async function importAESKey(key: string) {
    const buffer = getArrayBufferFromBase64(key);
    return await crypto.subtle.importKey('raw', buffer, {
        name: 'AES-GCM'
    }, true, ['encrypt', 'decrypt']);
}

interface EncryptedAESData {
    ct: string;
    iv: string;
}

export async function encryptAES(data: string, key: CryptoKey) {
    const dataBuffer = getArrayBufferFromString(data);
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encrypted = await crypto.subtle.encrypt({
        name: 'AES-GCM',
        iv: iv
    }, key, dataBuffer);
    const encryptedSchema = {
        ct: getBase64FromArrayBuffer(encrypted),
        iv: getBase64FromArrayBuffer(iv)
    } as EncryptedAESData;
    return btoa(JSON.stringify(encryptedSchema));
}

export async function decryptAES(data: string, key: CryptoKey) {
    const decoded = JSON.parse(atob(data)) as EncryptedAESData;
    const decrypted = await crypto.subtle.decrypt({
        name: 'AES-GCM',
        iv: getArrayBufferFromBase64(decoded.iv)
    },
    key,
    getArrayBufferFromBase64(decoded.ct)
    );
    return getStringFromArrayBuffer(decrypted);

}

export function digestSHA25(data: string) {
    return cryptojs.SHA256(data).toString(cryptojs.enc.Base64);
}

export function digestMD5(data: string) {
    return cryptojs.MD5(data).toString(cryptojs.enc.Base64);
}

export function generateAESKeyFromSeed(seed: string) {
    const shaHash = digestSHA25(seed);
    return digestMD5(shaHash);
}


export function createKeyPair(){
    return EthCrypto.createIdentity();
}


export function signData(privateKey: string, msg: string) {
    const messageHash = EthCrypto.hash.keccak256(msg);
    return EthCrypto.sign(
        privateKey, messageHash
    );
}

export function recoverPublicKey(signature: string, message: string) {
    return EthCrypto.recoverPublicKey(
        signature,
        EthCrypto.hash.keccak256(message)
    )
}

export function publicKeyToAddress(pubKey: string) {
    return EthCrypto.publicKey.toAddress(pubKey);
}

export function verifySignature(pubKey: string, signature: string, message: string) {
    return pubKey === recoverPublicKey(signature, message);
}


export async function encryptWithPublicKey(pubKey: string, message: string) {
    const cipher =  await EthCrypto.encryptWithPublicKey(
        pubKey, message
    );

    return EthCrypto.cipher.stringify(cipher);
}

export async function decryptWithPrivateKey(privateKey: string,  cipherText: string) {
    const cipher = EthCrypto.cipher.parse(cipherText);
    return await EthCrypto.decryptWithPrivateKey(privateKey, cipher);
}