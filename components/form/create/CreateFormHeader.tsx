import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import Button from '@mui/material/Button';



import { useAppSelector } from '../../../store/hooks';
import {formActions, formGetters} from '../../../store/formSlice';
import {  styled } from '@mui/material';
import {colors} from '../../../styles/theme';
import ConfirmationDialog from './ConfirmationDialog';
import { getStoredForm, hasFormStored, removeStoredForm } from '../../../common/storage';
import { useEffect, useState } from 'react';
import BackdropLoader from '../../common/BackdropLoader';
import { decryptAES, decryptData, digestSHA256, encryptAES, generateAESKeyFromSeed, getPublicKeyFromPrivKey, importAESKey, loadPrivateKeys, loadPublicKeyData } from '../../../common/security';
import PasswordInputDialog from '../../common/PasswordInputDialog';
import { apiServer } from '../../../common/axios';
import { useRouter } from 'next/router';

export const StyledTabs = styled((props: TabsProps) => (
    <Tabs 
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      },
      '& .MuiTabs-indicatorSpan': {
        width: '100%',
        backgroundColor: 'black',
      },
});

export const StyledTab = styled((props: TabProps) => (
    <Tab  {...props} />
  ))(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&.Mui-selected': {
      color: 'black',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
}));



async function getEncKey(data: {pubKey: string, secret: string, subRecord: Record<string, string>, keyHash?: string}) {
    const aesKey = await generateAESKeyFromSeed(data.secret);
    const encryptedPrivateKey = loadPrivateKeys();
    const privKey = await decryptAES(encryptedPrivateKey, aesKey);
    if(getPublicKeyFromPrivKey(privKey) !== data.pubKey) {
        console.log('Password entered was wrong')
        return 
    }
    const encKeyStr = await decryptData(data.subRecord[data.pubKey], data.secret);
    if (data.keyHash === undefined || digestSHA256(encKeyStr) !== data.keyHash) {
        // TODO: add interactive password error;
        console.log('Password entered was wrong');
        return 
    }
    return encKeyStr;
}



export default function FormHeader() {
    const [tabName, hash, subRecord, keyHash, access, formId] = useAppSelector(state => [ 
        state.form.tabName,
        state.form.hash,
        state.form.subRecord,
        state.form.keyHash,
        state.form.formParams.access,
        state.form.formParams.formId
    ]);

    const getters = useAppSelector(state => formGetters(state.form));
    
    const dispatch = useDispatch();

    const [openDialog, setOpenDialog] = useState(false)
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [openPassDiag, setOpenPassDiag] = useState(false);

    const route = useRouter();

    useEffect(() => {

    }, [])

    const onTabChange = (name: string) => {
        dispatch(formActions.setTabIndex(name));
    }

    const encryptForm = async (secret: string) => {
        

        const form = getStoredForm() as string;
        if (access === 'public' || access === undefined) {
            return [form, digestSHA256(form)]
        }
        if (hash !== undefined && hash !== digestSHA256(form)){
            // TODO: add interactive error
            console.log("Hash of the form is not matching");
            return []
        }
        const pubKey = loadPublicKeyData()
        
        const encKeyStr = await getEncKey({
            pubKey: pubKey.pubKey,
            secret: secret,
            subRecord,
            keyHash
        });
        if ( encKeyStr === undefined) {
            console.log("Enc key is empty");
            return [];
        }
        const encryptForm = await encryptAES(form, await importAESKey(encKeyStr));
        dispatch(formActions.setEncData(encryptForm));
        dispatch(formActions.setHash(form));
        return [encryptForm, digestSHA256(form)];
        
        // TODO: Implement further logic
    }

    const onConfirm = () => {
        setOpenDialog(false)
        setOpenPassDiag(true);
        
    }

    const onSecret = async (secret: string) => {
        setOpenPassDiag(false);
        setOpenBackdrop(true)
        const _res = await encryptForm(secret)
        if (_res.length < 2) {
            console.log('encryption failed')
        }

        const form = getters.getFormattedForm(_res[0], _res[1]);
        // return;
        const requestData = {
            form,
        }       
        const pubKey = loadPublicKeyData()
        if (access !== undefined && access !== "public"){
            (requestData as any).key = subRecord[pubKey.pubKey]
        }

        const url = (formId === undefined) ? '/form/create': '/form/update'
        const res = await apiServer.post(url, requestData);
        dispatch(formActions.setFormId(res.data.data.form.id))
        // dispatch(formActions.setRawContentUrl(res.data.data.rawContentUrl));
        removeStoredForm();
        setOpenBackdrop(false)
        route.replace(`/form/create?formId=${res.data.data.form.id}`)
        
        
        
    }


    const onPublishClick = () => {
        if (!hasFormStored()) {
            return;
        }
        setOpenDialog(true);
    }

    return <Box component="div" sx={{
        display: 'grid',
        height: '100%',
        width: '100%',
        gridTemplateAreas: `"crumbs tabs tabs tabs tabs control"`,
        padding: '0.4rem',
        maxWidth: '100%'
    }}>

        {/* Breadcrumb for title */}
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '0.7rem',
            // gridArea: 'crumbs',
            maxWidth: '100%',
        }}>
            <Breadcrumbs aria-label="breadcrumb">
                <p>Workspace</p>
            </Breadcrumbs>
        </Box>

        {/* Tabs */}
        <Box sx={{
            gridArea: "tabs"
        }}>
            <StyledTabs value={tabName} 
            onChange={(e, name) => {onTabChange(name)}} 

                aria-label="secondary tabs example"
                centered
            >
                <StyledTab value='form' label="Form" />
                {
                    (route.query['formId'] === undefined) ? <></>: 
                        <StyledTab  value="share" label="Share" />
                     
                }
                {
                    (route.query['formId'] === undefined) ? <></>: 
                   
                        <StyledTab value="result" label="Result" />

                }
                </StyledTabs>
        </Box>
        {/** Confirmation Dialog */}
        <ConfirmationDialog openConfirmationDialog={openDialog}
            onClose={() => {setOpenDialog(false)}}
            onConfirm={onConfirm}
        />

        <BackdropLoader open={openBackdrop} onClose={() => {setOpenBackdrop(false)}} />

        <PasswordInputDialog open={openPassDiag} onClose={() => {setOpenPassDiag(false)}} onSecretInput={onSecret} />

        {/* Control */}
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gridArea: "control",
            paddingRight: "4ch"
        }}>
            {/* <AccessSelector access={access} onChange={onAccessChange} /> */}

            <Button variant='contained' disableElevation
                style={{
                    backgroundColor: colors.primary,
                    marginBottom: '1ch'
                }}
                onClick={() => {onPublishClick()}}

            >Publish</Button>
        </Box>

    </Box>
}