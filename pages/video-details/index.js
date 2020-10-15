import VideoDetailsCreator from '../../components/VideoDetailsCreator'
import BaseSetup from '../../components/BaseSetup'
import {withAuthenticationRequired} from '@auth0/auth0-react'

const videoDetails = () => {
    return (
    <BaseSetup component={VideoDetailsCreator} />
    )
}

export default videoDetails

