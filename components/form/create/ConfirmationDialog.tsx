import { Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Switch, Stack, Step, StepLabel, Stepper, TextField, Button, Typography, InputLabel, Select, MenuItem } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import { formActions } from "../../../store/formSlice";
import { useState } from "react";
import { colors } from "../../../styles/theme";
import PasswordInputDialog from "../../common/PasswordInputDialog";
import { decryptAES, decryptData, digestSHA256, encryptWithPublicKey, exportAESKey, generateAESKey, generateAESKeyFromSeed, getPublicKeyFromPrivKey, importAESKey, loadPrivateKeys, loadPublicKeyData } from "../../../common/security";
import { getFormattedDateString } from "../../../common";
import dayjs, { Dayjs } from 'dayjs';



function Configurations(props: {index: number, onNext: (index: number) => void}) {

    const [access,startDate, endDate, isClosed, params] = useAppSelector(state =>[
        state.form.formParams.access,
        state.form.formParams.startDate,
        state.form.formParams.endDate,
        state.form.formParams.isClosed,
        state.form.formParams
    ]);

    const getFormattedDate = (dateStr?: string) => {
        if (dateStr === undefined) return dateStr;
        return dayjs(dateStr).format('YYYY-MM-DD')
    }
    

    const [openPassDiag, setOpenPassDiag] = useState(false);

    const dispatch = useDispatch();

    const pubKey = loadPublicKeyData();


    const getPasswordInputTitle = () => {
        return 'Encrypting the form';
    }

    const generateEncKey = async () => {
        const formEncKeyStr = await exportAESKey(await generateAESKey()); 
        const encryptedAesKey = await encryptWithPublicKey(pubKey.pubKey, formEncKeyStr);
        dispatch(formActions.addRecord([pubKey.pubKey, encryptedAesKey]));
        dispatch(formActions.setKeyHash(digestSHA256(formEncKeyStr)));
    }

    // const invitePublicKey = async (pubKey: string, secret: string) => {
    //     const encKeyStr = await getEncKey({
    //         pubKey: pubKey,
    //         secret
    //     });
    //     if ( encKeyStr === undefined) {
    //         return;
    //     }
    //     const pubKeyEncryptedKeyStr = await encryptWithPublicKey(pubKey, encKeyStr);
    //     dispatch(formActions.addRecord([pubKey, pubKeyEncryptedKeyStr]));
    // }   

    



    const onSecret = async (secret: string) => {
    }


    const startDateHandler = (value: string) => {
        dispatch(formActions.setStartDate(value))
    }

    const endDateHandler = (value: string) => {
        dispatch(formActions.setEndDate(value))
    }

    const setIsClosed = (value: boolean) => { 
        dispatch(formActions.setIsClosed(!value))
    }

    const onContinueClick = () => {
        if (startDate === undefined || startDate.length === 0) {
            dispatch(formActions.setStartDate(
                getFormattedDateString(new Date(Date.now()))
            ));
        } 
        props.onNext(props.index)
    }

    const onAccessSelect = async (val: string) => {
        dispatch(formActions.setAccess(val))
        if (val !== 'public') {
            await generateEncKey();
        }
    }

    return <Stack direction={'column'} spacing={2}>
        
        <Stack direction='row' spacing={2}>
           <FormControl>
            <label>Start Date</label>
           <TextField  value={getFormattedDate(startDate)} onChange={(e) => {startDateHandler(e.target.value)}} placeholder="Start Date" variant="outlined" type='date' ></TextField>
           </FormControl>
           <FormControl>
            <label>End Date</label>
           <TextField value={getFormattedDate(endDate)} onChange={(e) => {endDateHandler(e.target.value)}} placeholder="End Date" variant="outlined" type='date' ></TextField>
           </FormControl>
        </Stack>
        <FormControl fullWidth>
            <InputLabel id="access-label">Access</InputLabel>
            <Select
                labelId="access-label"
                id="access-label"
                value={access}
                label='Access'
                onChange={(e) => {onAccessSelect(e.target.value)}}
            >
                <MenuItem id='public' value={'public'}>Public</MenuItem>
                <MenuItem id='private' value={'private'}>Private</MenuItem>
                {/* <MenuItem value={'protected'}>Protected</MenuItem> */}
            </Select>
        </FormControl>

        <PasswordInputDialog open={openPassDiag}
        title={getPasswordInputTitle()}
        onClose={() => {
            setOpenPassDiag(false)
        }} 
        
        onSecretInput={onSecret}
        />

        <FormControlLabel label='Form accepting response? ' 
        control={
        <Switch checked={!isClosed} 
        inputProps={{ 'aria-label': 'controlled' }} 
        onChange={(e) => {setIsClosed(e.target.checked)}}  
        />}></FormControlLabel>

        <Button variant='contained' size='large'  disableElevation
                style={{
                    width: '100%',
                    backgroundColor: colors.primary,
                    marginTop: '2ch'
                }}
                onClick={() => {onContinueClick()}}

            >Continue</Button>
    </Stack>
}


