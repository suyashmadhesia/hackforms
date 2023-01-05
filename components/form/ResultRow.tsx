import { CompactResponseData, EncryptedFormResponse, FormResponseData } from "../../common/types";
import Tooltip from '@mui/material/Tooltip';
import { TableCell, TableRow, Skeleton, Paper, styled, TableCellProps, Snackbar} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { decryptAES, decryptWithPrivateKey, digestSHA256, importAESKey, loadPublicKeyData } from "../../common/security";
import { colors } from "../../styles/theme";
import React from "react";

// export const StyledTableCell = styled((props: TableCellProps ) => {
//     // return <Tooltip title={props.title} placement="bottom">
//         return <TableCell onClick={props.onClick} size="small" align="left" {...props} />
//     // </Tooltip>
// })({
//         // maxWidth: 'max-content',
//         overflow: 'hidden',
//         // textOverflow: 'ellipsis',
//         // whiteSpace: 'nowrap',
//         borderRight: `1px solid ${colors.tertiary}`
//     }
// )

function getSkeletonCells(num: number) {
    const skeletonCells = [];
    for(let i =0; i < num; i++){
        skeletonCells.push(
            <Paper elevation={0} sx={{
                paddingX: '1ch'
            }}>
                <Skeleton variant="text" />
            </Paper>
        )
    }
    return skeletonCells;

}



export async function decryptResponseData(res: CompactResponseData, pubKey: string, privateKey?: string) {
    const encFormResponse = (await axios.get<EncryptedFormResponse>(res.url)).data;
    if (encFormResponse.header.access === "public"){
        const resData = JSON.parse(encFormResponse.payload.data) as FormResponseData
        return resData;
    }
    // if (encFormResponse.payload.subRecord[pubKey])
    const contentDecryptionKey = await decryptWithPrivateKey(
        privateKey as string,
        encFormResponse.payload.subRecord[pubKey]
    );

    // if (digestSHA256(contentDecryptionKey) !== encFormResponse.proof.keyHash) {
    //     throw new Error('')
    // }

    const decryptedContentString = await decryptAES(
        encFormResponse.payload.data,
        await importAESKey(contentDecryptionKey)
    );
    return JSON.parse(decryptedContentString) as FormResponseData;


}

export default function ResultRow(props: {res?: CompactResponseData, privateKey?: string, numOfCols?: number, row?: string[]}) {
    const [row, setRow] = useState<string[] | null>(null)
    const [snackbarData, setSnackBarData] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        if (row === null) {
            if (props.row !== undefined){
                setRow(props.row);
                return;
            }
            const pubKey = loadPublicKeyData()
            decryptResponseData(
                props.res as CompactResponseData,
                pubKey.pubKey,
                props.privateKey
            )
            .then((resData) => {
                setRow([props.res?.id as string, props.res?.url as string].concat(Object.values(resData.dataFrame)));
            })
            
        }
    }, [])

    const onCellClick = (data: string) => {
        navigator.clipboard.writeText(data);
        setSnackBarData('Copied ' + data)
    }
    return <TableRow>
        {
            (row === null)? getSkeletonCells(props.numOfCols || 0): <>
            {
                row.map((data, index) => {
                    return <Tooltip key={index} title={data} placement="bottom">
                                <TableCell sx={{
                                    // maxWidth: 'max-content',
                                    overflow: 'hidden',
                                    // textOverflow: 'ellipsis',
                                    // whiteSpace: 'nowrap',
                                    borderRight: `1px solid ${colors.tertiary}`
                                    }} onClick={(e) => {onCellClick(data)}} size="small" align="left" >{data}</TableCell>
                            </Tooltip>
                })
            }
            </>
        }
        <Snackbar
            open={snackbarData !== undefined}
            autoHideDuration={3000}
            onClose={() => {setSnackBarData(undefined)}}
            message={snackbarData}

        />
    </TableRow>;
}