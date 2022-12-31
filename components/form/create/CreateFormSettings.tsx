import { Box } from "@mui/material";
import { StyledTab, StyledTabs } from "./CreateFormHeader";
import { useState } from "react";
import {MdSettings} from 'react-icons/md';

export default function CreateFormSettings() {

    const [tabIndex, setTabIndex] = useState(0);

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
            height: '100%'
        }}>
            <StyledTabs value={tabIndex}
                onChange={(e,index) => {setTabIndex(index)}}
            >
                <StyledTab label='Properties' />
                <StyledTab label='Design' />
                <StyledTab icon={<MdSettings />} aria-label="setting" />
            </StyledTabs>
        </Box>
        {/*  */}
        <Box></Box>
    </Box>
}