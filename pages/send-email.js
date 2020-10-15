import SendEmail from "../components/SendEmail"
import BaseSetup from '../components/BaseSetup'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const sendEmail = () => {
    return (
        <BaseSetup component={SendEmail} />
    )
}

export default withAuthenticationRequired(sendEmail, {})