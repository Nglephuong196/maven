import BaseSetup from '../components/BaseSetup'
import VideoListCreator from '../components/VideoListCreator'
import { withAuthenticationRequired } from '@auth0/auth0-react'

const profileEdit = () => {
    return (
        <BaseSetup component={VideoListCreator} />
    )

}

export default withAuthenticationRequired(profileEdit,{

})