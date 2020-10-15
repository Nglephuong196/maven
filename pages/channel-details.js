import React, {useState, useEffect} from 'react'
import useAuth0 from '@auth0/auth0-react'
import {withAuthenticationRequired} from '@auth0/auth0-react'
import {useDispatch, useSelector} from 'react-redux'
import BaseSetup from '../components/BaseSetup'
import ChannelDetails from '../components/ChannelDetails'
import ProtectedRoute from '../components/ProtectedRoute'


const channelDetails = () => {
    
    return (

            <BaseSetup component={ChannelDetails} /> 
        
    )
    
}

export default withAuthenticationRequired(channelDetails, {
  
});