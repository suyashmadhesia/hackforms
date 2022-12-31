import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import Tab, { TabProps } from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';



import { useAppSelector } from '../../../store/hooks';
import {createFormActions} from '../../../store/createFormSlice';
import {  styled } from '@mui/material';
import {colors} from '../../../styles/theme';
import AccessSelector from '../AccessSelector';

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




export default function CreateFormHeader() {

    const [title, tabName, access] = useAppSelector(state => [state.createForm.title, 
        state.createForm.tabName,
        state.createForm.access
    ]);

    const dispatch = useDispatch();

    const onTitleValueInput = (value: string) => {
        dispatch(createFormActions.setTitle(value))
    }

    const onTabChange = (name: string) => {
        dispatch(createFormActions.setTabIndex(name));
    }

    const onAccessChange = (val: string) => {

    }

    const onPublishClick = () => {}

    return <Box component="div" sx={{
        display: 'grid',
        height: '100%',
        width: '100%',
        gridTemplateAreas: `"crumbs tabs tabs tabs tabs control"`,
        padding: '0.4rem',
        maxWidth: '100%'
    }}>

        {/* Breadcrumb for title */}
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '0.7rem',
            // gridArea: 'crumbs',
            maxWidth: '100%',
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
        <Box sx={{
            gridArea: "tabs"
        }}>
            <StyledTabs value={tabName} onChange={(e, name) => {onTabChange(name)}} 

                aria-label="secondary tabs example"
                centered
            >
                <StyledTab value='create' label="Create" />
                <StyledTab value="share" label="Share" />
                <StyledTab value="result" label="Result" />
                </StyledTabs>
        </Box>

        {/* Control */}
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            gridArea: "control",
            paddingRight: "4ch"
        }}>
            {/* <AccessSelector access={access} onChange={onAccessChange} /> */}

            <Button variant='contained' disableElevation
                style={{
                    backgroundColor: colors.primary,
                    marginBottom: '1ch'
                }}
                onClick={onPublishClick}

            >Publish</Button>
        </Box>

    </Box>
}