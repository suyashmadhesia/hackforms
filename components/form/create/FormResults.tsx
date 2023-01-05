import { Box, Card, Table, TableBody, TableContainer, TableHead } from "@mui/material";
import { CompactResponseData, EncryptedForm, ResponseData, SerializedFormAnalytics } from "../../../common/types";
import { colors } from "../../../styles/theme";
import { useEffect, useState } from "react";
import BackdropLoader from "../../common/BackdropLoader";
import PasswordInputDialog from "../../common/PasswordInputDialog";
import { apiServer } from "../../../common/axios";
import { decryptAES, generateAESKeyFromSeed, loadPrivateKeys, loadPublicKeyData } from "../../../common/security";

import Paper from '@mui/material/Paper';
import ResultRow, { decryptResponseData } from "../ResultRow";


export default function FormResults(props: {form: EncryptedForm}){

    const [openPassDia, setOpenPassDia] = useState(false);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [privateKey, setPrivateKey] = useState<string | null>(null);
    const [errorTitle, setErrorTitle] = useState<string | undefined>();
    const [cols, setCols] = useState<string[]>([]);
    const [rows, setRows] = useState<CompactResponseData[]>([]);
    const [firstRow, setFirstRow] = useState<string[]>([]);
    const [numOfRes, setNumOfRes] = useState(0);


    const fetchResponsesAndTheirContents = async (secret?: string) => {
        setOpenBackdrop(true);
        const res = await apiServer.get<ResponseData<SerializedFormAnalytics>>(`/form/analytics/${props.form.payload.meta.formId}`);
        if (res.data.err){
            setOpenBackdrop(false);
            return;
        }
        const analytics = res.data.data as SerializedFormAnalytics;
        setNumOfRes(analytics.responses.length);
        let privateKey: string | null = null;
        const pubKey = loadPublicKeyData();
        if (props.form.header.access !== "public" ) {      
            const encryptedPrivateKey = loadPrivateKeys();
            const generatedAesKey = await generateAESKeyFromSeed(secret as string);
            privateKey = await decryptAES(encryptedPrivateKey, generatedAesKey);
            setPrivateKey(privateKey);
        }
        if (analytics.responses.length > 0){
            const firstResponse = analytics.responses[0]; 
            const firstResponseData = await decryptResponseData(
                firstResponse,
                pubKey.pubKey,
                privateKey || undefined
            )
            
            const cols: string[] = ['responseId', 'IPFS URL']
            const rowData: string[] = [firstResponse.id, firstResponse.url];
            Object.entries(firstResponseData.dataFrame).map(([title, value]) => {
                cols.push(title);
                rowData.push(value);
            });
            setCols(cols);
            setFirstRow(rowData);
            setRows(analytics.responses.slice(1));
        }
        setOpenBackdrop(false);
    }

    const onSecret = async (secret: string) => {
        setOpenPassDia(false);
        try {
            await fetchResponsesAndTheirContents(secret);
        }catch(e) {
            console.log(e);
            setErrorTitle('Password is not matching')
            setOpenPassDia(true);
        }
    }

    useEffect(() => {
        if (numOfRes === 0) {
            if(props.form.header.access !== "public") {
                setOpenPassDia(true);
            }else{
           
                fetchResponsesAndTheirContents().then()
            
            }
        }
    }, []);

    return <Box sx={{
        width: '100vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: colors.tertiary,
        paddingTop: '10ch',
    }}>
        <BackdropLoader open={openBackdrop} onClose={() =>{}} />
        <PasswordInputDialog open={openPassDia} onClose={() =>{}}
            onSecretInput={onSecret}
            errorText={errorTitle}
        />

        <Box sx={{
            height: '90vh',
            width: '90vw'
        }}>
        {
            (cols.length === 0)? <Card sx={{
                width: '100%',
                height: '6ch',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>No form response</Card>:
            <TableContainer component={Paper} sx={{
                // marginX: ''
            }} >
                <Table sx={{maxWidth: '90vw'}} aria-label='result table'>
                    <TableHead>
                        <ResultRow row={cols} />
                    </TableHead>
                    <TableBody>
                       <ResultRow row={firstRow} />
                       {
                        rows.map((row) => {
                            return <ResultRow key={row.id} res={row} privateKey={privateKey as string}  />
                        })
                       }
                    </TableBody>
                </Table>
            </TableContainer>
        }
        </Box>
    </Box>
}