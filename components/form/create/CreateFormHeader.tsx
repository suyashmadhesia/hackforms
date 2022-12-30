import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button, { ButtonProps } from '@mui/material/Button';
import { grey } from '@mui/material/colors';


import { useAppSelector } from '../../../store/hooks';
import {createFormActions} from '../../../store/createFormSlice';
import { styled } from '@mui/material';


const StyledTabs = styled((props: TabsProps) => (
    <Tabs 
        {...props}
        TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
    />
))({
    '& .MuiTabs-indicator': {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      },
      '& .MuiTabs-indicatorSpan': {
        width: '100%',
        backgroundColor: 'black',
      },
});

const StyledTab = styled((props: TabProps) => (
    <Tab disableRipple {...props} />
  ))(({ theme }) => ({
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&.Mui-selected': {
      color: 'black',
    },
    '&.Mui-focusVisible': {
      backgroundColor: 'rgba(100, 95, 228, 0.32)',
    },
}));

const StyledButton = styled(Button)({})


export default function CreateFormHeader() {

    const [title, tabName] = useAppSelector(state => [state.createForm.title, state.createForm.tabName]);
    const dispatch = useDispatch();

    const onTitleValueInput = (value: string) => {
        dispatch(createFormActions.setTitle(value))
    }

    const onTabChange = (name: string) => {
        dispatch(createFormActions.setTabIndex(name));
    }

    return <Box component="div" sx={{
        display: 'grid',
        height: '100%',
        width: '100%',
        gridTemplateAreas: `"crumbs tabs tabs tabs tabs control"`,
        padding: '0.5rem'
    }}>

        {/* Breadcrumb for title */}
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '0.7rem'
        }}>
            <Breadcrumbs aria-label="breadcrumb">
                <p>Workspace</p>
                <TextField
                    id="create-form-title"
                    variant='standard'
                    value={title}
                    onChange={(event) => {onTitleValueInput(event.target.value)}}
                    InputProps={{
                        disableUnderline: true,
                    }}
                ></TextField>
            </Breadcrumbs>
        </Box>

        {/* Tabs */}
        <StyledTabs value={tabName} onChange={(e, name) => {onTabChange(name)}} 

            aria-label="secondary tabs example"
            centered
        >
            <StyledTab value='create' label="Create" />
            <StyledTab value="share" label="Share" />
            <StyledTab value="result" label="Result" />
        </StyledTabs>

        {/* Control */}
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-evenly'
        }}>
            <StyledButton color='success' variant="contained">Publish</StyledButton>
        </Box>

    </Box>
}