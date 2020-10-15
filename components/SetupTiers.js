import React, { useState, useEffect } from 'react'
import { makeStyles, Button, Grid } from '@material-ui/core'
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


const useStyle = makeStyles((theme) => ({
    container: {

    },
    card: {
        minwidth: 150,
        maxWidth: 250,
        textAlign: "center",
        margin: '0 30px 20px 0',
        minHeight: 220,
        backgroundColor: '#1D253E',
        color: '#FFFFFF'
    },
    content: {
        display: 'flex',
        alignItems: 'stretch',
        flexWrap: 'wrap',
        //justifyContent: 'space-evenly',
    }
}))

const SetupTiers = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const classes = useStyle()
    const { tiers, isCreating, isEditing, channel } = useSelector((state) => ({
        tiers: state.tierReducer.tierList,
        isCreating: state.tierReducer.isCreatingTier,
        isEditing: state.tierReducer.isEditingTier,
        channel: state.channelReducer.channel
    }))
    const [tier, setTier] = useState()
    const [showEdit, setShowEdit] = useState(false)
    const [showAdd, setShowAdd] = useState(false)
    const { loading, user } = useAuth0();

    useEffect(() => {
        if (tiers) {
            setShowEdit(false)
            setShowAdd(false)
        }
    }, [tiers])


    return (
        <Grid container spacing={2}>
             {showAdd ? (<AddTier />) : showEdit ? (<EditTier tier={tier} />) : 
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <div style={{textAlign:'center', fontSize: 22}}>Set up tiers</div>
                        </Grid>   
                        <Grid item xs={12}>
                        <p style={{textAlign:'center'}}>Start with at least 1 free tier and 1 paid tier. You can have tp 3 paid tiers</p>
                        </Grid>            
                        <Grid container spacing={2}>
                        {tiers.map(item => {
            
                            return (
                                <Grid item xs={3} key={item.id}>
                                <Card className={classes.card} >
                                    <CardHeader
                                        action={
                                            <p onClick={() => {
                                                setTier(item)
                                                setShowEdit(true)
                                            }} style={{paddingTop: 10}}>Edit</p>
                                        }
                                        title={item.name}
                                        subheader={item.price}
                                    />

                                    <CardActions style={{ flexDirection: 'column' }}>
                                        <div style={{textAlign: 'left'}}>
                                        {item.monthlyPrices[0] && (
                                            <div>$ {item.monthlyPrices[0].price} per month</div>
                                        )}
                                        {item.yearlyPrices[0] && (
                                            <div>$ {item.yearlyPrices[0].price} per year</div>
                                        )}
                                        <p>{item.description}</p>
                                        </div>
                                    </CardActions>
                                </Card>
                                </Grid>
                            )
                        })}
                        
                            {/* <Card className={classes.card}>
                                <CardActionArea onClick={() => setShowAdd(true)}>
                                    <CardContent>
                                        <Icon style={{ fontSize: 100, color: 'blue' }}>add_circle</Icon>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions style={{ justifyContent: 'center' }}>
                                    <h2>Add new tier</h2>
                                </CardActions>
                            </Card> */}
                            <Grid item xs={3} style={{alignSelf: 'center',}}>
                            <div onClick={() => setShowAdd(true)} style={{border: '1px solid #8F9BB3', borderRadius: 10, width: 100, height: 100, position: 'relative',  margin: '0 auto'}}>
                                <p style={{position: 'absolute', top: '3%', left: '40%', fontSize: 30, fontWeight: 'bold'}}>+</p>
                            </div>
                            </Grid>
                    </Grid>
                    </Grid>
            }
            {/* {(showAdd || showEdit) && (
                <Grid item xs={12} >
                    <div style={{display: 'flex', justifyContent:'center'}}>
                    <Button color="primary" variant="contained" style={{ width: '200px' }} onClick={() => {
                        setShowAdd(false)
                        setShowEdit(false)
                    }}>Back</Button>
                    </div>
                </Grid>
            )} */}
        </Grid>
    )
}

export default SetupTiers

