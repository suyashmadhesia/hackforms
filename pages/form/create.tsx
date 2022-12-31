import Box from '@mui/material/Box';
import {CreateFormHeader, CreateFormHero, CreateFormQuestionList, CreateFormSettings} from '../../components/form/create';
import { colors } from '../../styles/theme';
import { useDispatch } from 'react-redux';
import { formActions } from '../../store/formSlice';


export default function CreateForm() {

    const dispatch = useDispatch()
    //TODO: Add persistancy
    // const formState = getEditableFormStateFromStorage()
    // if (formState !== null){
    //     dispatch(formActions.setFormInitialState(formState));
    // }
    dispatch(formActions.setEditableState(true));


    return (
        <Box component="div" sx={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'white',
            display: 'grid',
            gridTemplateRows: '10vh 90vh',
            gridTemplateColumns: '17vw 63vw 20vw',
            gridTemplateAreas: `
            "header header  header"
            "question-list hero  settings"
            `,
            
        }}>

            {/* Header Component */}
            <Box component="div" sx={{
                gridArea: "header",
            }}>
                <CreateFormHeader />
            </Box>
            
            {/* question-list Component */}
            <Box component="div" sx={{
                gridArea: "question-list",
                borderTop: '1px solid #E2E3E2',
                borderRight: '1px solid #E2E3E2',
                
            }}>
                <CreateFormQuestionList />
            </Box>
            {/* Hero Component */}
            <Box component="div" sx={{
                gridArea: "hero",
                borderTop: '1px solid #E2E3E2',
                backgroundColor: colors.tertiary
            }}>
                <CreateFormHero />
            </Box>
            {/* Settings Component */}
            <Box component="div" sx={{
                gridArea: "settings",
                width: '20vw',
                borderTop: '1px solid #E2E3E2',
                borderLeft: '1px solid #E2E3E2'
            }}>
                <CreateFormSettings />
            </Box>


        </Box>
    )
}