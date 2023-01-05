
import { List } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import QuestionBar from './QuestionBar';
import { QuestionTypesData, QuestionTypesEnum } from '../../../common/question';

interface QuestionSelectDialogProp {
    open: boolean;
    onClose: () => void;
    onSelect: (type: QuestionTypesEnum, index: number) => void
}

export default function QuestionSelectDialog(props: QuestionSelectDialogProp) {

    const onQuestionSelect = (type: QuestionTypesEnum, index: number) => {
        props.onSelect(type, index)
    }

    const getQuestionBars = () => {
        return Object.keys(QuestionTypesData).map((value, index) => {
            return <QuestionBar type={value as QuestionTypesEnum} index={index} key={index} onClick={onQuestionSelect} />;
        })
    }


    return <Dialog open={props.open} onClose={props.onClose} maxWidth={'lg'} sx={{
        overflowY: 'scroll'
    }} >
        <DialogTitle variant='body1' fontWeight={'medium'} textAlign={'center'}  >Select Question</DialogTitle>
        <DialogContent>
            <List>
                {getQuestionBars()}
            </List>
        </DialogContent>
    </Dialog>
}