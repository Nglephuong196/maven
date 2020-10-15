import BaseSetup from '../components/BaseSetup'
import Profile from '../components/Profile'
import { withAuthenticationRequired } from '@auth0/auth0-react'
const profile = () => {
    return (
        <BaseSetup component={Profile} />
    )
    
}

export default withAuthenticationRequired(profile, {

})