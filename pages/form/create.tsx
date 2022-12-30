import Box from '@mui/material/Box';
import {CreateFormHeader, CreateFormHero, CreateFormQuestionList, CreateFormSettings} from '../../components/form/create';

export default function CreateForm() {
    return (
        <Box component="div" sx={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            backgroundColor: 'rgb(229 231 235)',
            display: 'grid',
            gridTemplateRows: '8% 92%',
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
            }}>
                <CreateFormQuestionList />
            </Box>
            {/* Hero Component */}
            <Box component="div" sx={{
                gridArea: "hero"
            }}>
                <CreateFormHero />
            </Box>
            {/* Settings Component */}
            <Box component="div" sx={{
                gridArea: "settings",
            }}>
                <CreateFormSettings />
            </Box>


        </Box>
    )
}