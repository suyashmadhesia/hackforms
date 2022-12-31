import { Box, ButtonGroup, IconButton, ListItem, Stack, Typography} from '@mui/material';
import {MdDelete, MdKeyboardArrowUp, MdKeyboardArrowDown} from 'react-icons/md';
import { useAppSelector } from '../../../store/hooks';
import { formActions, formGetters } from '../../../store/formSlice';
import { useDispatch } from 'react-redux';
import {titleIconWrapper, getTitleIcon} from './QuestionBar'
import { QuestionTypesEnum } from '../../../common/question';
import { Page } from '../../../common/types';
import { colors } from '../../../styles/theme';

interface PageBarProps {
    page: Page
}

export default function PageBar(props: PageBarProps) { 
    const getter = useAppSelector(state => formGetters(state.form));
    const dispatch = useDispatch();
    const page = props.page;

    const moveUp = () => {
        if (page.pageId > 1) {
            dispatch(formActions.swapPages([page.pageId -1, page.pageId]));
        }
    }
    const moveDown = () => {
        if (page.pageId != getter.getPageCount()) {
            dispatch(formActions.swapPages([page.pageId, page.pageId + 1]));
        }
    }

    const remove = () => {
        dispatch(formActions.removePageAtIndex(page.pageId));
    }

    const questionTypeData = getter.getPageQuestionTypeData(page.pageId);

    const bgColor = (getter.getCurrentPageIndex() === page.pageId) ? colors.tertiary: colors.main;
    const buttonGroupColor = (getter.getCurrentPageIndex() !== page.pageId) ? colors.tertiary: colors.main;

    const onClick = () => {
        dispatch(formActions.setCurrentPageIndex(page.pageId));
    }

    return <ListItem onClick={() => {onClick()}} sx={{
        backgroundColor: bgColor
    }}>
            <Stack direction={'row'} spacing={3}>
            {
                titleIconWrapper(
                    <Stack direction={'row'} alignItems='center'>
                        {getTitleIcon(questionTypeData.type as QuestionTypesEnum)}
                        <Box paddingLeft={'2ch'}>
                            <Typography>{page.pageId}</Typography>
                        </Box>
                    </Stack>,
                    questionTypeData.color
                )
            }
            <ButtonGroup size="small" variant='contained' sx={{
                backgroundColor: buttonGroupColor,
                height: 'content'
            }} disableElevation>
                {
                    (page.pageId > 1) ? <IconButton onClick={moveUp}>
                    <MdKeyboardArrowUp color='black' />
                </IconButton>: <></>
                }
                {
                    (page.pageId != getter.getPageCount()) ? <IconButton onClick={moveDown}>
                    <MdKeyboardArrowDown color='black' />
                </IconButton>: <></>
                }
                <IconButton onClick={remove}>
                    <MdDelete color='black' />
                </IconButton>
            </ButtonGroup>

        </Stack>
    </ListItem>
}