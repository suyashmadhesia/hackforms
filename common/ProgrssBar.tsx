import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";


export default function Loader() {
    return <Box margin={'8ch'} alignContent={'center'} width={'100%'} height={'100%'}>
        <CircularProgress color="secondary" />
    </Box>
}