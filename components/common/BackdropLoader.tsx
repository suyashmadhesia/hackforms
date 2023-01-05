import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';




export default function BackdropLoader(props: {open: boolean, onClose: () => void}) {
//   const [open, setOpen] = useState(false);
  const handleClose = () => {
    props.onClose()
  };

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.open}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}