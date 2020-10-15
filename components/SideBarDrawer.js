import {useState, useEffect} from 'react'
import { makeStyles, Grid } from '@material-ui/core'
import clsx from "clsx";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Sidebar from './Sidebar'

const drawerWidth = 260;

const useStyles = makeStyles(theme => ({
    floatButton: {
        zIndex: 1000,
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "white",
        position: "absolute",
        right: -12,
        top: "50%",
        bottom: "50%",
        cursor: "pointer",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        backgroundColor: '#1D253E'
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: '#1D253E'
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: 70,
        backgroundColor: '#1D253E'
    },
}))



const SideBarDrawer = () => {
    const classes = useStyles()
    const [hover, setHover] = useState(false)
    const [open, setOpen] = useState(false)

    const handleDrawerOpen = () => {
        setOpen(true);
        //props.openSidebar(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
        //props.openSidebar(false);
    };
    return (
         
        <div
            style={{height: '100%', position:'relative'}}
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            onMouseOver={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {hover && (
                <div className={classes.floatButton} onClick={open ? handleDrawerClose : handleDrawerOpen}>
                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </div>
            )}
            {open && (
                <Sidebar />
            )}
        </div>
        
    )
}

export default SideBarDrawer