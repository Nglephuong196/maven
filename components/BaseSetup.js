import { useRouter } from 'next/router'
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { getToken } from '../redux/actions/index'
import useApi from '../customHooks/useApi'
import React, { useEffect, useState } from "react";
import LoadingOverlay from 'react-loading-overlay'
import Header from './Header'
import { getUserProfile, getChannel, getTiers } from "../redux/actions";
import SideBarDrawer from './SideBarDrawer'
import { Grid, Button } from "@material-ui/core";
import AppStyles from '../styles/AppStyle'
import { ToastContainer, toast } from 'react-toastify';
import UploadVideo from './UploadVideo';
import dynamic from 'next/dynamic'
import VerifyEmail from './VerifyEmail';
import clsx from 'clsx'


function BaseSetup(props) {
  const { user, loading, logout } = useAuth0();
  const [isLoading, setIsLoading] = useState()
  const firstTime = true
  const classes = AppStyles()
  const dispatch = useDispatch()
  const { isRequestingUser, token, isRequestingChannel, isLoadingStyles, tierRequesting, role, channelUrl, msg, pushMsg, isVideoProcessing } = useSelector(state => ({
    isLoadingStyles: state.stylesReducer.isLoadingStyles,
    isRequestingUser: state.profileReducer.isRequestingUser,
    token: state.appReducer.token,
    isRequestingChannel: state.channelReducer.isRequestingChannel,
    tierRequesting: state.tierReducer.tierRequesting,
    channelUrl: state.appReducer.channelUrl,
    role: state.appReducer.role,
    msg: state.appReducer.msg,
    pushMsg: state.appReducer.pushMsg,
    isVideoProcessing: state.loadingReducer.isVideoProcessing
  }))

  const { verifyUser, checkVideoDuration } = useApi()
  useEffect(() => {
    if (user.email_verified) {
      verifyUser()
    }
  }, [])

  useEffect(() => {
    if (isRequestingUser || loading || isRequestingChannel || isLoadingStyles || tierRequesting) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [loading, isRequestingUser, isRequestingChannel, isLoadingStyles, tierRequesting])

  useEffect(() => {
    if (token) {
      checkVideoDuration()
      dispatch(getUserProfile({}))
      dispatch(getChannel({}))
    }
  }, [token])

  useEffect(() => {
    if (msg != null) {
      toast('🦄 ' + msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [pushMsg])

  if (!user.email_verified) {

    return (
      <VerifyEmail />
    )
  }

  if (!role) {
    
    return (
      <div style={{ height: '100%', width: '100%', backgroundColor: '#13162C' }}>
        
      </div>
    )
  }

  if (role === "CREATOR" && channelUrl === null || role == "CREATOR" && window.location.pathname == "/channel-styles/" || role == "CREATOR" && window.location.pathname == "/channel-details/") {
    return (
      <LoadingOverlay active={isLoading} spinner text="Loading">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Grid container spacing={2} style={{ minWidth: 500, overflow: 'hidden' }}>

          <Grid item xs={12} style={{ height: '100vh', overflow: 'auto', backgroundColor: '#13162C', color: '#FFFFFF' }} className={classes.scrollbar}>
            <div style={{ width: 700, borderRadius: 10, backgroundColor: '#1D253E', padding: 20, margin: '20vh auto' }}>
              < props.component />
            </div>

          </Grid>

        </Grid>
      </LoadingOverlay>
    )
  }

  // if (window.location.href.indexOf(channelUrl) === -1) {
  //   return (

  //     <LoadingOverlay active={isLoading} spinner text="Loading">
  //     <Router  >
  //     <Grid container spacing={2} style={{ minWidth: 500, overflow: 'hidden' }}>
  //       <Grid item xs={12} >
  //         <Header />
  //       </Grid>
  //       <Grid item xs={2} style={{height: '100vh'}}>
  //         <Sidebar />
  //       </Grid>
  //       <Grid item xs={10} style={{height: '100vh', overflow:'auto', padding: '20px 20px 10vh 20px'}} className={classes.scrollbar}>
  //           <PrivateRoute exact path="/" component={() => <ProfileSetup />} />
  //           <PrivateRoute exact path='/checkout-success' component={() => <CheckOutSuccess />} />
  //           <PrivateRoute exact path='/checkout-cancel' component={() => <CheckOutCancel />} />
  //           <PrivateRoute exact path='/checkout' component={() => <CheckOut />} />
  //       </Grid>
  //     </Grid>
  //     </Router>
  //   </LoadingOverlay>
  //   )
  // }
  return (

    <LoadingOverlay active={isLoading} spinner text="Loading">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      // , backgroundColor: '#13162C', color: '#FFFFFF'
      />
      <Grid container spacing={0} style={{ minWidth: 500, overflow: 'hidden' }}>
        <Grid item xs={12} style={{ height: '10vh', backgroundColor: '#272E49' }} justify="center"
          alignItems="center" direction="row">
          <Header />
        </Grid>
        {/* <Grid item xs={2} style={{ height: '90vh', backgroundColor: '#1D253E' }}>
          <SideBarDrawer />
        </Grid> */}
        <Grid item xs={12} style={{ height: '90vh', overflow: 'hidden', backgroundColor: '#13162C', color: '#FFFFFF' }} className={classes.scrollbar}>

          <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
            <div><SideBarDrawer /></div>
            <LoadingOverlay active={isVideoProcessing} spinner text="Video is processing" className={clsx({ [classes.scrollbar]: true }, { [classes.overflow]: !isVideoProcessing })}>
              <div style={{ overflow: 'auto', padding: 20 }} >
                {process.browser && window.location.pathname == "/app/" ? (
                  <UploadVideo />
                ) : (
                    < props.component />
                  )}
              </div>
            </LoadingOverlay>
          </div>

        </Grid>
      </Grid>
    </LoadingOverlay>
  )

}

export default withAuthenticationRequired(dynamic(() => Promise.resolve(BaseSetup), {
  ssr: false
}), {

});
//export default dynamic(() => Promise.resolve(BaseSetup))

