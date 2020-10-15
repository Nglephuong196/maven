import React, { useState, useEffect } from 'react'
import { makeStyles, Button, Grid, Popper } from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import CardHeader from '@material-ui/core/CardHeader';
import AddTier from '../components/AddTier'
import EditTier from '../components/EditTier'
import LoadingOverlay from "react-loading-overlay";
import { useDispatch, useSelector } from "react-redux"
import { getTiers } from '../redux/actions/index'
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from 'next/router'
import Popover from '@material-ui/core/Popover';


const useStyle = makeStyles((theme) => ({
    container: {

    },
    card: {
        minwidth: 150,
        maxWidth: 350,
        minHeight: 220,
        textAlign: "center",
        margin: '0 30px 20px 0',
        backgroundColor: '#171E36',
        color: '#FFFFFF',
        opacity: 0.5
    },
    content: {
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        //justifyContent: 'space-evenly',
    }
}))

const TiersBase = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const classes = useStyle()
    const { tiers, isCreating, isEditing, channel, cancel, tierRequesting } = useSelector((state) => ({
        tiers: state.tierReducer.tierList,
        isCreating: state.tierReducer.isCreatingTier,
        isEditing: state.tierReducer.isEditingTier,
        channel: state.channelReducer.channel,
        cancel: state.tierReducer.cancel,
        tierRequesting: state.tierReducer.tierRequesting
    }))
    const [tier, setTier] = useState()
    const [anchorEl, setAnchorEl] = useState()
    const [level, setLevel] = useState()
    const open = Boolean(anchorEl)
    const [editAnchorEl, setEditAnchorEl] = useState()
    const openEdit = Boolean(editAnchorEl)
    const handleClose = (e) => {
        e.stopPropagation()
        setAnchorEl(null);
        setEditAnchorEl(null)
    }
    const formatNumber = (num) => {
        if (num < 1000) {
            return '$' + num.toString()
        } else {
            if (num % 1000 != 0) {
                return '$' + (parseInt(num / 1000)).toString() + ',' + (num % 1000).toString()
            } else {
                return '$' + (parseInt(num / 1000)).toString() + ',' + '000'
            }

        }
    }
    const [listLeft, setListLeft] = useState([])
    useEffect(() => {
        setAnchorEl(null)
        setEditAnchorEl(null)
        let temp = []
        for (let i = tiers.length; i < 4; i++) {
            temp.push(i)
        }
        setListLeft(temp)
    }, [tiers])

    useEffect(() => {
        if (tierRequesting) {
            setAnchorEl(null)
            setEditAnchorEl(null)
        }
    }, [tierRequesting])

    useEffect(() => {
        setAnchorEl(null)
        setEditAnchorEl(null)
    }, [cancel])

    return (
        <LoadingOverlay active={openEdit || open} styles={{
            overlay: (base) => ({
                ...base,
                width: '100vw',
                height: '100vh',
                position: 'fixed'
            })
        }}>
            <Grid container spacing={2}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <div style={{ textAlign: 'center', fontSize: 22 }}>Set Up Your Subscription Tiers</div>
                    </Grid>
                    <Grid item xs={12}>
                        <p style={{ textAlign: 'center' }}>Start with at least 1 free tier and 1 paid tier. You can have up to 3 paid tiers</p>
                    </Grid>
                    <Grid container spacing={2} justify="space-evenly" style={{ paddingLeft: 20 }}>
                        {tiers?.map(item => {
                            return (
                                <Grid item xs={12} sm={6} lg={3} key={item.id}>
                                    <div style={{
                                        borderRadius: 10, backgroundColor: '#1D253E', minwidth: 150,
                                        maxWidth: 350, minHeight: 220, padding: '0 15px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '15px 0', height: 50 }}>
                                            <div style={{ flex: 1 }}></div>
                                            <div style={{ flex: 3, textAlign: 'center', fontSize: 22, whiteSpace: 'nowrap' }}>{item.name?.length > 15 ? `${item.name.slice(0, 15)}...` : item.name}</div>
                                            <div style={{ flex: 1, textAlign: 'right', color: '#6647FF', cursor: 'pointer' }}
                                                onClick={(e) => {
                                                    setEditAnchorEl(e.currentTarget)
                                                    setTier(item)
                                                }}
                                            >Edit</div>
                                        </div>
                                        <div style={{ height: 80, borderBottom: '1px solid #8F9BB3' }}>

                                            {item.monthlyPrices[0] && item.isFree == 0 && (
                                                <div style={{ display: 'flex' }}>
                                                    <div >{formatNumber(item.monthlyPrices[0].price)}</div>
                                                    <div style={{ marginLeft: 'auto' }}>per month</div>
                                                </div>
                                            )}
                                            {item.yearlyPrices[0] && item.isFree == 0 && (
                                                <div style={{ display: 'flex' }}>
                                                    <div>{formatNumber(item.yearlyPrices[0].price)}</div>
                                                    <div style={{ marginLeft: 'auto' }}>per year</div>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ height: 60, color: '#8F9BB3', padding: '10px 0' }}>
                                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description?.length > 140 ? `${item.description.slice(0, 140)}...` : item.description}</div>
                                        </div>
                                    </div>
                                    <Popover
                                        open={openEdit}
                                        anchorEl={editAnchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        style={{ overflow: 'hidden' }}
                                        onClose={handleClose}
                                    >
                                        <EditTier onClose={handleClose} tier={tier} />
                                    </Popover>
                                </Grid>
                            )
                        })}
                        {listLeft.map((item) => {
                            return (
                                <Grid item xs={12} sm={6} lg={3} key={item}>
                                    <Card className={classes.card} >
                                        <CardHeader
                                            title={`Tier ${item}`}
                                        />
                                        <CardActions style={{ flexDirection: 'column' }}>
                                            <div style={{ textAlign: 'center', cursor: 'pointer' }} 
                                            onClick={e => {setAnchorEl(e.currentTarget)
                                                           setLevel(item)}}>
                                                <div style={{ fontSize: 50 }}>+</div>
                                                <div style={{ color: '#8F9BB3' }}>Add</div>
                                            </div>
                                        </CardActions>
                                        <Popover
                                            open={open}
                                            anchorEl={anchorEl}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                            onClose={handleClose}
                                        >
                                            <AddTier level={level} />
                                        </Popover>
                                    </Card>
                                </Grid>
                                // <Grid item xs={12} sm={6} lg={3} key={item.id}>
                                //     <div style={{
                                //         borderRadius: 10, backgroundColor: '#171E36', minwidth: 150,
                                //         maxWidth: 350, minHeight: 220, padding: '0 15px', opacity: 0.5
                                //     }}>
                                //         <div style={{ display: 'flex', alignItems: 'center', padding: '15px 0', height: 50 }}>
                                //             <div style={{ flex: 1 }}></div>
                                //             <div style={{ flex: 3, textAlign: 'center', fontSize: 22, whiteSpace: 'nowrap' }}>{`Tier ${item}`}</div>
                                //             <div style={{ flex: 1, textAlign: 'right', color: '#FF3DA9', cursor: 'pointer' }}></div>
                                //         </div>
                                //         <div style={{ textAlign: 'center', cursor: 'pointer', height: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} onClick={e => setAnchorEl(e.currentTarget)}>
                                //             <div style={{ fontSize: 50 }}>+</div>
                                //             <div style={{ color: '#8F9BB3' }}>Add</div>
                                //         </div>
                                //     </div>
                                //     <Popover
                                //         open={open}
                                //         anchorEl={anchorEl}
                                //         anchorOrigin={{
                                //             vertical: 'top',
                                //             horizontal: 'center',
                                //         }}
                                //         transformOrigin={{
                                //             vertical: 'top',
                                //             horizontal: 'center',
                                //         }}
                                //         onClose={handleClose}
                                //     >
                                //         <AddTier />
                                //     </Popover>
                                // </Grid>
                            )
                        })}

                    </Grid>
                </Grid>

            </Grid>
        </LoadingOverlay>
    )
}

export default TiersBase