function Reward(props: {index: number, onNext: (index: number) => void}) {

    const [rate, maxNumberOfResponse] = useAppSelector(state => [state.form.formParams.rate, state.form.formParams.maxNumberOfResponse]);

    const dispatch = useDispatch()

    const getTotalAmount = () => {
        if (rate !== undefined && maxNumberOfResponse !== undefined) {
            return (rate * maxNumberOfResponse).toString() + ' ETH';
        }
    }
    const rateHandler = (value: string) => {
        value = value.length === 0 ? '0': value;
        dispatch(formActions.setRate(parseFloat(value)));
    }

    const numberOfResponseHandler = (value: string) => {
        value = value.length === 0 ? '0': value;
        dispatch(formActions.setNumberOfResponse(parseInt(value)));
    }

    const setIsPayable = () => {
        // TODO: run contract based login to fill the value
    }

    const onContinueClick = () => {
        // TODO: Implement logic to connect wallet, deposit in escrow
        props.onNext(props.index)
    }

    return <Stack direction={'column'} spacing={2}>
    
    <FormControl>
        <label>Amount for each response</label>
        <TextField value={rate} onChange={(e) => {rateHandler(e.target.value)}} 
        fullWidth required label='Rate' type='number' variant="outlined"></TextField>
    </FormControl>

    <FormControl>
        <label>Max. number of response</label>
        <TextField value={maxNumberOfResponse} onChange={(e) => {numberOfResponseHandler(e.target.value)}} 
        fullWidth required label='Number of Response' type='number' variant="outlined"></TextField>
    </FormControl>

    <Typography textAlign={'center'} variant='h6' >
        {getTotalAmount()}
    </Typography>

    <Button variant='contained' size='large'  disableElevation
            style={{
                width: '100%',
                backgroundColor: colors.primary,
                marginTop: '2ch'
            }}
            onClick={() => {onContinueClick()}}

        >Continue</Button>
</Stack>
}


export default function ConfirmationDialog(props: {
    openConfirmationDialog: boolean;
    onClose: () => void;
    onConfirm: () => void;
}) {
    // const [openConfirmationDialog] = useAppSelector(state => [state.form.openConfirmationDialog]);
    const [step, setStep] = useState(0)

    const onNext = (index: number) => {
        if (index < 1){
            setStep(index + 1)
        }else {
            props.onConfirm()
        }
    }

    const onCloseHandler = () => {
        props.onClose()
    }
    return <Dialog open={props.openConfirmationDialog} onClose={onCloseHandler}>
        <DialogTitle marginBottom={'2ch'}>
            <Stepper activeStep={step} alternativeLabel>
                <Step key={0}>
                    <StepLabel>Configurations</StepLabel>
                </Step>
                <Step key={1}>
                    <StepLabel>Rewards</StepLabel>
                </Step>
                {/* <Step key={2}>
                    <StepLabel>Invite</StepLabel>
                </Step> */}
                {/* <Step key={2}>
                    <StepLabel>Processing</StepLabel>
                </Step> */}

            </Stepper>
        </DialogTitle>
        <DialogContent sx={{
            paddingTop: '2ch',
        }}>
            {
              (step === 0)? <Configurations index={0} onNext={onNext} />: <></>
            }
            {
              (step === 1)? <Reward index={1} onNext={onNext} />: <></>
            }
            {/** TODO: Need to add Share and processing */}
        </DialogContent>
    </Dialog>
}