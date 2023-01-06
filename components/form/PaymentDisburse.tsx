import { useEffect, useState } from "react";
import { EncryptedForm } from "../../common/types";
import { ethers } from "ethers";
import { formatBigNumberToEth, getErrorReason, parseToBigNumber } from "../../common/contract";
import { useEscrowContract } from "../../common/custom_hooks";
import { useAccount, useSigner } from "wagmi";
import { Alert, AlertColor, Box, Button, Card, CardContent, Snackbar, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { Web3Button } from "@web3modal/react";
import BackdropLoader from "../common/BackdropLoader";


export default function PaymentDisburse(props: {
    form: EncryptedForm,
    addressList: string[]
}) {

    const [isPayable, setIsPayable] = useState(false);
    const [balance, setBalance] = useState<ethers.BigNumber>(parseToBigNumber('0'));
    const [hasFetchedDetails, setHasFetchedDetails] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackDetail, setSnackDetail] = useState<[AlertColor, string]>(['info', 'Working'])
    const [openBackdrop, setOpenBackdrop] = useState(false)

    const escrowContract = useEscrowContract();
    const {isConnected} = useAccount();
    const signer = useSigner().data

    const fetchDealDetails = async () => {
        
        if(escrowContract === undefined) return
        const formId = props.form.payload.meta.formId as string
        const hasDeal = await escrowContract.hasDeal(formId);
        setIsPayable(hasDeal);
        const balance = await escrowContract.balanceOfDeal(formId);
        setBalance(balance);
        setHasFetchedDetails(true);
        setOpenBackdrop(false)
    }

    const handleOnDisburseClick = async() => {
        if (signer === null || escrowContract === undefined || props.form.payload.meta.rate === undefined || props.form.payload.meta.rate === 0) return
        try {
            setOpenSnackbar(false);
            setOpenBackdrop(true);
            const txn = await escrowContract.disburseFund(
                props.form.payload.meta.formId as string,
                parseToBigNumber((props.form.payload.meta.rate).toString()),
                props.addressList,
                signer as any
            );
            txn.wait().then(async (rs) => {
                const balance = await escrowContract.balanceOfDeal(props.form.payload.meta.formId as string);
                setBalance(balance);
                setSnackDetail(["info", `Payment is disbursed and can be checked using txn hash ${txn.hash}} `]);
                setOpenSnackbar(true)
            })
            setOpenBackdrop(false);
            setSnackDetail(["info", `Transaction is submitted and can be verified using txn hash ${txn.hash} `]);
            setOpenSnackbar(true)
        }catch(e) {
            const reason = getErrorReason(e);
            setOpenBackdrop(false);
            setSnackDetail(["error", reason]);
            setOpenSnackbar(true);
        }
    }

    useEffect(() =>{
        if(!hasFetchedDetails && props.addressList.length > 0){
            console.log('Entered the den');
            
            setOpenBackdrop(true)
            fetchDealDetails().then()
        }

    },[isConnected, escrowContract, hasFetchedDetails, props.addressList.length])

   if (!isPayable) return <></>
   return <Box sx={{
    marginBottom: '4ch',
    width: 'max-content',
    paddingX: '2ch'
   }}>
        <Card>
            <CardContent>
                <Stack direction={'row'} spacing={4} alignItems={'center'}>
                    <Stack direction={'column'}>
                        <Typography>Number of response</Typography>
                        <Typography variant="h5" textAlign={'center'}>{props.addressList.length}</Typography>
                    </Stack>
                    <Stack direction={'column'}>
                        <Typography textAlign={'center'}>Balance</Typography>
                        <Typography variant="h5" textAlign={'center'}>{formatBigNumberToEth(balance)} ETH</Typography>
                    </Stack>
                    <Stack direction={'column'} spacing={1}>
                        <Typography  fontSize={12} textAlign={'center'}>Pay {(props.form.payload.meta.rate as number * props.addressList.length)} ETH</Typography>
                        {
                        !isConnected? <Web3Button />: 
                        <Button onClick={() => {
                            handleOnDisburseClick()
                        }} disableElevation variant='contained'>Disburse {}</Button>
                    }
                        
                    </Stack>
                    
                </Stack>
                
            </CardContent>
        </Card>
        <BackdropLoader open={openBackdrop} onClose={() =>{}} />
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => {setOpenSnackbar(false)}}>
            <Alert onClose={() => {setOpenSnackbar(false)}} severity={snackDetail[0]} sx={{ width: '100%' }}>
                {snackDetail[1]}
            </Alert>
        </Snackbar>
   </Box>
}