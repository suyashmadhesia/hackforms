import { GetServerSidePropsContext } from 'next';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { fetchFormContentUsingId, fetchResponseContentUsingFormId } from '../../common';
import { EncryptedForm, EncryptedFormResponse } from '../../common/types';
import { useEffect, useState } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';
import BackdropLoader from '../../components/common/BackdropLoader';
import PasswordInputDialog from '../../components/common/PasswordInputDialog';
import { decryptAES, decryptData, digestSHA256, importAESKey, loadPublicKeyData } from '../../common/security';
import { getItemFromLocalStorage, removeItemFromLocalStorage, storeItemInLocalStorage } from '../../common/storage';


interface FormPageInterface {
    form: EncryptedForm;
    response?: EncryptedFormResponse
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch data from external API
    const query = context.query
    if (query['formId']  === undefined) {
        return {props: {}}
    }
   const form = await fetchFormContentUsingId(query['formId'] as string)
   const props:FormPageInterface = {
    form,
   }
   
   try {
        const formResponse = await fetchResponseContentUsingFormId(form.payload.meta.formId as string);
        props.response = formResponse;
   }catch(e){}

    // Pass data to the page via props
    return { props: {...props} }
  }


  var timerId = 0;

export default function FormPage(props: FormPageInterface) {

    const [surveyModel, setSurveyModel] = useState<Model | null>(null);
    const [passTitle, setPassTitle] = useState('Decrypt the form')
    const [openPassDiag, setOpenPassDiag] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(true);
    const [passError, setPassError] = useState<string|undefined>()
    const [error, setError] = useState<string | null>(null);

    const STORE_NAME = `res__${props.form.payload.meta.formId}`

    const onClosePassDiag = () => {
        setOpenPassDiag(false)
    }

    const loadResponse = () => {
        const formResponse = getItemFromLocalStorage(STORE_NAME);
        if (formResponse === null) {
            return null;
        }
        return JSON.parse(formResponse);
    }

    const saveResponse = (data: any) => {
        storeItemInLocalStorage(STORE_NAME, JSON.stringify(data))
    }

    const flushResponse = () => {
        removeItemFromLocalStorage(STORE_NAME);
    }

    useEffect(() => {
        const pubKey = loadPublicKeyData();
        if (props.form.header.access !== 'public') {
            if (props.form.payload.subRecord[pubKey.pubKey] === undefined) {
                setError('You cannot open this form');
                setOpenBackdrop(false);
            }else {
                setOpenBackdrop(false);
                setOpenPassDiag(true);
            }
        }else {
            setSurveyModel(new Model(JSON.parse(props.form.payload.data)));
            setError(null);
            setOpenBackdrop(false);
        }
        return () => {
            clearInterval(timerId);
        }
    },[])


    const onSecret = async (secret: string) => {
        setPassError(undefined)
        onClosePassDiag();
        setOpenBackdrop(true);
        // // Check password
        let pubKey = loadPublicKeyData();
        try {
            const decryptedAesKeyStr = await decryptData(props.form.payload.subRecord[pubKey.pubKey] ,secret);
            if (digestSHA256(decryptedAesKeyStr) !== props.form.proof.keyHash) {
                setPassError('Password is not matching');
                setOpenPassDiag(true)
                return;
            }
            const decryptedFormStr = await decryptAES(props.form.payload.data, await importAESKey(decryptedAesKeyStr));
            setSurveyModel(new Model(JSON.parse(decryptedFormStr)));
            setOpenBackdrop(false)
        }catch(e) {
            console.log(e);
            
            setPassError('Password is not matching');
            setOpenPassDiag(true)
            return;
        }
        
        
    }


    const createResponse = (data: string) => {
 
    }

    if (surveyModel !== null) {
        const responsefromState = loadResponse()
        if (responsefromState !== null) {
            surveyModel.data = responsefromState;
        }
        if (timerId === 0) {
            timerId = window.setInterval(() => {
                saveResponse(JSON.stringify(surveyModel.data));
        }, 30000)
        }
        surveyModel.onValueChanged.add((survey, options) => {
           saveResponse(JSON.stringify(survey.data));
            
        });
    }

    return <Box sx= {{
        width: '100vw',
        height: '100vh',       
    }}>
        <BackdropLoader open={openBackdrop}
                onClose={() => {setOpenBackdrop(false)}}
        />

        <PasswordInputDialog 
                onSecretInput={onSecret}
                errorText={passError}
                open={openPassDiag} onClose={onClosePassDiag} />
        <Snackbar open={error !== null} autoHideDuration={6000} onClose={() => {setError(null)}}>
            <Alert onClose={() => {setError(null)}} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>
        {
            surveyModel === null ? <></>:
            <Survey model={surveyModel} />
        }
    </Box>;
}