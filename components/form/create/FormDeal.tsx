import { Alert, AlertColor, Avatar, Box, Button, Card, CardContent, InputAdornment, Paper, Snackbar, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { EncryptedForm, ResponseData } from "../../../common/types";
import { colors } from "../../../styles/theme";
import {FaEthereum} from 'react-icons/fa'
import { Web3Button } from "@web3modal/react";
import { useAccount, useSigner } from "wagmi";
import { useEscrowContract } from "../../../common/custom_hooks";
import Divider from '@mui/material/Divider';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { formatBigNumberToEth, getErrorReason, parseToBigNumber } from "../../../common/contract";
import { openServer } from "../../../common/axios";
import BackdropLoader from "../../common/BackdropLoader";

enum SnackTypes {
    Error = 'error',
    Success = 'success'
}

async function fetchResponseCount(formId: string) {
    const res = await openServer.get<ResponseData<number>>(`/api/response/count/${formId}`)
    return res.data.data || 0
}

export default function FormDeal(props: {form: EncryptedForm}) {

    const {isConnected} = useAccount();

    const escrowContract = useEscrowContract();
    const rate = parseToBigNumber((props.form.payload.meta.rate || 0).toString())
    const [maxResponders, setMaxResponders] = useState<ethers.BigNumber>(parseToBigNumber('0'));
    const [balanceOfDeal, setBalanceOfDeal] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    // const [responseCount, setResponseCount] = useState<ethers.BigNumber>(ethers.BigNumber.from(0));
    const [paymentAmount, setPaymentAmount] = useState<string>('');
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [snackDetail, setSnackDetail] = useState<[AlertColor, string]>(['info', 'Working'])
    const [openBackdrop, setOpenBackdrop] = useState(false);


    const signer = (useSigner()).data;


    const fetchDealData = async () => {
        if (escrowContract === undefined) return;
        setOpenBackdrop(true)
        const formId = props.form.payload.meta.formId as string
        const doesDealExists = await escrowContract.hasDeal(formId);
        if (!doesDealExists) {
            setBalanceOfDeal(parseToBigNumber('0'));
            setMaxResponders(parseToBigNumber('0'));
        }

        const _balanceOfDeal = await escrowContract.balanceOfDeal(formId);
        setBalanceOfDeal(_balanceOfDeal);
        const payAmount = paymentAmount.length > 0 ? parseToBigNumber(paymentAmount) : parseToBigNumber('0')
        const _maxResponders = _balanceOfDeal.add(payAmount).div(rate);
        const responsesTillNow = ethers.BigNumber.from(await fetchResponseCount(formId));
        // setResponseCount(responsesTillNow);
        setMaxResponders(_maxResponders.sub(responsesTillNow));
        setOpenBackdrop(false)

    }


    useEffect(() => {
        fetchDealData().then()
    }, [escrowContract]);

    const handleAmountInput = (amount: string) => {
        setPaymentAmount(amount);
        if (amount.length > 0) {
            const _amnt = parseToBigNumber(amount);
            const _mRs = balanceOfDeal.add(_amnt).div(rate);
            setMaxResponders(_mRs);
        }
    }

    const handleFundDeal = async () => {
        setOpenSnackbar(false)
        if (escrowContract !== undefined && paymentAmount.length > 0 && signer) {
            const amount = parseToBigNumber(paymentAmount);
            try {
                setOpenBackdrop(true)
                const res = await escrowContract.fundDeal(props.form.payload.meta.formId as string, amount, signer as any );
                console.log(res);
                
                const recp = await res.wait();
                await fetchDealData()
                setPaymentAmount('')
                setOpenBackdrop(false);
                setOpenSnackbar(true);
                setSnackDetail([SnackTypes.Success, 'Txn is completed reload after sometime for balance update.'])
            }catch (e) {
                const reason = getErrorReason(e);
                setOpenBackdrop(false);
                setOpenSnackbar(true);
                setSnackDetail([SnackTypes.Error, reason ])
            }
        }
        
    }

    const getPaymentInputWidget = () => {
        return <Stack direction={'column'} spacing={2} >

            <TextField
                label="Amount (ETH)"
                type={'number'}
                InputProps={{
                    startAdornment: <InputAdornment position="start" >ETH</InputAdornment>
                }}
                value={paymentAmount}
                onChange={(e) => {handleAmountInput(e.target.value)}}
            />
            <Button onClick={() => {handleFundDeal()}} variant="contained" disableElevation sx={{
                paddingY: '1.5ch'
            }} >Fund Deal</Button>
        </Stack>
    }


    const getMaxResponders = () => {
        return maxResponders.toNumber().toFixed(0);
    }
    

    return <Box sx={{
        width: '100vw',
        backgroundColor: colors.tertiary,
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <Paper variant="outlined">
            <Box sx={{
                width: '50vw',
                padding: '4ch',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // justifyContent: 'space-between'
            }}>
                {
                    (isConnected)? <Web3Button /> : undefined
                }
                <Tooltip title="Balance of the deal">
                    <Card sx={{
                        marginTop: '4ch',
                        marginBottom: '4ch'
                    }} elevation={0} variant={"outlined"}  >
                        <CardContent>
                            <Stack alignItems={'center'} spacing={2} justifyContent={'space-between'} direction='row'>
                                <FaEthereum size={40} />
                                <Typography variant="h5" >{formatBigNumberToEth(balanceOfDeal)} ETH</Typography>
                                <Divider orientation="vertical" flexItem />
                                <Stack direction={'column'} spacing={1.5}>
                                    <Typography fontSize={13}><b>Reward:</b> {formatBigNumberToEth(rate)} ETH</Typography>
                                    <Typography fontSize={13}><b>Max responders:</b> {getMaxResponders()}</Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Tooltip>

                {
                    (!isConnected)? <Web3Button /> : undefined
                }
                {
                    (isConnected)? getPaymentInputWidget() : undefined
                }
                
            </Box>
        </Paper >
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => {setOpenSnackbar(false)}}>
            <Alert onClose={() => {setOpenSnackbar(false)}} severity={snackDetail[0]} sx={{ width: '100%' }}>
                {snackDetail[1]}
            </Alert>
        </Snackbar>
        <BackdropLoader open={openBackdrop} onClose={() => {}} />
    </Box>
}