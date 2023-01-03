import axios from 'axios'
import { getAuthCode, isAuthCodeExists } from './storage';

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
console.log(BASE_URL);


export const openServer = axios.create({
    baseURL: BASE_URL
})

export const apiServer = axios.create({
    baseURL: BASE_URL + '/api'
});

if (typeof window !== 'undefined') {
    
    if (isAuthCodeExists()) {
        apiServer.defaults.headers.common['Authorization'] = `Bearer ` + getAuthCode();
    }
}
