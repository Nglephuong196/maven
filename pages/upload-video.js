import BaseSetup from '../components/BaseSetup'
import UploadVideo from '../components/UploadVideo'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const uploadVideo = () => {
    return (
        <BaseSetup component={UploadVideo} />
    )
}

export default withAuthenticationRequired(uploadVideo, {

})