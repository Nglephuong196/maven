import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = ({ children }) => {
    const { logout } = useAuth0();
    const { channelUrl } = useSelector(state => ({
        channelUrl: state.appReducer.channelUrl
    }))

    useEffect(() => {
        // if (process.browser && window.location.origin.indexOf(channelUrl) == -1 ) {
        //     logout({ returnTo: window.location.origin })
        // }
        if (process.browser && window.location.origin.indexOf(channelUrl) == -1 ) {
            logout({ returnTo: window.location.origin })
        }
    }, [])

    return (
        <>
            {children}
        </>
        
    )
}

export default ProtectedRoute