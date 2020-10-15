import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { makeStyles, Button, Popover } from '@material-ui/core'
import { useAuth0 } from "@auth0/auth0-react";
import BellIcon from '../assets/icons/BellIcon'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { handleAbort } from 'video-react/lib/actions/video';
import LogOutIcon from '../assets/icons/LogOutIcon'
import PersonIcon from '../assets/icons/PersonIcon'
import ChannelIcon from '../assets/icons/ChannelIcon'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import AddNewVideo from '../assets/icons/AddNewVideo'
import AddNewVideoIcon from '../assets/icons/AddNewVideoIcon';

const useStyle = makeStyles((theme) => ({
    header: {
        minHeight: '6,4rem',
        borderBottom: '1px solid #E8E8E8',
        backgroundColor: 'white',
        display: ' flex',
        justifyContent: 'space-between'
    },
    logo: {
        fontSize: '3rem',
        padding: "0 2rem"
    },
    circleStyle: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#919191',
        borderRadius: "50%",
        width: 50,
        height: 50,
        textAlign: 'center',
        fontSize: 22,
        marginLeft: 20
    },
    infoProfile: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    itemList: {
        display: 'flex',
        alignItems: 'baseline',
        paddingLeft: 20,
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#272E49'
        }
    }
}))


const Header = () => {
    const router = useRouter()
    const { user } = useSelector(state => ({
        user: state.profileReducer.user
    }))
    const { logout } = useAuth0();
    const classes = useStyle()

    const [anchorEl, setAnchorEl] = useState()
    const open = Boolean(anchorEl);
    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }
    const handleClose = (e) => {
        e.stopPropagation()
        setAnchorEl(null);
    }
    return (
        <Grid container spacing={2} style={{ overflow: 'hidden', height: '100%' }}>
            
            <Grid item xs={1} style={{ alignSelf: 'center' }}>
                <p style={{
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: 22,
                    color: '#FFFFFF',
                    margin: 10,
                    cursor: 'pointer'
                }} onClick={e => router.replace('/') }>Maven</p>
            </Grid>
            <Grid item xs={9}>

            </Grid>
            <Grid item xs={2} style={{ alignSelf: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: 40 }}>
                    <div onClick={e => router.replace('upload-video')}><AddNewVideo /></div>
                    <div style={{paddingLeft: 20}}><BellIcon /></div>

                    <div style={{ display: 'flex', alignItems: 'center' }} onClick={handleClick}>
                        <div className={classes.circleStyle} >
                            {user?.urlImage ? (
                                <img style={{
                                    borderRadius: "50%",
                                    width: 50,
                                    height: 50,
                                }} src={user.urlImage} />
                            ) : (
                                    <p>P</p>
                                )}

                        </div>
                        < ArrowDropDownIcon />
                        <Popover
                            open={open}
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    marginTop: 20
                                }
                            }}
                        >
                            <div style={{ width: 250, backgroundColor: "#1D253E", color: '#FFFFFF' }}>
                                <Link href='/profile'>
                                    <div className={classes.itemList}>
                                        <div><PersonIcon /></div>
                                        <p>Profile</p>
                                    </div>
                                </Link>
                                <Link href="edit-channel">
                                    <div className={classes.itemList}>
                                        <div><ChannelIcon /></div>
                                        <p>Channel’s detail</p>
                                    </div>
                                </Link>
                                <div className={classes.itemList} onClick={() => logout({ returnTo: window.location.origin })}>
                                    <div><LogOutIcon />
                                    </div>
                                    <p>Log out</p>
                                </div>

                            </div>

                        </Popover>
                    </div>
                    {/* <div style={{display:'flex',flexDirection:'column',marginLeft:10}}>
                    <div style={{color:'#222B45',fontWeight:500,fontSize:16}}>Phuong</div>
                    <div style={{color:'#222B45',fontSize:14}}>nglephuong196@gmail.com</div>
                </div>
                <button className={classes.logOutButton} onClick={() => logout({returnTo: window.location.origin})}>Log out</button> */}
                </div>
            </Grid>
        </Grid>
    )
}

export default Header