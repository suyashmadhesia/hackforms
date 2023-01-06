import * as cryptojs from 'crypto-js';
import EthCrypto from 'eth-crypto';
import { getItemFromLocalStorage, removeAuthCode, removeItemFromLocalStorage, storeItemInLocalStorage } from './storage';


import { Web3Storage } from 'web3.storage'
import { EncryptedData } from './types';

function getAccessToken () {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() as string });
}


const KEYSTORE_NAME = 'portal_origin_address_hash'
const VERIFIER = 'cql_origin'
const PUBLIC_DETAILS = 'public_key_chain'


interface PublicKeyChain {
    pubKey: string;
    address: string
}

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

export function digestSHA256(data: string) {
    return cryptojs.SHA256(data).toString(cryptojs.enc.Base64);
}

export function digestMD5(data: string) {
    return cryptojs.MD5(data).toString(cryptojs.enc.Base64);
}

export function digestSeed(seed: string) {
    const shaHash = digestSHA256(seed);
    return digestMD5(shaHash);
}

export async function generateAESKeyFromSeed(seed: string) {
    return await importAESKey(digestSeed(seed));
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

export async function securePrivateKey(privateKey: string, secret: string) {
    const aesKey = await generateAESKeyFromSeed(secret);
    return await encryptAES(privateKey, aesKey);
}


export function storePublicKeyData(pubKey: string, address?: string) {
    if (address === undefined){
        address = EthCrypto.publicKey.toAddress(pubKey)
    }
    storeItemInLocalStorage(PUBLIC_DETAILS, JSON.stringify({pubKey, address}))
}

export function loadPublicKeyData() {
    const _tmp = getItemFromLocalStorage(PUBLIC_DETAILS)
    if (_tmp === null) {
        throw new Error('No public key data available')
    }
    return JSON.parse(_tmp) as PublicKeyChain;
}

export function storePrivateKey(privKey: string) {
    // const secretHash = digestSHA256(digestSeed(secret));
    storeItemInLocalStorage(KEYSTORE_NAME, privKey);
    // storeItemInLocalStorage(VERIFIER, secretHash);
}

export function clearKeyStore() {
    removeItemFromLocalStorage(PUBLIC_DETAILS);
    removeItemFromLocalStorage(KEYSTORE_NAME);
    removeItemFromLocalStorage(VERIFIER);
}

export function loadPrivateKeys() {
    // const secretHash = digestSHA256(digestSeed(secret))
    // const verifier = getItemFromLocalStorage(VERIFIER)
    // if (verifier === null) throw new Error('No private key is available to load');
    // if (verifier !== secretHash) {
        // throw new Error('Authentication Failed.')
    // }
    const key = getItemFromLocalStorage(KEYSTORE_NAME);
    if (key === null) throw new Error('No private key is available to load');

    return key;
}


export async function decryptData(data: string, secret: string) {
    const aesKey = digestSeed(secret)
    const encKey = loadPrivateKeys();
    const privateKey = await decryptAES(encKey, await importAESKey(aesKey));
    return await decryptWithPrivateKey(privateKey, data);
}


export async function generateSecureKeyPair(secret: string) {
    const keyPair = createKeyPair();
    storePublicKeyData(keyPair.publicKey, keyPair.address);
    const aesKey = await importAESKey(digestSeed(secret))
    const encKey = await encryptAES(keyPair.privateKey, aesKey)
    storePrivateKey(encKey);
}

export function getAddressFromPubKey(pubKey: string) {
    return EthCrypto.publicKey.toAddress(pubKey);
}

export async function retrieveFile<T=any>(cid: string) {
    const client = makeStorageClient();
    const res = await client.get(cid);
    if (!res?.ok) {
        throw new Error(`failed to get ${cid}`);
    }
    const files = (await res.files())[0];
    const jsonString = getStringFromArrayBuffer(await files.arrayBuffer());
    return JSON.parse(jsonString) as EncryptedData<T>;  
}


export function getPublicKeyFromPrivKey(privKey: string) {
    return EthCrypto.publicKeyByPrivateKey(privKey)
}



export function removeAuthDetails() {
    removeAuthCode();
    removeItemFromLocalStorage('eoa');
    removeItemFromLocalStorage(KEYSTORE_NAME);
    removeItemFromLocalStorage(VERIFIER)
    removeItemFromLocalStorage(PUBLIC_DETAILS)
}