import React from 'react'
import { makeStyles, Grid } from '@material-ui/core'
import PersonIcon from '../assets/icons/PersonIcon'
import TierIcon from '../assets/icons/TierIcon'
import StyleIcon from '../assets/icons/StyleIcon'
import EmailIcon from '../assets/icons/EmailIcon'
import GroupIcon from '../assets/icons/GroupIcon'
import VideoIcon from '../assets/icons/VideoIcon'
import {useRouter} from 'next/router'



const useStyles = makeStyles(theme => ({
    item: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 20,
        cursor: 'pointer',
        fontSize: 16,
        '&:hover': {
            backgroundColor: '#272E49'
        }
    }
}))

const Sidebar = () => {
    const router =  useRouter()
    const classes = useStyles()
    return (
        <Grid container spacing={2} style={{
             height: '100%',
             minWidth: 150,
            position: 'relative',
            zIndex:999
        }}>
            <Grid item xs={12}>
                <div className={classes.item} onClick={() => router.replace('/video-management')}>
                    <VideoIcon />
                    <p style={{ marginLeft: 10, color: '#FFFFFF' }}>Videos</p>
                </div>
                <div className={classes.item} onClick={() => router.replace('/subscribers')}>
                    <GroupIcon />
                    <p style={{ marginLeft: 10, color: '#FFFFFF' }} >Subscribers</p>
                </div>
                <div className={classes.item} onClick={() => router.replace('/tiers')}>
                    <TierIcon />
                    <p style={{ marginLeft: 10, color: '#FFFFFF' }} >Tier</p>
                </div>
                <div className={classes.item} onClick={() => {router.replace('/send-email') }}>
                    <EmailIcon />
                    <p style={{ marginLeft: 10, color: '#FFFFFF' }} >Emails</p>
                </div>
            </Grid>

        </Grid>
    )
}

export default Sidebar
