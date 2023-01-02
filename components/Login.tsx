import { Dialog } from "@mui/material";


export default function LoginDialog(props: {open: boolean, onClose: () => void}) {
    return <Dialog open={props.open} onClose={props.onClose}></Dialog>
}