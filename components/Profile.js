import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, makeStyles, Button, TextareaAutosize } from '@material-ui/core'
import { editUserProfile } from '../redux/actions/index'
import { useRouter } from 'next/router'
import { TextField } from '@material-ui/core'
import PenIcon from '../assets/icons/PenIcon'

const useStyles = makeStyles(theme => ({
    circleStyle: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#919191',
        borderRadius: "50%",
        width: 85,
        height: 85,
        textAlign: 'center',
        fontSize: 44,
        margin: '0 auto'
    }
}))

const Profile = () => {
    const classes = useStyles()
    const router = useRouter()
    const dispatch = useDispatch()
    const { user } = useSelector(state => ({
        user: state.profileReducer.user
    }))

    const [userInfo, setUserInfo] = useState({
        firstName: user?.firstName,
        lastName: user?.lastName,
        description: user?.description,
        email: user?.email,
        urlImage: user?.urlImage,
        urlLink: user?.urlLink
    })
    const [editMode, setEditMode] = useState(false)
    const handleSave = () => {
        if (userInfo.firstName && userInfo.lastName && userInfo.description) {
            dispatch(editUserProfile({ userProfile: userInfo }))
            setEditMode(false)
        }
    }
    useEffect(() => {
        if (user) {
            setUserInfo({
                firstName: user?.firstName,
                lastName: user?.lastName,
                description: user?.description,
                email: user?.email,
                urlImage: user?.urlImage,
                urlLink: user?.urlLink
            })
        }
    }, [user])

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{ fontSize: 48, textAlign: 'center' }}>Profile</div>
            </Grid>
            <Grid item xs={3}>
                <div style={{ fontSize: 22, textAlign: 'center' }}>Your Profile</div>
            </Grid>
            <Grid item xs={9}>
            </Grid>
            <Grid item xs={3}>
                <div className={classes.circleStyle} >
                    {user?.urlImage ? (
                        <img style={{
                            borderRadius: "50%",
                            width: 85,
                            height: 85,
                        }} src={userInfo.urlImage} />
                    ) : (
                            <p>P</p>
                        )}
                </div>
            </Grid>
            <Grid item xs={5}>
                {editMode ? (
                    <Grid container spacing={2}>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            Your first name
                    </Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" color="secondary" style={{ width: '100%' }}
                                value={userInfo.firstName}
                                onChange={e => setUserInfo({ ...userInfo, firstName: e.target.value })}
                            />
                            {userInfo.firstName == "" && (
                                <div style={{ color: 'red', paddingTop: 10}}>This field is required!</div>
                            )}
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            Your last name
                    </Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" color="secondary" style={{ width: '100%' }}
                                value={userInfo.lastName}
                                onChange={e => setUserInfo({ ...userInfo, lastName: e.target.value })}
                                inputProps={{ maxLength: 70 }}
                            />
                            {userInfo.lastName == "" && (
                                <div style={{ color: 'red', paddingTop: 10}}>This field is required!</div>
                            )}
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            Description
                    </Grid>
                        <Grid item xs={8}>
                            <TextareaAutosize variant="outlined" color="secondary" style={{ width: '100%' }}
                                value={userInfo.description}
                                rowsMin={3} maxLength={200}
                                onChange={e => setUserInfo({ ...userInfo, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            Email
                    </Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" color="secondary" style={{ width: '100%' }} value={userInfo.email} disabled />
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            Socail URL
                    </Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" color="secondary" style={{ width: '100%' }}
                                value={userInfo.urlLink}
                                onChange={e => setUserInfo({ ...userInfo, urlLink: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                ) : (
                        <Grid container spacing={2} >
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #272E49', padding: '0 10px' }}>
                                    <div style={{ flex: 1 }}>Your name</div>
                                    <div style={{ flex: 2 }}>{userInfo?.firstName} {userInfo?.lastName}</div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #272E49', padding: '0 10px' }}>
                                    <div style={{ flex: 1 }}>Description</div>
                                    <div style={{ flex: 2 }}>{userInfo?.description}</div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #272E49', padding: '0 10px' }}>
                                    <div style={{ flex: 1 }}>Email</div>
                                    <div style={{ flex: 2 }}>{userInfo?.email}</div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', padding: '0 10px' }}>
                                    <div style={{ flex: 1 }}>Socail URL</div>
                                    <div style={{ flex: 2 }}>{userInfo?.urlLink}</div>
                                </div>
                            </Grid>
                        </Grid>
                    )}
            </Grid>
            <Grid item xs={4}>
            </Grid>
            {!editMode ? (
                <Grid container spacing={0}>
                    <Grid item xs={6}>
                    </Grid>
                    <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button color="primary" variant="contained" style={{
                            width: '150px', height: '40px',
                            fontStyle: "normal",
                            fontSize: 13,
                            marginTop: 30,
                            backgroundColor: '#4D2CEC'
                        }} onClick={e => setEditMode(true)}><PenIcon />  <span style={{ paddingLeft: 5 }}>Profile Edit</span></Button>
                    </Grid>
                    <Grid item xs={4}></Grid>
                </Grid>
            ) : (
                    <Grid container spacing={0} style={{ marginTop: 20 }}>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <div style={{ cursor: 'pointer' }} onClick={e => setEditMode(false)}>
                                DISCARD
                    </div>
                        </Grid>
                        <Grid item xs={2} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Button color="primary" variant="contained" style={{
                                width: '150px', height: '40px',
                                fontStyle: "normal",
                                fontSize: 13,
                                backgroundColor: '#4D2CEC'
                            }} onClick={handleSave} disabled={userInfo.firstName == "" || userInfo.lastName == ""}>Save changes</Button>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                )}

        </Grid>
    )

}

export default Profile
