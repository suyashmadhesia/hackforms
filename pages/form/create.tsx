import Box from '@mui/material/Box';
import {CreateFormHeader} from '../../components/form/create';
import { useDispatch } from 'react-redux';
import { formActions } from '../../store/formSlice';
import dynamic from 'next/dynamic';
import { fetchFormContentUsingId } from '../../common';
import { GetServerSidePropsContext } from 'next';
import { EncryptedForm } from '../../common/types';
import { useEffect, useState } from 'react';
import { decryptAES, decryptData, digestSHA256, importAESKey, loadPublicKeyData } from '../../common/security';
import { useRouter } from 'next/router';
import PasswordInputDialog from '../../components/common/PasswordInputDialog';
import BackdropLoader from '../../components/common/BackdropLoader';
import { hasFormTicker, removeFormTicker, removeStoredForm, storeForm, storeFormTicker } from '../../common/storage';
import { useAppSelector } from '../../store/hooks';
import ShareForm from '../../components/form/create/ShareForm';
import FormResults from '../../components/form/create/FormResults';
import FormDeal from '../../components/form/create/FormDeal';



export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch data from external API
    const query = context.query
    if (query['formId']  === undefined) {
        return {props: {}}
    }
   const form = await fetchFormContentUsingId(query['formId'] as string)

    // Pass data to the page via props
    return { props: { form } }
  }



export default function CreateForm({form}: {form: EncryptedForm}) {

    const dispatch = useDispatch();
    const router = useRouter();

    const [openPassDiag, setOpenPassDiag] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [passError, setPassError] = useState<string|undefined>()

    const [tabName] = useAppSelector(state => [state.form.tabName]);

    const onClosePassDiag = () => {
        setOpenPassDiag(false)
    }

    useEffect(() => { 
        if (!router.isReady) return;
        let pubKey = loadPublicKeyData();
        if (form !== undefined) {
            storeFormTicker(form.payload.meta.formId as string);
            if (form.payload.iss !== pubKey.pubKey) {
                router.replace(`/form/${form.payload.meta.formId }`);
                return;
            }
            if(form.header.access === "public") {
                storeForm(form.payload.data);
                dispatch(formActions.loadEncForm(form));
                
            }else{
                setOpenPassDiag(true)
            }
            
              
        }else if(hasFormTicker()) { 
            removeStoredForm();
            removeFormTicker();
            router.reload()
            return;
        }

    },[router.isReady]);


    const onSecret = async (secret: string) => {
        setPassError(undefined)
        onClosePassDiag();
        setOpenBackdrop(true);
        // Check password
        let pubKey = loadPublicKeyData();
        try {
            const decryptedAesKeyStr = await decryptData(form.payload.subRecord[pubKey.pubKey] ,secret);
            if (digestSHA256(decryptedAesKeyStr) !== form.proof.keyHash) {
                setPassError('Password is not matching');
                setOpenPassDiag(true)
                return;
            }
            const decryptedFormStr = await decryptAES(form.payload.data, await importAESKey(decryptedAesKeyStr));
            storeForm(decryptedFormStr)
            dispatch(formActions.loadEncForm(form));        
            dispatch(formActions.setEditableState(true));
            setOpenBackdrop(false)
        }catch(e) {
            console.log(e);
            
            setPassError('Password is not matching');
            setOpenPassDiag(true)
            return;
        }
        
        
    }

    const SurveyCreatorWidget = dynamic(
        () => import('../../components/form/create/SurveyCreatorWidget'),
        {ssr: false}
    )


    return (
        <Box component="div" sx={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'white',
            display: 'grid',
            gridTemplateRows: '10vh 90vh',
            gridTemplateAreas: `"header" "content"`
            
        }}>
            {/* Header Component */}
            <Box component="div" sx={{
                gridArea: "header",
            }}>
                <CreateFormHeader />
            </Box>

            <BackdropLoader open={openBackdrop}
                onClose={() => {setOpenBackdrop(false)}}
                />

            <Box sx={{
                gridArea: 'content',
                overflow: 'scroll'
            }}>
                <PasswordInputDialog 
                onSecretInput={onSecret}
                errorText={passError}
                open={openPassDiag} onClose={() => {}} />

                {
                    (tabName === 'form') ? <SurveyCreatorWidget />: <></>
                }
                {
                    (tabName === 'share' && form !== undefined)? <ShareForm form={form} />: <></>
                }
                {
                    (tabName === 'result' && form !== undefined)? <FormResults form={form} /> : <></>
                }
                {
                    (tabName === 'deal' && form !== undefined)? <FormDeal form={form} /> : <></>
                }
            </Box>
        


        </Box>
    )
}