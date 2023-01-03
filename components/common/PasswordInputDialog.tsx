import { Avatar, Button, Dialog, DialogContent, DialogTitle, FormControl, IconButton, TextField } from "@mui/material";
import { Box } from "@mui/system";
import {MdOutlineVpnKey} from 'react-icons/md'
import { colors } from "../../styles/theme";
import { useState } from "react";
import { digestSeed } from "../../common/security";
import InputAdornment from '@mui/material/InputAdornment';
import {MdOutlineVisibility, MdOutlineVisibilityOff} from 'react-icons/md'
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

interface PasswordInputDialogProps {
    open: boolean;
    onClose: () => void;
    onSecretInput: (secret: string) => void;
    title?: string;
    errorText?: string;

}

export default function PasswordInputDialog(props: PasswordInputDialogProps) {
    
    const [secret, setSecret] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false)

    const changeHandler = (value: string) => {
        setSecret(value);
    }
    const onContinueClick = () => {
        // TODO: Password based decryption 
        // Ad feature to calculate the key out of password
        if (secret === undefined || secret.length < 4){
            return;
        }
        const _sec = secret;
        setSecret('')
        props.onSecretInput(_sec);
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    
    return <Dialog open={props.open} onClose={props.onClose}>
        <DialogTitle>{ props.title === undefined ? 'Enter Password': props.title}</DialogTitle>
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
            <FormControl fullWidth>
            <OutlinedInput value={secret} 
            error={props.errorText !== undefined && props.errorText.length < 0}
            onChange={(e) => {changeHandler(e.target.value)}} type={showPassword ? 'text': 'password'} sx={{
                marginTop: '5ch'
            }}
            aria-describedby="component-helper-text"
            endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <MdOutlineVisibilityOff /> : <MdOutlineVisibility />}
                  </IconButton>
                </InputAdornment>
              }
            
            />
            {
                (props.errorText) ? <FormHelperText sx={{color: 'red'}} id="component-helper-text">
                Password is not matching
            </FormHelperText>: <></>
            }
            </FormControl>
            <Button variant='contained' size='large'  disableElevation
                style={{
                    width: '100%',
                    backgroundColor: colors.primary,
                    marginTop: '2ch'
                }}
                onClick={() => {onContinueClick()}}

            >Continue</Button>

        </Box>
        </DialogContent>
    </Dialog>
}