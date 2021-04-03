import InputBase from '@material-ui/core/InputBase';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';

const BootstrapInput = withStyles((theme: Theme) =>
  createStyles({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      fontWeight: 500,
      color: theme.palette.type === 'light' ? '#000' : '#fff',
      width: '80px',
      borderRadius: 4,
      position: 'relative',
      fontSize: 16,
      padding: '4px 26px 4px 12px',
      '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  })
)(InputBase);

export default BootstrapInput;
