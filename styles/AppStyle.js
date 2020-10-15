import {makeStyles} from '@material-ui/core'

const AppStyles = makeStyles(theme => ({
    scrollbar: {
        "&::-webkit-scrollbar": {
            width: 4,
            // height: 8,
            borderRadius: 2,
        },
        "&::-webkit-scrollbar-button": {
            // border: '.5px solid yellow'
        },
        "&::-webkit-scrollbar-track": {
            // '&::-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
            // borderRadius: 10,
            // background: 'red',
        },
        "&::-webkit-scrollbar-track-piece": {
            // background: 'purple',
        },
        "&::-webkit-scrollbar-thumb": {
            background: 'rgba(255, 255, 255, 0.8)',
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.5)',
            borderRadius: 2,
        },
        "&::-webkit-scrollbar-corner": {
    
        },
        "&::-webkit-scrollbar-resizer": {
    
        },
    },
    overflow: {
        overflow: 'auto'
    }
}))

export default AppStyles
