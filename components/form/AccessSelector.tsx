
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';


export default function AccessSelector(props: {access: string, onChange: (val: string) => void}) {

    return (
        <FormControl sx={{
            width: "15ch"
          }} size="small">
               <InputLabel id="demo-simple-select-label">Access</InputLabel>
               <Select
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   value={props.access}
                   label="Access"
                   onChange={(e) => {props.onChange(e.target.value)}}
               >
                   <MenuItem value={'public'}>Public</MenuItem>
                   <MenuItem value={'private'}>Private</MenuItem>
                   <MenuItem value={'protected'}>Protected</MenuItem>
                </Select>
           </FormControl>
    );
}