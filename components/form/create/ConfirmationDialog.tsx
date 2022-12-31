import { Dialog, DialogContent, DialogTitle, Step, StepLabel, Stepper } from "@mui/material";
import { useAppSelector } from "../../../store/hooks";
import { useDispatch } from "react-redux";
import { formActions } from "../../../store/formSlice";


export default function ConfirmationDialog() {
    const [openConfirmationDialog] = useAppSelector(state => [state.form.openConfirmationDialog]);
    const dispatch = useDispatch()

    const onCloseHandler = () => {
        dispatch(formActions.setOpenConfirmationDialogState(false))
    }
    return <Dialog open={openConfirmationDialog} onClose={onCloseHandler}>
        <DialogTitle>
            <Stepper activeStep={3} alternativeLabel>
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
    </Dialog>
}