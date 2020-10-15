import { useAuth0 } from '@auth0/auth0-react'

const VerifyEmail = () => {
    const { user } = useAuth0();
   
    return (
        <div style={{ backgroundColor: '#13162C', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 500, height: 350, backgroundColor: '#272E49', display: 'flex', flexDirection: 'column', color: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 16 }}>
                    MAVEN TEAM
                </div>
                <div style={{ fontSize: 22, paddingTop: 30, fontWeight: 'bold' }}>
                    Please verify your email
                </div>
                <div style={{paddingTop: 30}}>
                    You’re almost there! We sent an email to
                </div>
                <div style={{ fontWeight: 'bold' }}>{user?.email}</div>
                <div style={{paddingTop: 20}}>
                Just click on the link in that email to complete your sign up.
                </div>
                <div>
                If you don’t see it, you may need to <span style={{fontWeight: 'bold'}}>check your spam</span> folder.
                </div>
                <div style={{paddingTop: 20, fontSize: 12}}>
                <span style={{color: '#8F9BB3'}}>Any questions? Email us at</span> <span style={{color: '#4D2CEC'}}>help@maven.video</span>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail
