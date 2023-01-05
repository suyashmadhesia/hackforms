import { useEffect, useState } from "react";
import { loginUser } from "./api";
import { setAuthCode, storeEOA } from "./storage";
import { storePrivateKey, storePublicKeyData } from "./security";


export function useGetLoginStatus() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    // const handleUserData = (res: ResponseData<LoginResponse>) => {
    //     if (res.err === undefined ){
    //         storeEOA(res.data?.user.eoa as string);
    //         setAuthCode(res.data?.token as string);
    //     }
    // }

    useEffect(() => {
        loginUser({}).then((res) => {
            if (res.data !== undefined) {
                storeEOA(res.data.user.eoa)
                storePublicKeyData(res.data.user.pubKey);
                storePrivateKey(res.data.user.secretKey);
                setAuthCode(res.data.token)
                setUserLoggedIn(true)
            }else{
                setUserLoggedIn(false)
            }
            
        })
    },[]);

    return userLoggedIn;
}