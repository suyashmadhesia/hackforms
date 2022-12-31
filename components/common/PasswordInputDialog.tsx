import { Avatar, Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Box } from "@mui/system";
import {MdOutlineVpnKey} from 'react-icons/md'
import { colors } from "../../styles/theme";
import { useState } from "react";

interface PasswordInputDialogProps {
    open: boolean;
    onClose: () => void;
    onSecretInput: (secret: string) => void;

}

export default function PasswordInputDialog(props: PasswordInputDialogProps) {
    
    const [secret, setSecret] = useState<string>();
    const changeHandler = (value: string) => {
        setSecret(value);
    }
    const onContinueClick = () => {
        // TODO: Password based decryption 
        // Ad feature to calculate the key out of password
        const key = secret;
        props.onSecretInput(key as string);
        props.onClose()
    }

    
    return <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>Enter Password</DialogTitle>
        <DialogContent>
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '4ch',
            paddingTop: '4ch'
        }}>
            <Avatar sizes="xl" >
                <MdOutlineVpnKey />
            </Avatar>
            <TextField value={secret} 
            onChange={(e) => {changeHandler(e.target.value)}} type={'password'} sx={{
                marginTop: '5ch'
            }}></TextField>
            <Button variant='contained' size='large'  disableElevation
                style={{
                    width: '100%',
                    backgroundColor: colors.primary,
                    marginTop: '2ch'
                }}
                onClick={() => {onContinueClick()}}

            >Publish</Button>

        </Box>
        </DialogContent>
    </Dialog>
}