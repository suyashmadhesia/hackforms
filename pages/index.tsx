// import {Web3Auth} from '@web3auth/modal';
// import { getPublicCompressed } from "@toruslabs/eccrypto";
import Client from '@uauth/js'
import * as EthCrypto from 'eth-crypto'
import { useState } from 'react';
import LoginDialog from '../components/Login';

export default function Home() {

  const [open, setOpen] = useState(false)

  const onLoginClick = async () => {
    setOpen(true)
    // const web3auth = new Web3Auth({
    //   clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string, // Get your Client ID from Web3Auth Dashboard
    //   chainConfig: {
    //     chainNamespace: 'eip155',
    //     // chainId: "0x1",
		//     // rpcTarget: "https://mainnet.infura.io/v3/776218ac4734478c90191dde8cae483c",
    //   },
    // });

  //   let a =`identity.unstoppabledomains.com wants you to sign in with your Ethereum account:
  // 0x994752691A7650Ca546839997B7F0a23ce333B36
  
  // I consent to giving access to: email openid profile:optional social:optional wallet
  
  // URI: uns:piyush-103904.wallet
  // Version: 1
  // Chain ID: 1
  // Nonce: 0x3f25e567d70a9994085de332b12bbbf3a12096893f4d3f5d28a6d31701604a74
  // Issued At: 2023-01-01T19:13:49.054Z`

  // let sig =`0xe3351bf9c450ba868d83c476a6141cd0e2d424ee85e4de6047d1c69351880a304330c878f27c2820064fa4d333e2fb632e8fb821d4d3719c86a2261c8f47635f1c`
  // console.log(
  //   EthCrypto.recover(
  //     sig,

  //   )
  // )

    // const uauth = new Client({
    //   clientID: "c93734f0-f331-46bb-9bc9-19e0e4fbf2c8",
    //   clientSecret: process.env.NEXT_PUBLIC_UD_CLIENT_SECRET,
    //   clientAuthMethod: "client_secret_basic",
    //   redirectUri: "http://localhost:3000",
    //   scope: "openid wallet email profile:optional social:optional"
    // })
    // const authorization = await uauth.loginWithPopup();
    // const account = uauth.getAuthorizationAccount(authorization);
    // console.log(account);
    // // console.log(account?.signature);
    // console.log(btoa(account?.message as string))
    // console.log(account?.signature)
    
    
    

    // await web3auth.initModal();
    // await web3auth.connect();
    // const app_scoped_privkey = await web3auth.provider?.request({
    //   method: "eth_private_key", // use "private_key" for other non-evm chains
    // }) as any;
    // const app_pub_key = getPublicCompressed(Buffer.from(app_scoped_privkey.padStart(64, "0"), "hex")).toString("hex");
    // const user = await web3auth.getUserInfo();
    // console.log(user);
    // console.log(app_pub_key);
    

    
  }

  

  return (
    <div>
      <button onClick={() => {onLoginClick()}}>Login</button>
      <LoginDialog open={open} onClose={() => {setOpen(false)}} />
    </div>
  );
}
