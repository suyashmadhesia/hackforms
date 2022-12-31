import { List, ListItem, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { MdAdd } from "react-icons/md";
import IconButton from '@mui/material/IconButton';
import { useDispatch } from 'react-redux';
import { createFormActions } from '../../../store/createFormSlice';
import QuestionSelectDialog from './QuestionSelectDialog';
import { useAppSelector } from '../../../store/hooks';
import { QuestionTypesEnum } from '../../../common/question';
import PageBar from './PageBar';


export default function CreateFormQuestionList() {

    const [isDialogOpen, pages]  = useAppSelector(state => [state.createForm.openQuestionSelectionDialog, 
        state.createForm.pages]);
    const dispatch = useDispatch();

    const onAddQuestionClick = () => {
        openQuestionSelectDialog();
    }

    const openQuestionSelectDialog = () => {
        dispatch(createFormActions.setOpenQuestionSelectDialogState(true));
    }

    const onQuestionTypeSelect = (type: QuestionTypesEnum, index: number) => {
        closeQuestionDialog()
        dispatch(createFormActions.addQuestion({
            question: {
                type: type,
                title: 'Write the question here.',
                description: 'Describe (optional)',
                choices: []
            }
        }))
    }

    const closeQuestionDialog = () => {
        dispatch(createFormActions.setOpenQuestionSelectDialogState(false));
    }

    return <Box sx={{
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        display: 'grid',
        overflow: 'hidden',
        gridTemplateRows: '10vh',
        gridTemplateAreas: '"header" "content"'
    }}>
        <Box sx={{
            width: '100%',
            gridArea: 'header',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            borderBottom: '1px solid #E2E3E2'
        }}>
            <Typography fontWeight='medium' >Content</Typography>
            <IconButton onClick={onAddQuestionClick}>
                <MdAdd />    
            </IconButton>
        </Box>
        <Box sx={{
            width: '100%',
            overflowY: 'scroll'
        }}>
            <List >
                {
                    pages.map((page) => {
                        return <PageBar page={page} key={page.pageId}/>
                    })
                }
            </List>
        </Box>
        <QuestionSelectDialog open={isDialogOpen} 
            onSelect={onQuestionTypeSelect} 
            onClose={closeQuestionDialog} />
    </Box>;
}