import { GetServerSidePropsContext } from 'next';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { fetchFormContentUsingId, fetchResponseContentUsingFormId } from '../../common';
import { EncryptedData, EncryptedForm, EncryptedFormResponse, ResponseData, SerializedFormResponse } from '../../common/types';
import { useEffect, useState } from 'react';
import { Alert, Box, IconButton, Snackbar } from '@mui/material';
import BackdropLoader from '../../components/common/BackdropLoader';
import PasswordInputDialog from '../../components/common/PasswordInputDialog';
import { decryptAES, decryptData, digestSHA256, encryptAES, encryptWithPublicKey, exportAESKey, generateAESKey, generateAESKeyFromSeed, importAESKey, loadPrivateKeys, loadPublicKeyData } from '../../common/security';
import { getEOA, getItemFromLocalStorage, removeItemFromLocalStorage, storeItemInLocalStorage } from '../../common/storage';
import { useEscrowContract, useGetLoginStatus } from '../../common/custom_hooks';
import { useRouter } from 'next/router';
import { apiServer, openServer } from '../../common/axios';
import { AxiosError } from 'axios';
import { MdArrowBack } from 'react-icons/md';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { HackformsEscrowContractHandler, parseToBigNumber } from '../../common/contract';
import { useWeb3Modal } from '@web3modal/react';
import { ethers } from 'ethers';


interface FormPageInterface {
    form: EncryptedForm;
    access: string | null;
    count: number
}

async function fetchResponseCount(formId: string) {
    const res = await openServer.get<ResponseData<number>>(`/api/response/count/${formId}`)
    return res.data.data || 0
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    // Fetch data from external API
    const query = context.query
    if (query['formId']  === undefined) {
        return {props: {}}
    }
   const form = await fetchFormContentUsingId(query['formId'] as string);
   const responseCount = await fetchResponseCount(query['formId'] as string)
   const props:FormPageInterface = {
    form,
    access: (query['access'] || null) as string | null,
    count: responseCount
   }
    // Pass data to the page via props
    return { props: {...props} }
  }


var timerId = 0;
var isCreateFormResponseLocked = false
var hasMadeContractRequest = false;

const escrowContract = new HackformsEscrowContractHandler();

