import React, { useState } from 'react'
import { makeStyles, TextField, TextareaAutosize, Button, Switch, Grid, FormControl, InputAdornment, Tooltip } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import { editFreeTier, editTier, getTiers, cancelAddOrEditTier } from '../redux/actions/index'
import NumberFormat from 'react-number-format'
import InfomationIcon from '../assets/icons/InfomationIcon'
import WarningUploadIcon from '../assets/icons/WarningUploadIcon'
import LoadingOverlay from "react-loading-overlay";

const useStyle = makeStyles((theme) => ({
    container: {

    },
    tier: {
        display: 'flex',
        paddingBottom: '20px',
        alignItems: 'baseline'
    },
    textArea: {
        display: 'flex',
    },
    customWidth: {
        maxWidth: 100,
    },
    test: {
        '&:hover': {
            textDecoration: 'underline',
            cursor: 'pointer',
            display: 'inline-block'
        }
    },
    hide: {
        display: 'none'
    }
}))
const EditTier = (props) => {
    const { editTierRequesting, stripeConnectedAccountId } = useSelector(state => ({
        editTierRequesting: state.tierReducer.editTierRequesting,
        stripeConnectedAccountId: state.appReducer.stripeConnectedAccountId
    }))
    const [tier, setTier] = useState({
        id: props.tier.id,
        name: props.tier.name,
        tierYearlyEnabled: true,
        tierMonthlyEnabled: true,
        tierYearlyPrice: props.tier.yearlyPrices[0]?.price || 0,
        tierMonthlyPrice: props.tier.monthlyPrices[0]?.price || 0,
        description: props.tier.description || '',
        status: props?.tier?.status
    })
    const [showSmallerMonthlyPriceError, setShowSmallerMonthlyPriceError] = useState(false)
    const [showSmallerYearlyPriceError, setShowSmallerYearlyPriceError] = useState(false)
    const [showInvalidMonthlyValue, setShowInvalidMonthlyValue] = useState(false)
    const [showInvalidYearlyValue, setShowInvalidYearlyValue] = useState(false)
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
    const [displayMonthlyValue, setDisplayMonthlyValue] = useState(formatNumber(props.tier.monthlyPrices[0]?.price))
    const [displayYearlyValue, setDisplayYearlyValue] = useState(formatNumber(props.tier.yearlyPrices[0]?.price))
    const classes = useStyle()
    const dispatch = useDispatch()
    const handleUpdateTier = () => {
        if (props.tier.isFree == 0) {
            dispatch(editTier({ tier: tier }))
        } else {
            dispatch(editFreeTier({ freeTier: tier }))
        }
    }

    React.useEffect(() => {
    }, [tier])
    return (
        <LoadingOverlay active={editTierRequesting} styles={{
            overlay: (base) => ({
                ...base,
                width: 400,
                height: 600,
                overflow: 'hidden'
            })
        }} spinner text='Saving Tier'>
            <Grid container spacing={2} style={{ padding: '0px 0px 10px 40px', width: 400, height: 600, overflow: 'hidden auto', backgroundColor: '#1D253E', color: 'white' }}>
                <Grid item xs={12}>
                    <h1>Edit Tier</h1>
                </Grid>
                <Grid item xs={12} style={{ alignSelf: 'center' }}>
                    <label htmlFor="tier-name" className={classes.label}>
                        Tier Name <span style={{ color: 'red' }}>*</span>
                    </label>
                </Grid>
                <Grid item xs={12} >
                    <TextField id="tier-name" variant="outlined" style={{ width: '80%' }} onChange={(e) => setTier({ ...tier, name: e.target.value })} value={tier.name}
                        inputProps={{ maxLength: 70 }}></TextField>
                    <div className={tier.name != "" && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>This field is required</div>
                </Grid>
                <Grid item xs={12} style={{ alignSelf: 'center' }}>
                    <label htmlFor="description" className={classes.label}>
                        Description <span style={{ color: 'red' }}>*</span>
                    </label>
                </Grid>
                <Grid item xs={12}>
                    <TextareaAutosize id="description" variant="outlined" style={{ maxWidth: '100%' }} rowsMin={3}
                        onChange={(e) => setTier({ ...tier, description: e.target.value })} value={tier.description}
                        maxLength="280" ></TextareaAutosize>
                    <div className={tier.description != "" && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>This field is required</div>
                </Grid>
                {props.tier.isFree == 0 && (
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            Tier Billing Period(s) <span style={{ color: 'red' }}>*</span><span style={{ color: '#8F9BB3', fontSize: 10 }}>(Allow to increase the price only)</span>
                        </Grid>
                        {/* {tier.tierMonthlyEnabled && (
                <Grid container>
                    <Grid item xs={5}>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            type='number'
                            value={tier.tierMonthlyPrice}
                            onChange={e => setTier({ ...tier, tierMonthlyPrice: e.target.value })}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            endAdornment={<div>USD</div>}
                            inputProps={{
                                style: {
                                    textAlign: 'right',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={5} style={{ alignSelf: 'center' }}>
                        <div style={{ textAlign: 'center' }}>Monthly</div>
                    </Grid>
                    <Grid item xs={2} style={{ alignSelf: 'center' }}>
                        <Tooltip arrow title="Maximum price of monthly is 20,000$, minimum price of monthly is 5$" placement="right"
                            classes={{ tooltip: classes.customWidth }}>
                            <Button><InfomationIcon /></Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            )} */}
                        {/* {tier.tierYearlyEnabled && (
                <Grid container>
                    <Grid item xs={5}>
                        <OutlinedInput
                            id="outlined-adornment-amount"
                            type='number'
                            value={tier.tierYearlyPrice}
                            onChange={e => setTier({ ...tier, tierYearlyPrice: e.target.value })}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            endAdornment={<div>USD</div>}
                            inputProps={{
                                style: {
                                    textAlign: 'right',
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={5} style={{ alignSelf: 'center' }}>
                        <div style={{ textAlign: 'center' }}>Yearly</div>
                    </Grid>
                    <Grid item xs={2} style={{ alignSelf: 'center' }}>
                        <Tooltip arrow title="Maximum price of monthly is 20,000$, minimum price of monthly is 5$" placement="right"
                            classes={{ tooltip: classes.customWidth }}>
                            <Button><InfomationIcon /></Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            )} */}
                        <Grid container spacing={2} style={{ paddingLeft: 8 }}>
                            <Grid item xs={6}>
                                <FormControl fullWidth className={classes.margin} variant="outlined">
                                    <NumberFormat value={displayMonthlyValue} thousandSeparator={true} prefix={'$'} style={{ borderRadius: 10, padding: 20, backgroundColor: '#272E49', color: 'white' }}
                                        onValueChange={(values) => {
                                            const { formattedValue, value } = values;
                                            setTier({ ...tier, tierMonthlyPrice: value })
                                            setShowSmallerMonthlyPriceError(value < props.tier.monthlyPrices[0]?.price)
                                            setDisplayMonthlyValue(formattedValue)
                                            if (value < 5 || value > 2000) {
                                                setShowInvalidMonthlyValue(true)
                                            } else {
                                                setShowInvalidMonthlyValue(false)
                                            }
                                        }} decimalSeparator={null}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                    <div>Monthly</div>
                                    <Tooltip arrow title="Minimum is $5 or Maximum is $2,000" placement="right"
                                        classes={{ tooltip: classes.customWidth }}>
                                        <Button><InfomationIcon /></Button>
                                    </Tooltip>
                                </div>
                            </Grid>
                        </Grid>
                        {showInvalidMonthlyValue && (
                            <Grid item xs={12} style={{padding: '20px 0'}}>
                                <div style={{ display: 'flex', border: '1px solid #C12E3E', padding: 20, borderRadius: 10 }}>
                                    <div style={{ paddingRight: 10 }}><WarningUploadIcon /></div>
                                    <div>Please enter a valid monthly price, from $5 to $2,000</div>
                                </div>
                            </Grid>
                        )}

                        {showSmallerMonthlyPriceError && (
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', border: '1px solid #C12E3E', padding: 20, borderRadius: 10 }}>
                                    <div style={{ paddingRight: 10 }}><WarningUploadIcon /></div>
                                    <div>New monthly price must be greater than old monthly price</div>
                                </div>
                            </Grid>
                        )}
                        <Grid container spacing={2} style={{ paddingTop: 10, paddingLeft: 8 }}>
                            <Grid item xs={6}>
                                <FormControl fullWidth className={classes.margin} variant="outlined">
                                    <NumberFormat value={displayYearlyValue} thousandSeparator={true} prefix={'$'} style={{ borderRadius: 10, padding: 20, backgroundColor: '#272E49', color: 'white' }}
                                        onValueChange={(values) => {
                                            const { formattedValue, value } = values;
                                            setTier({ ...tier, tierYearlyPrice: value })
                                            setDisplayYearlyValue(formattedValue)
                                            setShowSmallerYearlyPriceError(value < props.tier.yearlyPrices[0]?.price)
                                            if (value < 60 || value > 24000) {
                                                setShowInvalidYearlyValue(true)
                                            } else {
                                                setShowInvalidYearlyValue(false)
                                            }
                                        }} decimalSeparator={null} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>

                                    <div>Yearly</div>
                                    <Tooltip arrow title="Minimum is $60 or Maximum is $24,000" placement="right"
                                        classes={{ tooltip: classes.customWidth }}>
                                        <Button><InfomationIcon /></Button>
                                    </Tooltip>
                                </div>
                            </Grid>
                        </Grid>
                        {showInvalidYearlyValue && (
                            <Grid item xs={12} style={{padding: '20px 0'}}>
                                <div style={{ display: 'flex', border: '1px solid #C12E3E', padding: 20, borderRadius: 10 }}>
                                    <div style={{ paddingRight: 10 }}><WarningUploadIcon /></div>
                                    <div>Please enter a valid yearly price, from $60 to $24,000</div>
                                </div>
                            </Grid>
                        )}
                        {showSmallerYearlyPriceError && (
                            <Grid item xs={12} >
                                <div style={{ display: 'flex', border: '1px solid #C12E3E', padding: 20, borderRadius: 10 }}>
                                    <div style={{ paddingRight: 10 }}><WarningUploadIcon /></div>
                                    <div>New yearly price must be greater than old yearly price</div>
                                </div>
                            </Grid>
                        )}
                    </Grid>
                )}

                {props.tier.isFree == 0 && (
                    <Grid item xs={12}>
                        <Switch color="primary" disabled={!stripeConnectedAccountId} checked={Boolean(tier.status)} onChange={e => setTier({ ...tier, status: !tier.status })}></Switch> <span style={{ color: '#8F9BB3', fontSize: 10 }}>(Turn the toggle on to allow users to subscribe to this tier)</span>
                    </Grid>
                )}

                <Grid item xs={2}>
                </Grid>
                <Grid item xs={10} style={{}}>
                    <Button variant="contained" style={{
                        width: '109px', height: '40px', marginTop: 10,
                        fontStyle: "normal",
                        backgroundColor: '',
                        fontSize: 14,
                        marginRight: 30
                    }} onClick={(e) => props.onClose(e)}>Discard</Button>
                    <Button color="primary" variant="contained" style={{
                        width: '109px', height: '40px', marginTop: 10,
                        backgroundColor: '#4D2CEC',
                        fontStyle: "normal",
                        fontSize: 14,
                    }} disabled={showInvalidMonthlyValue || showInvalidYearlyValue || !tier.name.trim() || !tier.description.trim() || showSmallerYearlyPriceError || showSmallerMonthlyPriceError} onClick={handleUpdateTier}>SAVE</Button>

                </Grid>

                {/* <Grid item xs={12}>
            <div style={{display: 'flex', justifyContent:'center'}}>
                <Button color="primary" variant="contained" style={{ width: '200px' }} onClick={handleUpdateTier}>Save</Button>
            </div>
            </Grid> */}
            </Grid>
        </LoadingOverlay>

    )
}

export default EditTier
