import SubscriberList from '../components/SubscriberList'
import BaseSetup from '../components/BaseSetup'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const subscribers = () => {
    return (
        <BaseSetup component={SubscriberList} />
    )
}

export default withAuthenticationRequired(subscribers, {

})