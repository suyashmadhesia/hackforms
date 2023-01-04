
import { Snackbar, Alert, Box, Typography, Stack, Card, Button } from "@mui/material";
import Image from 'next/image';
import Web3AuthLogo from '../assets/img/web3Auth.png'
import UDLogo from '../assets/svg/default-large.svg'
import { colors } from "../styles/theme";
import {ethers} from 'ethers';
import {Web3Auth} from '@web3auth/modal';
import { getPublicCompressed } from "@toruslabs/eccrypto";
import Client from '@uauth/js'
import { useEffect, useState } from "react";
import { useGetLoginStatus } from "../common/custom_hooks";
import { useRouter } from 'next/router'
import Loader from "../common/ProgrssBar";
import { LoginArgs, LoginResponse } from "../common/types";
import { fetchUserEOAExistence, loginUser } from "../common/api";
import { getItemFromLocalStorage, removeAuthCode, removeItemFromLocalStorage, setAuthCode, storeItemInLocalStorage } from "../common/storage";
import PasswordInputDialog from "../components/common/PasswordInputDialog";
import { clearKeyStore, createKeyPair, encryptAES, generateAESKeyFromSeed, getAddressFromPubKey, importAESKey, storePrivateKey, storePublicKeyData } from "../common/security";

/**
 * 
 * Login flow
 * 
 * Check JWT existence 
 *  | Yes | -> call "/login", save data and pop the nav stack
 *  | No | -> Goto {Login}
 * 
 * {Login}
 * Perform normal login flow
 * Check eoa existence
 *  |Yes| -> call "/login" with data
 *  |No| -> Ask password and generate key to encrypt data then call "/login"
 * 
 * Pop the stack
 * 
 */

