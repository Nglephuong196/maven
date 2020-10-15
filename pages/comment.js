import CommentBox from '../components/CommentBox'
import BaseSetup from '../components/BaseSetup'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const comment = () => {
    return (
        <BaseSetup component={CommentBox} />
    )
}

export default withAuthenticationRequired(comment, {

})