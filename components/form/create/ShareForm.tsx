import { Box, Button, Card, CardContent, InputAdornment, OutlinedInput, Stack, TextField, Typography } from "@mui/material";
import { EncryptedForm } from "../../../common/types";
import { colors } from "../../../styles/theme";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { decryptAES, decryptData, generateAESKeyFromSeed, loadPublicKeyData } from "../../../common/security";
import PasswordInputDialog from "../../common/PasswordInputDialog";
import BackdropLoader from "../../common/BackdropLoader";


export default function ShareForm(props: {form: EncryptedForm}){

    const getUrl = () => {
        if (typeof window === 'undefined') {
            return ''
        }
        const url = new URL(window.location.origin);
        url.pathname = `/form/${props.form.payload.meta.formId}`;
        if (accessKey !== null) {
            url.searchParams.append('access', accessKey);
        }
        return url.toString();
    }

    const value = 'htp'

    const onCopyButtonClick = () => {
        navigator.clipboard.writeText(getUrl());
    }


    const [openPassDia, setOpenPassDia] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [accessKey, setAccessKey] = useState<string | null>(null);
    const [errorTitle, setErrorTitle] = useState<string | undefined>();

    useEffect(() => { 
        if(props.form.header.access === "private") {
            setOpenPassDia(true);
        }
    }, []);

    const onSecret = async (secret: string) => {
        setOpenPassDia(false);
        setOpenBackdrop(true);
        const pubKey = loadPublicKeyData();
        try {
            const aesKey = await decryptData(props.form.payload.subRecord[pubKey.pubKey], secret);
            setAccessKey(aesKey);
            setOpenBackdrop(false);
        
        }catch {
            console.log(setErrorTitle('Password is not matching.'));
            setOpenBackdrop(false);
            setOpenPassDia(false);
        }
        
    }

    const getDescriptionText = () => {
        switch(props.form.header.access) {
            case "public":
                return `This form is public anyone can access and fill the form through this link or discovery through IPFS explorer.`
            case "private":
                return `This form is private only people with the link can access and fill the form. Content on IPFS is encrypted.`
            
            case "protected":
                return `This form is protected only people invited by you can access and fill the form. Content on IPFS is encrypted.`
        }
    }

    
    return <Box sx={{
        width: '100vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.tertiary,
        paddingTop: '10ch'
    }}>
        <Box>
            <Card sx={{
                width:'70vw'
            }}>
                <PasswordInputDialog
                    open={openPassDia}
                    onClose={() => {}}
                    onSecretInput={onSecret}
                    title='Decrypt sharing key'
                    errorText={errorTitle}
                />

                <BackdropLoader open={openBackdrop} onClose={() => {}} />
                <CardContent>
                    <Typography variant='h5' sx={{
                        marginBottom: '3ch'
                    }} >Share your form</Typography>

                    <Typography sx={{marginBottom: '2ch'}} >{getDescriptionText()}</Typography>
                    {
                        (props.form.header.access === "protected")? <></>:
                        <OutlinedInput
                            fullWidth
                            disabled
                    
                            id="outlined-adornment-weight"
                            value={getUrl()}
                            endAdornment={<InputAdornment position="end">
                                <Button onClick={() => {onCopyButtonClick()}} >Copy</Button></InputAdornment>}
                            aria-describedby="outlined-weight-helper-text"
                            inputProps={{
                                'aria-label': 'weight',
                            }}
                        />
                    }
                </CardContent>
            </Card>
        </Box>
    </Box>
}