export default function Login() {

    const LOGIN_ARGS = 'login-args'
    const [error, setError] = useState<string|null>(null);
    const [isLoading, showLoading] = useState(false);
    const [openPassDiag, setOpenPassDiag] = useState(false);
    const router = useRouter();

    const loginStatus = useGetLoginStatus();

    useEffect(() => {
        if(!router.isReady) return;
        if (loginStatus) {
            // TODO: add option to go back or go to dashboard
            if (router.query.redirected !== undefined){
                // console.log(loginStatus);
                
                router.back()
            }else{
                router.replace('/dashboard')
            }
        }else {
            removeAuthCode();
        }
    },[loginStatus, router.isReady, router])

    const onSecret = async (aesKeyStr: string) => {
        // Close the dialog box
        setOpenPassDiag(false)
        // Show loading screen again
        showLoading(true)
        let _args = JSON.parse(getItemFromLocalStorage(LOGIN_ARGS) as string) as LoginArgs
        const aesKey = await generateAESKeyFromSeed(aesKeyStr);
        const keyPair = createKeyPair();
        _args.pubKey = keyPair.publicKey;
        _args.secretKey = await encryptAES(keyPair.privateKey, aesKey);
        await loginAndSetCode(_args);
    }

    const loginAndSetCode = async (arg: LoginArgs) => {
        showLoading(true);
        removeItemFromLocalStorage(LOGIN_ARGS)
        const res = await loginUser(arg);
        if (res.err) {
            setError(res.err);
            clearKeyStore();
        }
        setAuthCode(res.data?.token as string);
        const loginRes = res.data as LoginResponse
        storePublicKeyData(loginRes.user.pubKey, getAddressFromPubKey(loginRes.user.pubKey));
        storePrivateKey(loginRes.user.secretKey);
        showLoading(false);
        router.reload();
    }

    const loginUsingData = async () => {
        // Show loading and replace the buttons
        showLoading(true);
        // Closing the error alert if any
        setError(null);
        let _args = JSON.parse(getItemFromLocalStorage(LOGIN_ARGS) as string) as LoginArgs
        
        const eoaExists = await fetchUserEOAExistence(_args.eoa as string);
        if (!eoaExists) {
            showLoading(false);
            setOpenPassDiag(true);
            return;
        }
           
        // Login without keys
        await loginAndSetCode(_args);
        // showLoading(false);

    }


    const web3AuthClick = async () => {
        setError(null)
        try {
            const web3auth = new Web3Auth({
                clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string, // Get your Client ID from Web3Auth Dashboard
                chainConfig: {
                     chainNamespace: 'eip155',
                    // chainId: "0x1",
                    // rpcTarget: "https://mainnet.infura.io/v3/776218ac4734478c90191dde8cae483c",
                 },
            });
            await web3auth.initModal();
            const provider = await web3auth.connect();
            const authUser = await web3auth.authenticateUser();
            const userInfo = await web3auth.getUserInfo();

            let appPubKey;
            let eoa;
            let isEOAWeb2 = false
            if (userInfo.verifierId === undefined) {
                const keys = await provider?.request({
                    method: 'eth_accounts'
                }) as string[];
                appPubKey = keys[0];
                isEOAWeb2 = false;
                eoa = appPubKey
            }else {
                const app_scoped_privkey = await web3auth.provider?.request({
                        method: "eth_private_key"
                    }) as any;
                appPubKey = getPublicCompressed(Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex")).toString("hex");
                eoa = userInfo.verifierId;
                isEOAWeb2 = true;
            }
            let _arg = {
                route: 'wa',
                eoa,
                wa: {
                    appPubKey: appPubKey,
                    idToken: authUser.idToken,
                    isEOAWeb2: isEOAWeb2
                }
            }
            storeItemInLocalStorage(LOGIN_ARGS, JSON.stringify(_arg))
            

            await loginUsingData();
        }catch (err) {
            console.log(err);
            setError('Unknown error')
        }
    }

    const onUdAuthClick = async () => {
        setError(null)
        try {
            const uauth = new Client({
                clientID: "c93734f0-f331-46bb-9bc9-19e0e4fbf2c8",
                clientSecret: process.env.NEXT_PUBLIC_UD_CLIENT_SECRET,
                clientAuthMethod: "client_secret_basic",
                redirectUri: "http://localhost:3000",
                scope: "openid wallet"
            })
            const authorization = await uauth.loginWithPopup();
            const account = uauth.getAuthorizationAccount(authorization);
            let _arg = {
                route: 'ud',
                eoa: account?.address as string,
                ud: {
                    message: btoa(account?.message as string),
                    signature: account?.signature as string
                }
            }
            storeItemInLocalStorage(LOGIN_ARGS, JSON.stringify(_arg));
            await loginUsingData();
        }catch (e) {
            console.log(e);
            
            setError('Unknown error')
        }
    }

    return <>
        <Box sx={{
            width: '100vw',
            height: '100vh',
            backgroundColor: colors.tertiary
        }}>
            <Box sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>

                <PasswordInputDialog open={openPassDiag} 
                onSecretInput={(val) => {onSecret(val)}}
                onClose={() => {}} />
                <Card sx={{
                    padding: '4ch'
                }}>
                    <Stack direction={'column'}>
                        <Typography variant="h6" textAlign={'center'}>Login</Typography>
                        {(isLoading)? <Loader /> :
                        <>
                            <Button 
                        onClick={() => {web3AuthClick()}}
                         startIcon={
                            <Image width={30} src={Web3AuthLogo} alt='web3auth logo' />
                         }
                        sx={{
                            marginTop: '5ch',
                            marginBottom: '2ch'
                        }} variant='outlined'>Login using socials and wallets</Button>

                        <Button onClick={() => {onUdAuthClick()}}>
                            <Image src={UDLogo} alt='ud logo' />
                        </Button>
                        </>
                        }
                    </Stack>
                </Card>
            </Box>
            <Snackbar open={error !== null} autoHideDuration={6000} onClose={() => {setError(null)}}>
                <Alert onClose={() => {setError(null)}} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Box>
    </>;
}