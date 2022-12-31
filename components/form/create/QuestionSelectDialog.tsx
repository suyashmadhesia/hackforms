
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


export default function QuestionSelectDialog(props: {open: boolean, onClose: () => void}) {


    return <Dialog open={props.open} onClose={props.onClose} maxWidth={'lg'} sx={{
        overflowY: 'scroll'
    }} >
        <DialogTitle variant='h6' >Select Question</DialogTitle>
        <DialogContent></DialogContent>
    </Dialog>
}