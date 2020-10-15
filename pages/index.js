import { useRouter } from 'next/router'
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from "react";
import LoadingOverlay from 'react-loading-overlay'
import ProfileSetup from "../components/ProfileSetup";
import Header from '../components/Header'
import { getUserProfile, getChannel, getTiers } from "../redux/actions";
import Sidebar from '../components/Sidebar'
import { Grid, Button } from "@material-ui/core";
import AppStyles from '../styles/AppStyle'
import { ToastContainer, toast } from 'react-toastify';
import BaseSetup from '../components/BaseSetup'
import VideoListCreator from '../components/VideoListCreator'
import router from 'next/router'



function App() {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
  // useEffect(() => {
  //   console.log('isAuthenticated', isAuthenticated)
  //   setTimeout(() => {
  //     if (isAuthenticated) {
  //       router.push('/app/?role=creator')
  //     } else {
  //       const handleUnauthen = async () => {
  //         await logout({
  //           returnTo: window.location.origin,
  //         });
  //       }
  //       handleUnauthen()
  //     }
  //   }, 10000)
  // }, [isAuthenticated])
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app/?role=creator')
    }
  }, [isAuthenticated])
  return (
    //  <BaseSetup component={ProfileSetup}/>
    <div>
      <button onClick={() => loginWithRedirect()}>Log In</button>
      <button onClick={() => logout()}>Log out</button>
    </div>
  )

}

export default App