export default function FormPage(props: FormPageInterface) {

    const [surveyModel, setSurveyModel] = useState<Model | null>(null);
    const [openPassDiag, setOpenPassDiag] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(true);
    const [passError, setPassError] = useState<string|undefined>()
    const [error, setError] = useState<string | null>(null);
    const [formResponse, setResponse] = useState<EncryptedFormResponse |undefined>();
    const [formResponseRequestCompleted, setFormResponseRequestCompleted] = useState(false);
    const [enquiryCompleted, setEnquiryCompleted] = useState(false);
    const [isPayable, setIsPayable] = useState(false);
    const [isOnline, setIsOnline] = useState(!props.form.payload.meta.isClosed);

    const STORE_NAME = `res__${props.form.payload.meta.formId}`;
    const isUserLoggedIn = useGetLoginStatus();
    const router = useRouter()

    const onClosePassDiag = () => {
        setOpenPassDiag(false)
    }

    const loadResponse = () => {
        const formResponse = getItemFromLocalStorage(STORE_NAME);
        if (formResponse === null) {
            return null;
        }
        return JSON.parse(formResponse).res;
    }

   



    const getSurveyResponse = () => {
        const surveyJsonArray = surveyModel?.getPlainData() || [];
        const surveyJson: Record<string, string> = {}
        const surveyWithQuestionTitle: Record<string, string> = {}
        for(const ques of surveyJsonArray) {
            surveyJson[ques.name] = ques.value;
            surveyWithQuestionTitle[ques.title || ques.name] = ques.displayValue;
        }
  
        return {
            res: surveyJson,
            dataFrame: surveyWithQuestionTitle
        };
    }

    const saveResponse = (data: any) => {
        const surveyJson = getSurveyResponse();
        storeItemInLocalStorage(STORE_NAME, JSON.stringify(surveyJson))
    }

    const flushResponse = () => {
        removeItemFromLocalStorage(STORE_NAME);
    }


    const getAlternateSubRecordKey = (pubKey: string) => {
        return `${pubKey}__form`;
    }

    const initialSetup = async (response?: EncryptedFormResponse) => {

        if (!enquiryCompleted || !isOnline) return;
        // console.log('Crossed');
        const pubKey = loadPublicKeyData();
        // if (props.form.header.access !== 'public') {
            if (props.form.payload.subRecord[pubKey.pubKey] === undefined && props.access === undefined) {
                setError('You cannot open this form');
                setOpenBackdrop(false);
            }else {
                if (props.access !== null && formResponse === undefined) {
                    await decryptDatAndUpdateState();
                    if (formResponseRequestCompleted){
                        setOpenBackdrop(false);
                    }
                     
                }else{
                    setOpenBackdrop(false);  
                    setOpenPassDiag(true);
                }
                
                
            }
        // }else {
        //     const model = new Model(JSON.parse(props.form.payload.data));
        //     configureSurveyModel(props.form.payload.data, response?.payload.data);
        //     setSurveyModel(model);
        //     setError(null);
        //     setOpenBackdrop(false);
        // }
    }

    const configureSurveyModel = (data: string, response?: string) => {
        const model = new Model(JSON.parse(props.form.payload.data));
            if(response !== undefined) {
                model.data = JSON.parse(response).res
            }
            setSurveyModel(model);
            setError(null);
            setOpenBackdrop(false);
    }

 
    const {isConnected, address} = useAccount();

    const openWeb3Modal = useWeb3Modal().open

    const checkContractConstraint = async () => {
        if(props.form.payload.meta.rate !== undefined &&
            (props.form.payload.meta.rate as number) > 0 &&
            !enquiryCompleted && !hasMadeContractRequest
            ) {
                hasMadeContractRequest = true;
                const formId = props.form.payload.meta.formId as string
                
                const hasDeal = await escrowContract.hasDeal(formId);
                // console.log('hasDeal ', hasDeal);
                
                setIsPayable(hasDeal)
                if (!hasDeal) {
                    setIsPayable(false);
                }else {
                    // console.log('isConnected ', isConnected, );
                    await checkBalanceConstraint();
                   
                }
        }
        setEnquiryCompleted(true);
        
        
    }

    const checkBalanceConstraint = async () => {
        const formId = props.form.payload.meta.formId as string;
        const rate = parseToBigNumber((props.form.payload.meta.rate as number).toString());
        const balanceOfDeal = await escrowContract.balanceOfDeal(formId);
        const hasEnoughBalance = balanceOfDeal.sub(rate.mul(ethers.BigNumber.from(props.count))) > rate;
        if (!(hasEnoughBalance && !props.form.payload.meta.isClosed)) {
            setOpenBackdrop(false);
            setOpenPassDiag(false)
            setError((hasEnoughBalance) ? 'Form is not accepting response': 'Form does not have enough balance to reward you');
        }
        setEnquiryCompleted(true);
    }


    useEffect(() => {
        if (!router.isReady) return; 
        const eoa = getEOA();
        if (eoa === null) {
            router.push('/login?redirected=true')
        }
        if (eoa !== null && props.form.payload.owner === eoa) {
            router.replace(`/form/create?formId=${props.form.payload.meta.formId as string}`)
        }
        let _response: EncryptedFormResponse;
        if (formResponse === undefined && !formResponseRequestCompleted) {
            fetchResponseContentUsingFormId(router.query['formId'] as string)
            .then((res) => {
                _response = res;  
                setResponse({..._response});
                setFormResponseRequestCompleted(true);
                checkContractConstraint();
                // initialSetup(_response);
            }).catch((err) => {
                setFormResponseRequestCompleted(true);
                checkContractConstraint()
                if ((err as AxiosError).response?.status === 404) {
                    setResponse(undefined);
                }else{
                    throw err;
                }
                
            })
        }
        // console.log(isConnected, isPayable);
        if(isPayable && !isConnected) {
            setSurveyModel(null)
            openWeb3Modal({
                route: "ConnectWallet"
            })
        }else{
            initialSetup(formResponse).then(() => {}).catch(err => {setError(err.message)});
        }
        
        
        
        return () => {
            clearInterval(timerId);
        }
    },[router.isReady, isUserLoggedIn,formResponse, enquiryCompleted,
        formResponseRequestCompleted, isConnected, isPayable]);


    const decryptDatAndUpdateState = async (secret?: string) => {
        try {
            const pubKey = loadPublicKeyData()
            // console.log(props.access === null, props.form.payload.subRecord[pubKey.pubKey] === undefined , formResponseRequestCompleted === false, formResponse);
            
            if (props.access === null && props.form.payload.subRecord[pubKey.pubKey] === undefined && formResponseRequestCompleted === false){
                return;
            }
            const decryptedFormStr = await decryptFormData(props.form, secret);
            if (decryptedFormStr === undefined) return;
            const model = new Model(JSON.parse(decryptedFormStr as string));
            if (formResponse !== undefined && secret !== undefined) {
                const decryptedResponseData = await decryptFormData(formResponse, secret, true);
                if (decryptedResponseData !== undefined){
                    model.data = JSON.parse(decryptedResponseData).res;
                }
            }
            setSurveyModel(model)
            if (formResponseRequestCompleted){
                setOpenBackdrop(false)
            }
            
        }catch(e) {
            console.log(e);
            
            setPassError('Password is not matching');
            setOpenPassDiag(true)
            return;
        }
    }


    const onSecret = async (secret: string) => {
        setPassError(undefined)
        onClosePassDiag();
        setOpenBackdrop(true);
        // // Check password
        // Decryption happening
        await decryptDatAndUpdateState(secret);
        
        
    }

    const getEncryptedDataAndKey = async (data: string) => {
        const aesKey = await generateAESKey();
        const encryptedData = await encryptAES(data, aesKey);
        const pubKey = loadPublicKeyData()
        const aesKeyStr = await exportAESKey(aesKey)
        const encryptedAesKey = await encryptWithPublicKey(pubKey.pubKey, aesKeyStr);
        const encryptedFormCreatorAESKey = await encryptWithPublicKey(
            props.form.payload.iss,
            aesKeyStr
        )
        
        const res: {
            encData: string;
            aesKeyHash: string;
            encAESKey: string;
            formOwnerAESKey: string;
            
        } & Record<string, string | undefined> =  {
            encData: encryptedData,
            aesKeyHash: digestSHA256(aesKeyStr),
            encAESKey: encryptedAesKey,
            formOwnerAESKey: encryptedFormCreatorAESKey
        };
        if (props.access !== null && props.form.payload.subRecord[pubKey.pubKey] === undefined) {
            res[getAlternateSubRecordKey(pubKey.pubKey)] = await encryptWithPublicKey(pubKey.pubKey, props.access);
            // console.log(digestSHA256(props.access), props.form);
            
        }
        return res;
    }

    const getFormattedFormResponse = async (): Promise<EncryptedFormResponse | undefined> => {
        if (surveyModel === null) {
            return;
        }

        const pubKey = loadPublicKeyData();
        const access = "protected";
        const surveyData = getSurveyResponse()
        const encDetails = await getEncryptedDataAndKey(JSON.stringify(surveyData))

        const subRecord = {
            [pubKey.pubKey]: encDetails.encAESKey,
            [props.form.payload.iss]: encDetails.formOwnerAESKey
        }
        if( props.access !== null && props.form.payload.subRecord[pubKey.pubKey] === undefined ) {
            subRecord[getAlternateSubRecordKey(pubKey.pubKey)] = encDetails[getAlternateSubRecordKey(pubKey.pubKey)] as string;
        }
        
        const encryptedFormResponse: EncryptedFormResponse = {
            header: {
                alg: 'AES-GCM',
                keyEncAlg: 'ECDSA',
                access: access
            },
            payload: {
                data: encDetails.encData,
                meta: {
                    formId: props.form.payload.meta.formId as string,
                    access: access
                },
                iss: pubKey.pubKey,
                owner: getEOA() as string,
                subRecord: subRecord,
                payableWallet: address,
                inviteList: [
                    getEOA() as string,
                    props.form.payload.owner
                ]
            },
            proof: {
                hash: digestSHA256(JSON.stringify(surveyData)),
                keyHash: encDetails.aesKeyHash
            }
        }
        return encryptedFormResponse;
    }

    const createResponse = async () => {
        setOpenBackdrop(true)
        const formattedForm = await getFormattedFormResponse();
        const data = {
            formResponse: formattedForm
        }
        // console.log(data);
        
        const res = await apiServer.post<ResponseData<SerializedFormResponse>>('/response', data);
 
        if (res.data.err) {
            setError(res.data.err)
            setOpenBackdrop(false)
            return;
        }
        setOpenBackdrop(false)
        flushResponse();
        router.reload();
    }

    const getKeyFromSubRecord = (schema: EncryptedData<any>, pubKey: string): string | undefined => {
        if (props.form.proof.hash === schema.proof.hash && schema.payload.subRecord[pubKey] === undefined 
            && formResponse !== undefined && formResponse.payload.subRecord[getAlternateSubRecordKey(pubKey)] !== undefined  ){
                return formResponse.payload.subRecord[getAlternateSubRecordKey(pubKey)]
        }
        return schema.payload.subRecord[pubKey];
    }

    const decryptFormData = async (schema: EncryptedData<any>, secret?: string, ignoreAccess: boolean = false) => {
        const pubKey = loadPublicKeyData();
        // const alternateKeyName = getAlternateSubRecordKey(pubKey.pubKey)
        const key = getKeyFromSubRecord(schema, pubKey.pubKey);
        if (schema.header.access === "public") {
            return schema.payload.data;
        }
        if (key === undefined && props.access === null) {
            setOpenBackdrop(false);
            setError('You cannot view the data');
            return;
        }
        // Access key will bypass this
        const decryptedAesKeyStr = (props.access && !ignoreAccess)? props.access: await decryptData(key as string ,secret as string);
        
        if (digestSHA256(decryptedAesKeyStr) !== schema.proof.keyHash) { 
            setPassError('Password is not matching');
            setOpenPassDiag(true)
            return;
        }
        const decryptedDataStr = await decryptAES(schema.payload.data, await importAESKey(decryptedAesKeyStr));   
        if (digestSHA256(decryptedDataStr) !== schema.proof.hash) {
            setPassError('Password is not matching form content');
            setOpenPassDiag(true)
            return;
        }
        return decryptedDataStr;

    }

    

    if (surveyModel !== null) {
        if (formResponse !== undefined) {
            surveyModel.mode = 'display';
            
        }else {
            const responseFromState = loadResponse()
        if (responseFromState !== null) {
            surveyModel.data = responseFromState;
        }
        if (timerId === 0) {
            timerId = window.setInterval(() => {
                saveResponse(surveyModel.data);
        }, 30000)
        }
        surveyModel.showPreviewBeforeComplete = 'showAllQuestions'
        surveyModel.onValueChanged.add((survey, options) => {
           saveResponse(survey.data);
            
        });
        surveyModel.onComplete.add((survey, option) => {
            clearInterval(timerId);
          if (!isCreateFormResponseLocked) {
                isCreateFormResponseLocked = true
                createResponse().then();
            }
        })
        }
        
    }

    return <Box sx= {{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'       
    }}>
        <Box sx={{
            width: '100%',
            paddingLeft: '2ch',
            paddingTop: '1ch'
        }} >
            <IconButton onClick={() =>{router.replace('/dashboard')}}>
                <MdArrowBack />
            </IconButton>
        </Box>
        <BackdropLoader open={openBackdrop}
                onClose={() => {setOpenBackdrop(false)}}
        />

        <PasswordInputDialog 
                onSecretInput={(s) => {onSecret(s)}}
                errorText={passError}
                open={openPassDiag} onClose={()=>{}} />
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