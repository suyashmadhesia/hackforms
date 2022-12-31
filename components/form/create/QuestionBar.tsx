import Box from '@mui/material/Box';
import { QuestionTypesData, QuestionTypesEnum } from '../../../common/question';
import Stack from '@mui/material/Stack';
import {MdDone, MdLineStyle, MdInvertColors, 
    MdStars, MdBackup, MdCalendarToday
} from 'react-icons/md'
import { ListItemButton, Typography } from '@mui/material';
import React from 'react';

interface QuestionBarProp  {
    type: QuestionTypesEnum,
    key: number,
    onClick: (type: QuestionTypesEnum, index: number) => void
}


function titleIconWrapper(child: React.ReactNode, color: string) {
    return <Box sx={{
        backgroundColor: color,
        padding: '1ch',
        borderRadius: '0.2rem'
    }}>
        {child}
    </Box>
}

function getTitleIcon(type: QuestionTypesEnum, ) {
    switch(type) {
        case QuestionTypesEnum.MCQ:
            return <MdDone color='black' />;
        case QuestionTypesEnum.Text:
            return <MdLineStyle color='black' />;
        case QuestionTypesEnum.Boolean:
            return <MdInvertColors color='black' />;
        case QuestionTypesEnum.Rating:
            return <MdStars color='black' />;
        case QuestionTypesEnum.File:
            return <MdBackup color='black' />;
        case QuestionTypesEnum.Date:
            return <MdCalendarToday color='black' />;
    }
}

export default function QuestionBar(props: QuestionBarProp) {
    
    const data = QuestionTypesData[props.type];
    
    return <ListItemButton key={props.key} onClick={() => {props.onClick(props.type, props.key)}}>
        <Box sx={{
        width: '100%',
        padding: '0.3rem'
    }}
    >
        <Stack direction='row' spacing={2} alignItems={'center'}>
            {
                titleIconWrapper(
                    getTitleIcon(props.type),
                    data.color
                )
            }
            <Typography>{data.name}</Typography>
        </Stack>
    </Box>
    </ListItemButton>
}