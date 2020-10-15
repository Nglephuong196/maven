import BaseSetup from "../components/BaseSetup"
import {withAuthenticationRequired} from '@auth0/auth0-react'
import EditChannel from '../components/EditChannel'

const editChannel = () => {
    return (
         <BaseSetup component={EditChannel} />
    )
}

export default withAuthenticationRequired(editChannel, {

})
