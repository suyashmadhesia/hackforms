import Box from '@mui/material/Box';
import {CreateFormHeader, CreateFormHero, CreateFormQuestionList, CreateFormSettings} from '../../components/form/create';


export default function CreateForm() {
    return (
        <Box component="div" sx={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'white',
            display: 'grid',
            gridTemplateRows: '10% 90%',
            gridTemplateAreas: `
            "header header header header header header"
            "question-list hero hero hero hero settings"
            `
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
                borderRight: '1px solid #E2E3E2'
            }}>
                <CreateFormQuestionList />
            </Box>
            {/* Hero Component */}
            <Box component="div" sx={{
                gridArea: "hero",
                borderTop: '1px solid #E2E3E2',
            }}>
                <CreateFormHero />
            </Box>
            {/* Settings Component */}
            <Box component="div" sx={{
                gridArea: "settings",
                borderTop: '1px solid #E2E3E2',
                borderLeft: '1px solid #E2E3E2'
            }}>
                <CreateFormSettings />
            </Box>


        </Box>
    )
}