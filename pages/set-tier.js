import SetTierForVideo from '../components/SetTierForVideo'
import BaseSetup from '../components/BaseSetup'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const setTier = () => {
    return (
        <BaseSetup component={SetTierForVideo} />
    )
}

export default withAuthenticationRequired(setTier, {

})