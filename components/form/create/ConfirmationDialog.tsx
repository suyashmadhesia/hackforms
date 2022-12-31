import { Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Switch, Stack, Step, StepLabel, Stepper, TextField, Button, Typography } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import { formActions } from "../../../store/formSlice";
import { useState } from "react";
import { colors } from "../../../styles/theme";


function Configurations(props: {index: number, onNext: (index: number) => void}) {

    const [title, description, startDate, endDate, isClosed] = useAppSelector(state =>[
        state.form.formIntro.title,
        state.form.formIntro.description,
        state.form.formParams.startDate,
        state.form.formParams.endDate,
        state.form.formParams.isClosed
    ])

    const dispatch = useDispatch()

    const titleHandler = (value: string) => {
        dispatch(formActions.setTitle(value));
    }

    const descriptionHandler = (value: string) => {
        dispatch(formActions.setIntroDescription(value));
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
        props.onNext(props.index)
    }

    return <Stack direction={'column'} spacing={2}>
        <TextField value={title} onChange={(e) => {titleHandler(e.target.value)}} fullWidth required label='Title' variant="outlined"></TextField>
        <TextField value={description} onChange={(e) => {descriptionHandler(e.target.value)}} fullWidth multiline maxRows={4} label='Description' variant="outlined"></TextField>
        <Stack direction='row' spacing={2}>
           <FormControl>
            <label>Start Date</label>
           <TextField value={startDate} onChange={(e) => {startDateHandler(e.target.value)}} placeholder="Start Date" variant="outlined" type='date' ></TextField>
           </FormControl>
           <FormControl>
            <label>End Date</label>
           <TextField value={endDate} onChange={(e) => {endDateHandler(e.target.value)}} placeholder="End Date" variant="outlined" type='date' ></TextField>
           </FormControl>
        </Stack>
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


export default function ConfirmationDialog() {
    const [openConfirmationDialog] = useAppSelector(state => [state.form.openConfirmationDialog]);
    const dispatch = useDispatch()

    const [step, setStep] = useState(0)

    const onNext = (index: number) => {
        if (index < 4){
            setStep(index + 1)
        }
    }

    const onCloseHandler = () => {
        dispatch(formActions.setOpenConfirmationDialogState(false))
    }
    return <Dialog open={openConfirmationDialog} onClose={onCloseHandler}>
        <DialogTitle marginBottom={'2ch'}>
            <Stepper activeStep={step} alternativeLabel>
                <Step key={0}>
                    <StepLabel>Configurations</StepLabel>
                </Step>
                <Step key={1}>
                    <StepLabel>Rewards</StepLabel>
                </Step>
                <Step key={2}>
                    <StepLabel>Share</StepLabel>
                </Step>
                <Step key={3}>
                    <StepLabel>Processing</StepLabel>
                </Step>

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