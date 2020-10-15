import React from 'react'
import SetupStyles from '../components/SetupStyles'
import BaseSetup from '../components/BaseSetup'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { Player } from 'video-react';
import ProtectedRoute from '../components/ProtectedRoute'

const channelStyles = () => {
    return (
    // <ProtectedRoute>
    //      <BaseSetup component={SetupStyles} />
    // </ProtectedRoute>
    <BaseSetup component={SetupStyles} />
    )
}

export default withAuthenticationRequired(channelStyles, {

})