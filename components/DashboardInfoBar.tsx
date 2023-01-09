import { Box, Button, Card, CardContent, Stack, Tooltip, Typography } from "@mui/material";
import { FaEthereum } from "react-icons/fa";
import { colors } from "../styles/theme";
import { useAccount, useSigner } from "wagmi";
import { useEscrowContract } from "../common/custom_hooks";
import { useEffect, useState } from "react";
import { Web3Button } from "@web3modal/react";
import { formatBigNumberToEth } from "../common/contract";
import { removeAuthDetails } from "../common/security";
import { useRouter } from "next/router";


export default function DashboardInfoBar() {

    const {isConnected} = useAccount();
    const [balance, setBalance] = useState('0');
    const escrowContract = useEscrowContract();
    const signer = useSigner().data;
    const router = useRouter()

    const fetchAccountBalance = async () => {
        if (escrowContract === undefined || signer === undefined) return;
        const balance = await escrowContract.balance(signer as any);
        setBalance(formatBigNumberToEth(balance));
    }

    useEffect(() => {
        if (isConnected && escrowContract !== undefined) {
            try {
                fetchAccountBalance().then();
            }catch(e) {
                console.log(e);
                
            }
        }
    }, [isConnected, escrowContract, signer]);



    return <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'visible',
        paddingTop: '2ch',
        border: `1px solid ${colors.tertiary}`,
        borderLeft: '0px'
    }}>
        <Tooltip title="Your escrowed balance">
                    <Card sx={{
                        marginTop: '2ch',
                        marginBottom: '4ch',
                        backgroundColor: '#1A1A1A',
                        marginX: '1ch',
                        color: 'white'
                    }} elevation={0} variant={"outlined"}  >
                        <CardContent>
                            <Box sx={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'center'
                            }}>
                                <Web3Button  balance="show"/>
                            </Box>
                            {
                                (!isConnected)? undefined:
                                <Stack sx={{
                                    marginTop: '2.5ch'
                                }} alignItems={'center'} spacing={2} justifyContent={'space-around'} direction='row'>
                                    <FaEthereum size={40} />
                                    <Typography variant="body1" fontWeight={'bold'} >{balance} ETH</Typography>
                                </Stack>
                            }
                        </CardContent>
                    </Card>
                </Tooltip>
                <Button variant="contained" disableElevation onClick={()=>{
                    removeAuthDetails();
                    window.localStorage.clear()
                    router.replace('/login')
                }} >Logout</Button>
       
    </Box>
}