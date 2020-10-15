import React, { useState, useEffect } from 'react'
import { makeStyles, TextField, TextareaAutosize, Button, Switch, Grid, FormControl, InputLabel, OutlinedInput, InputAdornment, Select, Tooltip } from '@material-ui/core'
import { useDispatch, useSelector } from "react-redux"
import { addTier, getTiers, cancelAddOrEditTier } from '../redux/actions/index'
import InfomationIcon from '../assets/icons/InfomationIcon'
import GarbageIcon from '../assets/icons/GarbageIcon'
import NumberFormat from 'react-number-format'
import WarningUploadIcon from '../assets/icons/WarningUploadIcon'
import LoadingOverlay from "react-loading-overlay";



const useStyle = makeStyles((theme) => ({
  container: {

  },
  customWidth: {
    maxWidth: 150,
    backgroundColor: 'black',
    fontSize: 14
  },
  hide: {
    display: 'none'
  }
}))

const AddTier = (props) => {
  //const history = useHistory()
  const dispatch = useDispatch()
  const { token, createTierRequesting, stripeConnectedAccountId } = useSelector(state => ({
    token: state.appReducer.token,
    createTierRequesting: state.tierReducer.createTierRequesting,
    stripeConnectedAccountId: state.appReducer.stripeConnectedAccountId
  }))
  const classes = useStyle()
  const [tier, setTier] = useState({
    name: '',
    tierYearlyEnabled: true,
    tierMonthlyEnabled: true,
    tierYearlyPrice: 0,
    tierMonthlyPrice: 0,
    description: '',
    status: false
  })
  const [displayMonthlyValue, setDisplayMonthlyValue] = useState()
  const [displayYearlyValue, setDisplayYearlyValue] = useState()
  const [showInvalidMonthlyValue, setShowInvalidMonthlyValue] = useState(false)
  const [showInvalidYearlyValue, setShowInvalidYearlyValue] = useState(false)
  const [choiceLeft, setChoiceLeft] = useState('Yearly')
  const [anotherPrice, setAnotherPrice] = useState(false)
  const [value1, setValue1] = useState('Monthly')
  const [value2, setValue2] = useState('Yearly')
  const onSave = () => {
      dispatch(addTier({ tier: tier, level: props.level }))
  }

  const handleChange = (e) => {
    if (e.target.value === "Monthly") {
      setTier({ ...tier, tierMonthlyEnabled: true, tierYearlyEnabled: false })
      setChoiceLeft('Yearly')

    } else {
      setTier({ ...tier, tierMonthlyEnabled: false, tierYearlyEnabled: true })
      setChoiceLeft('Monthly')

    }
    setValue1(e.target.value)
  }

  const handleAnotherPrice = () => {
    setAnotherPrice(true)
    setTier({ ...tier, tierMonthlyEnabled: true, tierYearlyEnabled: true })
  }

  return (
    <LoadingOverlay active={createTierRequesting} styles={{
      overlay: (base) => ({
        ...base,
       width: 400,
       height: 600,
       overflow: 'hidden'
      })
    }} spinner text='Creating Tier'>
    <Grid container spacing={2} style={{ padding: '0px 0px 20px 40px', width: 400, height: 600, overflow: 'hidden auto', backgroundColor: '#1D253E', color: 'white' }}>
      <Grid item xs={12}>
        <p style={{ fontSize: 22, fontWeight: 600 }}>Create Tiers</p>
      </Grid>
      <Grid item xs={12} style={{ alignSelf: 'center' }}>
        <label htmlFor="tier-name" className={classes.label}>
          Name <span style={{ color: 'red' }}>*</span>
        </label>
      </Grid>
      <Grid item xs={12} >
        <TextField id="tier-name" variant="outlined" onChange={(e) => setTier({ ...tier, name: e.target.value })} value={tier.name}
          inputProps={{ maxLength: 70 }} required ></TextField>
        <div className={tier.name != "" && classes.hide || ""} style={{ color: 'red', fontStyle: 'italic' }}>This field is required</div>
      </Grid>
      <Grid item xs={12} style={{ alignSelf: 'center' }}>
        <label htmlFor="description" className={classes.label}>
          Description <span style={{ color: 'red' }}>*</span>
        </label>
      </Grid>
      <Grid item xs={12}>
        <TextareaAutosize id="description" variant="outlined" rowsMin={3} style={{maxWidth: '100%'}}
          onChange={(e) => setTier({ ...tier, description: e.target.value })} value={tier.description}
          maxLength="280" ></TextareaAutosize>
        <div className={tier.description != "" && classes.hide || ""} style={{ color: 'red', fontStyle: 'italic' }}>This field is required</div>
      </Grid>
      <Grid item xs={12} style={{ alignSelf: 'center' }}>
        <label htmlFor="tier-monthly-price">
          Tier Billing Period(s)
                </label>
      </Grid>
      <Grid container spacing={2} style={{ paddingLeft: 8 }}>
        <Grid item xs={6}>
          <FormControl fullWidth className={classes.margin} variant="outlined">

            {/* {choiceLeft === 'Yearly' && (
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
          )}
          {choiceLeft === 'Monthly' && (
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
          )} */}
            {/* <OutlinedInput
              id="outlined-adornment-amount"
              type='number'
              value={tier.tierMonthlyPrice}
              onChange={e => setTier({ ...tier, tierMonthlyPrice: e.target.value })}
              startAdornment={<InputAdornment position="start" style={{color: 'white'}}>$</InputAdornment>}
              
              inputProps={{
                style: {
                  textAlign: 'right',
                }
              }}
            /> */}
            <NumberFormat thousandSeparator={true} prefix={'$'} style={{ borderRadius: 10, padding: 20, backgroundColor: '#272E49', color: 'white' }}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setTier({ ...tier, tierMonthlyPrice: value })
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
            {/* <Select
            native
            value={value1}
            //defaultValue='Monthly'
            variant="outlined"
            onChange={(e) => handleChange(e)}
            style={{ marginRight: 10 }}
            SelectDisplayProps={{
              style: {
                  backgroundColor: 'black'
              }
          }}
          >
            <option value={'Monthly'}>Monthly</option>
            <option value={'Yearly'}>Yearly</option>
          </Select> */}
            <div>Monthly</div>
            <Tooltip arrow title="Minimum is $5 or Maximum is $2,000" placement="right"
              classes={{ tooltip: classes.customWidth }}>
              {/* <InfomationIcon /> */}
              <Button><InfomationIcon /></Button>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
      {showInvalidMonthlyValue && (
        <Grid item xs={12}>
          <div style={{ display: 'flex', border: '1px solid #C12E3E', padding: 20, borderRadius: 10 }}>
            <div style={{ paddingRight: 10 }}><WarningUploadIcon /></div>
            <div>Please enter a valid monthly price, from $5 to $2,000</div>
          </div>
        </Grid>
      )}
      <Grid container spacing={2} style={{ paddingTop: 10, paddingLeft: 8 }}>
        <Grid item xs={6}>
          <FormControl fullWidth className={classes.margin} variant="outlined">
            {/* <OutlinedInput
              id="outlined-adornment-amount"
              type='number'
              value={tier.tierYearlyPrice}
              onChange={e => setTier({ ...tier, tierYearlyPrice: e.target.value })}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              
              inputProps={{
                style: {
                  textAlign: 'right',
                }
              }}
            /> */}
            <NumberFormat thousandSeparator={true} prefix={'$'} style={{ borderRadius: 10, padding: 20, backgroundColor: '#272E49', color: 'white' }}
              onValueChange={(values) => {
                const { formattedValue, value } = values;
                setTier({ ...tier, tierYearlyPrice: value })
                setDisplayYearlyValue(formattedValue)
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
              {/* <InfomationIcon /> */}
              <Button><InfomationIcon /></Button>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
      {showInvalidYearlyValue && (
        <Grid item xs={12}>
          <div style={{ display: 'flex', border: '1px solid #C12E3E', padding: 20, borderRadius: 10 }}>
            <div style={{ paddingRight: 10 }}><WarningUploadIcon /></div>
            <div>Please enter a valid yearly price, from $60 to $24,000</div>
          </div>
        </Grid>
      )}
      {/* {!anotherPrice && (
        <Grid item xs={12}>
          <p style={{ color: '#8F9BB3', cursor: 'pointer' }} onClick={handleAnotherPrice}>+ Add another price</p>
        </Grid>
      )} */}
      {/* {anotherPrice && (
        <Grid container spacing={2}>

          <Grid item xs={4}>

            <FormControl fullWidth className={classes.margin} variant="outlined">

              <OutlinedInput
                id="outlined-adornment-amount"
                type='number'
                value={choiceLeft === "Monthly" ? tier.tierMonthlyPrice : tier.tierYearlyPrice}
                onChange={e => {
                  choiceLeft === "Monthly" ? setTier({ ...tier, tierMonthlyPrice: e.target.value }) : setTier({ ...tier, tierYearlyPrice: e.target.value })
                }}
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                endAdornment={<div>USD</div>}
                inputProps={{
                  style: {
                    textAlign: 'right',
                  }
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>

            <Select
              native
              defaultValue={choiceLeft}
              variant="outlined"
              style={{ marginRight: 10 }}
              onChange={e => { }}
            >

              <option value={choiceLeft}>{choiceLeft}</option>
            </Select>
            <Tooltip arrow title="Maximum price of monthly is 20,000$, minimum price of monthly is 5$" placement="right"
              classes={{ tooltip: classes.customWidth }}>
              <Button><InfomationIcon /></Button>
            </Tooltip>
          </Grid>

          <Grid item xs={2} style={{ alignSelf: 'center' }}>
            {anotherPrice && (
              <div onClick={e => {
                setAnotherPrice(false)
                choiceLeft == "Monthly" ? setTier({ ...tier, tierMonthlyEnabled: false, tierMonthlyPrice: 0 })
                  : setTier({ ...tier, tierYearlyEnabled: false, tierYearlyPrice: 0 })
              }}>
                <GarbageIcon />
              </div>
            )}
            
          </Grid>
        </Grid>
      )} */}


      
      
      <Grid item xs={12}>
        <Switch color="primary" disabled={!stripeConnectedAccountId} checked={Boolean(tier.status)} onChange={e => setTier({ ...tier, status: !tier.status })}></Switch> <span style={{ color: '#8F9BB3', fontSize: 10 }}>(Turn the toggle on to allow users to subscribe to this tier)</span>
      </Grid>
      <Grid item xs={2}>

      </Grid>
      <Grid item xs={10} >

        <Button variant="contained" style={{
          width: '109px', height: '40px',
          fontStyle: "normal",
          fontSize: 14
        }} onClick={(e) => dispatch(cancelAddOrEditTier({}))}>Cancel</Button>
        <Button color="primary" variant="contained" style={{
          width: '109px', height: '40px',
          fontStyle: "normal",
          fontSize: 14,
          marginLeft: 30,
          backgroundColor: '#4D2CEC'
        }} onClick={onSave}
          disabled={showInvalidYearlyValue || showInvalidMonthlyValue || tier.name.trim() == "" || tier.description.trim() == "" || tier.tierMonthlyPrice == 0 || tier.tierYearlyPrice == 0}
        >SAVE</Button>
      </Grid>

    </Grid>
    </LoadingOverlay>
  )
}
export default AddTier
