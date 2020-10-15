import React, { useEffect, useState } from 'react'
import { makeStyles, Grid, Button } from '@material-ui/core'
import { useSelector, useDispatch } from 'react-redux'
import useApi from '../customHooks/useApi'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_S8aYowgbMnVBu3JYgRDByxUS00YZfDliwn');
const stripe = require('stripe')('pk_test_S8aYowgbMnVBu3JYgRDByxUS00YZfDliwn');

const useStyles = makeStyles(theme => ({

}))

const CheckOut = () => {
  const { getSessionId, verifyUser } = useApi()
  const dispatch = useDispatch()
  const [session, setSession] = useState()
  const [account, setAccount] = useState()
  const [key, setKey] = useState()
  const { tiers } = useSelector(state => ({
    tiers: state.tierReducer.tierList
  }))
  const classes = useStyles()
  const handleCheckOut = async (priceId) => {
    const stripe = await stripePromise;
    let sessionId = await getSessionId(priceId)
    if (sessionId != "") {
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });
    }
  }

  const handleCheckOutSession = async () => {
    //const stripe = await stripePromise;
    var stripe = Stripe(key, {
      stripeAccount: account
    });
    const { error } = await stripe.redirectToCheckout({
      sessionId: session,
    });
  }

  const handleClick = async (event) => {
    // When the customer clicks on the button, redirect them to Checkout.
    //const stripe = await stripePromise;
    const session = await stripe.checkout.sessions.create({
      customer: 'cus_HrtOo4YAFSBKZx',
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1HKhKCJAaOMd6xWwKbesmPYb',
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
    // const { error } = await stripe.redirectToCheckout({
    //   lineItems: [
    //     // Replace with the ID of your price
    //     {price: 'price_1HKhKCJAaOMd6xWwKbesmPYb', quantity: 1}
    //   ],
    //   clientReferenceId: 'cus_HrtOo4YAFSBKZx',
    //   mode: 'subscription',
    //   successUrl: 'https://example.com/success',
    //   cancelUrl: 'https://example.com/cancel',
    // });
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
  };
  useEffect(() => {
    verifyUser()
  }, [])
  return (
    <Grid>
      <Grid item xs={12}>
        <h1>Tier List</h1>
      </Grid>
      <Grid container spacing={2}>
      <Grid item xs={12}>
        {/* <button role="link" onClick={handleClick}>
          Checkout
      </button> */}
    <button onClick={handleCheckOutSession}>checkout session</button>
      </Grid>
      
      <Grid item xs={12}>
        <label for="key">Key</label><input id="key" onChange={e => setKey(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <label for="session">session Id</label><input id="session" onChange={e => setSession(e.target.value)} />
      </Grid>
      <Grid item xs={12}>
        <label for="account">account Id</label><input id="account" onChange={e => setAccount(e.target.value)} />
      </Grid>
      </Grid>
      {/* {tiers.map((item, index) => {
        return (
          <Grid container>
            <Grid item xs={4}>
              {item.name}
            </Grid>
            {item.monthlyPrices[0] ? (
              <Grid item xs={4}>
                <Button color='primary' onClick={() => handleCheckOut(item.monthlyPrices[0].stripePriceId)}>
                  Check Out Monthly {item.monthlyPrices[0].price}
                </Button>
              </Grid>
            ) : (
                <Grid item xs={4}>
                </Grid>
              )}
            {item.yearlyPrices[0] ? (
              <Grid item xs={4}>
                <Button color='primary' onClick={() => handleCheckOut(item.yearlyPrices[0].stripePriceId)}>
                  Check Out Yearly {item.yearlyPrices[0].price}
                </Button>
              </Grid>
            ) : (
                <Grid item xs={4}>
                </Grid>
              )}
          </Grid>
        )
      })} */}
    </Grid>
  )
}

export default CheckOut
