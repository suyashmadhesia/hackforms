           import { useEffect, useState } from "react";
import { GetFormResponse, ResponseData, SerializedForm } from "../common/types";
import { apiServer } from "../common/axios";
import Box from '@mui/material/Box';
import {List, Paper} from '@mui/material'
import {GiPlagueDoctorProfile} from 'react-icons/gi'
import { Avatar, Button, Snackbar, Stack, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { getEOA } from "../common/storage";
import { colors } from "../styles/theme";
import { useRouter } from "next/router";
import { getUrlFromCid } from "../common";
import Link from "next/link";
import DashboardInfoBar from "./DashboardInfoBar";
import { useGetLoginStatus } from "../common/custom_hooks";


async function fetchAllMyForms() {
    const res = await apiServer.get<ResponseData<SerializedForm[]>>('/all/form');
    if (res.data.err) throw new Error(res.data.err);
    return res.data;
}

async function fetchAllMyFormResponses() {
    const res = await apiServer.get<ResponseData<GetFormResponse[]>>('/all/response');
    if (res.data.err) throw new Error(res.data.err);
    return res.data;
}




function FormTableRow(props: {title: string, cid: string, formId: string, access?: string, isClosed?: boolean}) {

    const router = useRouter()

   
    const handlePaperClick = () => { 
        router.push(`/form/${props.formId}`)
    }

    const onCidClick = (e: MouseEvent) => {
        e.preventDefault()
        const getUrl = getUrlFromCid(props.cid);
        navigator.clipboard.writeText(getUrl)
    }

    return <Link style={{
        textDecoration: 'none'
    }} href={`/form/${props.formId}`}>
    <Paper  variant="outlined" sx={{
        paddingY: '2ch',
        paddingX: '4ch'
    }} >
        <Stack direction="row" alignItems={'center'} justifyContent='space-between'>
            <Box width={'60%'}>
            <Stack direction='column'>
                <Typography onClick={() => {handlePaperClick()}}>{props.title}</Typography>
                    <Typography onClick={(e) => {onCidClick(e as any)}} variant='caption' >{props.cid}</Typography>
            </Stack>
            </Box>
            {
                props.access === undefined? <></>:
                <Tooltip title="Access rights">
                    <Typography>{props.access}</Typography>
                </Tooltip>
            }
            {
                props.isClosed === undefined? <></>:
                <Tooltip title={`Form is ${props.isClosed? 'not': ''} accepting response`}>
                    <Typography sx={{
                        backgroundColor: props.isClosed ? 'rgb(254 226 226)' : 'rgb(236 253 245)',
                        color: props.isClosed ? 'rgb(239 68 68)': 'rgb(5 150 105)',
                        paddingX: '1ch',
                        borderRadius: '0.5rem'
                    }}>{props.isClosed? 'Offline': 'Online'}</Typography>
                </Tooltip>
            }
        </Stack>
    </Paper>
    </Link>
}

export default function Dashboard() {
    const [forms, setForms] = useState<SerializedForm[]>([]);
    const [formResponses, setFormResponses] = useState<GetFormResponse[]>([]);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState<string | undefined>()
    const [tabIndex, setTabIndex] = useState(0);

    const router = useRouter();

    const eoa = typeof window === 'undefined' ? '': getEOA();


    const onAvatarBoxClick = () => {
        if (eoa) {
            navigator.clipboard.writeText(eoa);
            setOpenSnackbar('Copied ' + eoa)
        }
    }

    const handleCreateFormClick = () => {
        router.push('/form/create')
    }

    useEffect(() => {

        setOpenBackdrop(true);
        if (forms.length === 0) {
            Promise.all([fetchAllMyForms(), fetchAllMyFormResponses()])
            .then(([forms, responses]) => {
                if (forms.data !== undefined){
                    setForms(forms.data);
                }
                if (responses.data !== undefined){
                    setFormResponses(responses.data)
                }
                setOpenBackdrop(false)
            })
        }
        
    }, []);

    return <Box sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        paddingTop: '2ch'
    }}>
        <Box sx={{
            width:'100vw',
            height: 'auto',
            paddingX: '4ch',
            display: 'flex',
            justifyContent: 'space-between'
        }} >
            <Box width={'max-content'} onClick={() => {onAvatarBoxClick()}}>
                <Stack width={'auto'} borderRadius='0.5rem' border={`1px solid ${colors.tertiary}`} direction={'row'} alignItems='center' spacing={2}>
                    <Avatar variant="rounded">
                        <GiPlagueDoctorProfile />
                    </Avatar>
                    {
                        typeof window === 'undefined'? <></>: <Typography>{eoa}</Typography>
                    }
                </Stack>
            </Box>
            <Tabs  value={tabIndex} onChange={(e,index) => {setTabIndex(index)}} centered>
                <Tab label="My forms" />
                <Tab label="Responses" />
            </Tabs>
            <Box sx={{
                marginRight: '15ch'
            }}>
                <Button onClick={() => {handleCreateFormClick()}} disableElevation sx={{
                    bgcolor: 'black'
                }} variant='contained' >Create Form</Button>
            </Box>
        </Box>
        
        <Box sx={{
            width: '100vw',
            height: '90vh',
            display: 'flex',
            flexDirection: 'row'
        }}>
        <Box sx={{
            width: '20vw',
            height: '90vh',
            backgroundColor: 'white',
            
        }}>
            <DashboardInfoBar />
        </Box>
        <Box sx={{
            width: '80vw',
            height: '90vh',
            paddingX: '4ch',
            overflowY: 'scroll',
            backgroundColor:  colors.tertiary,
        }}>

            <Box sx={{
                width: '75vw',
                height: 'auto',
                marginTop: '4ch'


            }}>
                {
                    (tabIndex === 0)? <List>
                    {
                                forms.map((form) => {
                                    return <FormTableRow key={form.form.id} 
                                    formId={form.form.id}
                                    cid={form.form.cid}
                                    access={form.form.access}
                                    isClosed={form.form.isClosed}
                                    title={form.form.title} />
                                } )
                    }
                </List>:
                <List>
                    {
                                formResponses.map((res) => {
                                    return <FormTableRow key={res.formResponse.formId} 
                                    formId={res.formResponse.formId}
                                    cid={res.formResponse.cid}
                                    title={res.formResponse.title} />
                                } )
                    }
                </List>
                }
            </Box>
        </Box>
        </Box>
        <Snackbar
            open={openSnackbar !== undefined}
            autoHideDuration={3000}
            onClose={() => {setOpenSnackbar(undefined)}}
            message={openSnackbar}

        />    
    </Box>
}
