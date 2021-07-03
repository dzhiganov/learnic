import Switch from '@material-ui/core/Switch';
import { withStyles, createStyles } from '@material-ui/core/styles';

const CustomSwitch = withStyles(() =>
  createStyles({
    root: {
      width: 80,
      height: 48,
      padding: 8,
    },
    switchBase: {
      padding: 11,
      color: '#ff6a00',
    },
    thumb: {
      width: 26,
      height: 26,
      backgroundColor: '#fff',
    },
    track: {
      background: '#0A1931',
      opacity: '1 !important',
      borderRadius: 20,
      position: 'relative',
      '&:before, &:after': {
        display: 'inline-block',
        position: 'absolute',
        top: '50%',
        width: '50%',
        transform: 'translateY(-50%)',
        color: '#fff',
        textAlign: 'center',
      },
      '&:before': {
        content: '"☀️"',
        left: 4,
        opacity: 0,
      },
      '&:after': {
        content: '"🌙"',
        right: 4,
      },
    },
    checked: {
      '&$switchBase': {
        color: '#185a9d',
        transform: 'translateX(32px)',
        '&:hover': {
          backgroundColor: 'linear-gradient(to right, #434343, black)',
        },
      },
      '& $thumb': {
        backgroundColor: '#fff',
      },
      '& + $track': {
        background:
          'linear-gradient(to right, hsl(210, 100%, 30%), hsl(210, 100%, 41%));',
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
    },
  })
)(Switch);

export default CustomSwitch;
