import BaseSetup from '../../components/BaseSetup'
import TiersBase from '../../components/TiersBase'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const tiers = () => {
    return (
        <BaseSetup component={TiersBase} />
    )
}

export default withAuthenticationRequired(tiers, {

})