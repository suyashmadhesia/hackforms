import { useEffect, useState } from "react";
import { loginUser } from "./api";
import { setAuthCode, storeEOA } from "./storage";
import { storePrivateKey, storePublicKeyData } from "./security";
import { HackformsEscrowContractHandler } from "./contract";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";


export function useGetLoginStatus() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);


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

export function useEscrowContract() {
    const [escrowContract, setEscrowContract] = useState<HackformsEscrowContractHandler | undefined>();
    // const {data} = useSigner();
    const {isConnected} = useAccount();

    useEffect(() => {
        if (isConnected) {
            let contract = new HackformsEscrowContractHandler();
            setEscrowContract(contract);
        }
    }, [isConnected])

    return escrowContract;
}