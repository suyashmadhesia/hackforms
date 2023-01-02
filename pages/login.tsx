
import { Snackbar, Alert, Box, Typography, Stack, Card, Button } from "@mui/material";
import Image from 'next/image';
import Web3AuthLogo from '../assets/img/web3Auth.png'
import UDLogo from '../assets/svg/default-large.svg'
import { colors } from "../styles/theme";

import {Web3Auth} from '@web3auth/modal';
import { getPublicCompressed } from "@toruslabs/eccrypto";
import Client from '@uauth/js'
import { useState } from "react";



export default function Login() {

    const [error, setError] = useState<string|null>(null);


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
            await web3auth.connect();
            const app_scoped_privkey = await web3auth.provider?.request({
                method: "eth_private_key"
            }) as any;
            const app_pub_key = getPublicCompressed(Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex")).toString("hex");
            const user = await web3auth.getUserInfo();
            console.log(user);
            console.log(app_pub_key);
        }catch (err) {
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
            console.log(account);
        }catch (e) {
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

                <Card sx={{
                    padding: '4ch'
                }}>
                    <Stack direction={'column'}>
                        <Typography variant="h6" textAlign={'center'}>Login</Typography>
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