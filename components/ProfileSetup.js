import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { makeStyles, TextareaAutosize, Button, TextField, Grid, Paper } from "@material-ui/core";
import { editUserProfile } from '../redux/actions/index'
import useApi from '../customHooks/useApi'
import LoadingOverlay from "react-loading-overlay";
import { loadStripe } from '@stripe/stripe-js';
import ProfileIcon from '../assets/icons/ProfileIcon'
import ProfileUploadIcon from '../assets/icons/ProfileUploadIcon'
import DropImageIcon from '../assets/icons/DropImageIcon'
import * as EmailValidator from 'email-validator';
import { useDropzone } from 'react-dropzone'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Person from '../assets/icons/Person'
import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { useRouter } from 'next/router'


const useStyles = makeStyles((theme) => ({
  label: {
    fontWeight: 500,
    fontStyle: 'normal',
    fontSize: "14px",
  },
  header: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '22px',
    lineHeight: '25px'
  },
  description: {
    display: 'flex',
    alignItems: 'baseline',
    margin: "2rem 6rem"
  },
  profileImage: {
    display: 'flex',
    alignItems: 'baseline',
    margin: "2rem 6rem",
  },
  name: {
    display: 'flex',
    alignItems: 'baseline',
    margin: "2rem 6rem"
  },
  hide: {
    display: 'none'
  },
  buttonText: {

  },
  uploadImage: {
    transition: 'transform .2s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  }
}))



const ProfileSetup = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector(state => ({
    user: state.profileReducer.user
  }))
  const onDrop = React.useCallback((acceptedFiles) => {
    handleUploadImage(acceptedFiles)
  })
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/jpeg, image/png' });
  const { uploadImage, verifyUser } = useApi()
  const classes = useStyles()
  const [showRequiredDes, setShowRequiredDes] = useState(false)
  const [userProfile, setUserProfile] = useState({
    description: user?.description || "",
    image: user?.urlImage || "",
    firstName: user?.firstName,
    lastName: user?.lastName,
    socialURL: user?.urlLink,
    email: user?.email
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setUserProfile({
      description: user?.description || "",
      image: user?.urlImage || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      socialURL: user?.urlLink || "",
      email: user?.email
    })
  }, [user])
  useEffect(() => {

  }, [userProfile])

  const handleSubmit = (e) => {
    if (userProfile.name != "" && EmailValidator.validate(userProfile.email) && userProfile.description != "") {
      dispatch(editUserProfile({ userProfile }))
      router.push(`/channel-details`)
    }
  }
  const removeFile = () => {
    acceptedFiles.pop()
    setUserProfile({ ...userProfile, image: "" })
  }
  const handleUploadImage = async (e) => {
    setIsLoading(true)
    let file = e.target.files[0]
    if (file) {
      const fileUrl = await uploadImage(file)
      if (fileUrl) {
        setUserProfile({ ...userProfile, image: fileUrl })
      }
      setIsLoading(false)
    } else {
      setUserProfile({ ...userProfile, image: "" })
      setIsLoading(false)
    }
  }
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (

    <Grid container spacing={2} >
      <Grid item xs={12}><div style={{ display: 'flex' }}><h1 className={classes.header}>Set Up Your Profile</h1></div></Grid>
      <Grid item xs={5} style={{ alignSelf: 'center' }}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <div style={{ position: "relative", margin: '0 auto', backgroundColor: '#4D2CEC', width: 150, height: 150, borderRadius: '50%', backgroundImage: `url(${userProfile.image})` }}>
              {userProfile.image != "" && (
                <img src={userProfile.image} alt="" style={{ width: "100%", height: '100%', borderRadius: '50%' }} />
              )}
              {userProfile.image == "" && (
                <div style={{ position: 'absolute', top: "30%", right: "33%" }}><Person /></div>
              )}

              <div style={{ position: 'absolute', top: "36%", right: "38%", width: 42, height: 42, background: '#000000', opacity: 0.11, borderRadius: '50%' }}></div>
              <label htmlFor="upload-photo" className={classes.uploadImage} style={{ position: 'absolute', top: "42%", right: "42%", cursor: 'pointer' }}><ProfileUploadIcon /></label>
              {/* <div style={{ position: 'absolute', top: "30%", right: "34%" }}><Person /></div> */}
              <input
                accept="image/*"
                //className={classes.input}
                style={{ display: 'none' }}
                id="upload-photo"
                multiple
                type="file"
                onChange={handleUploadImage}
              />
            </div>
          </Grid>
          <Grid item xs={6} style={{ alignSelf: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextField id="name" value={userProfile.firstName} style={{ width: '100%' }}
                inputProps={{
                  maxLength: 20,
                  style: {
                    textAlign: 'center',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    //fontSize: 22,
                    color: '#8F9BB3',
                  }
                }}
                placeholder="20 characters max"
                onChange={(e) => {
                  setUserProfile({ ...userProfile, firstName: e.target.value })
                }} required={true}></TextField>
              <div style={{ marginTop: 10, color: 'white' }}>First name<span style={{ color: 'red' }}> *</span></div>
            </div>
            {/* <div className={userProfile.firstName != "" && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic', textAlign: 'center' }}>This field is required</div> */}
          </Grid>
          <Grid item xs={6} style={{ alignSelf: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextField id="name" value={userProfile.lastName} style={{ width: '100%' }}
              
                inputProps={{
                  maxLength: 20,
                  style: {
                    textAlign: 'center',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    color: '#8F9BB3',
                  }
                }}
                placeholder="20 characters max"
                onChange={(e) => {
                  setUserProfile({ ...userProfile, lastName: e.target.value })
                }} required={true}></TextField>
              <div style={{ marginTop: 10, color: 'white' }}>Last name<span style={{ color: 'red' }}> *</span></div>
            </div>
            {/* <div className={userProfile.lastName != "" && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic', textAlign: 'center' }}>This field is required</div> */}
          </Grid>
          
        </Grid>
      </Grid>
      <Grid item xs={7}>
        <Grid container spacing={2}>
          <Grid item xs={12} style={{ alignSelf: 'center' }}>
            <label htmlFor="email" className={classes.label}>
              Email 
            </label>
          </Grid>
          <Grid item xs={10}>
          <TextField id="email" value={userProfile.email} variant="outlined" style={{ width: '96%' }}  onChange={(e) =>  {}}
             disabled={true}></TextField>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={12} style={{ alignSelf: 'center' }}>
            <label htmlFor="description" className={classes.label}>
              Description <span style={{ color: 'red' }}>*  </span><span style={{ color: '#8F9BB3', fontSize: 10 }}>(200 characters in maximum)</span>
            </label>
          </Grid>
          <Grid item xs={10}>
            <TextareaAutosize id="description" maxLength={200} value={userProfile.description} variant="outlined" style={{ width: '96%' }} rowsMin={6} 
            onChange={(e) => {
              e.target.value == "" ? setShowRequiredDes(true): setShowRequiredDes(false)
              setUserProfile({ ...userProfile, description: e.target.value })
            }} placeholder="I am a big nerd of 90s hip hop: its artists, the lyrics, and the lore. Recovering lawyer. Big fan of 🌶️."></TextareaAutosize>
            <div className={!showRequiredDes && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>This field is required</div>
          </Grid>
          <Grid item xs={2}>
          </Grid>
          <Grid item xs={12} style={{ alignSelf: 'center' }}>
            <label htmlFor="channel-url" className={classes.label}>
              Social URL <span style={{ color: '#8F9BB3', fontSize: 10 }}>(200 characters in maximum)</span>
                    </label>
          </Grid>
          <Grid item xs={10}>
            <TextField id="channel-url" value={userProfile.socialURL} variant="outlined" style={{ width: '100%' }}
              onChange={(e) => {
                setUserProfile({ ...userProfile, socialURL: e.target.value })
              }} placeholder="Your website, Twitter, Instagram..."  inputProps={{maxLength: 200}}></TextField>
          </Grid>
          <Grid item xs={2}>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={11} style={{ textAlign: 'right' }}>
        {(userProfile.image == "" || userProfile.firstName == "" || userProfile.lastName == "" || userProfile.description == "") ? (
          <Button variant="contained" style={{
            width: '109px', height: '40px', marginTop: 22.5,
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 14,
            backgroundColor: '#8F9BB3',
            color: '#FFFFFF'
          }}>Next</Button>
        ) : (
          <Button variant="contained" style={{
            width: '109px', height: '40px', marginTop: 22.5,
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 14,
            backgroundColor: '#4D2CEC',
            color: '#FFFFFF'
          }} onClick={handleSubmit} disabled={userProfile.image == "" || userProfile.firstName == "" || userProfile.lastName == "" || userProfile.description == ""}>Next</Button>
        )}
        
      </Grid>
      
      {/* <Grid item xs={12}><div style={{ display: 'flex' }}><h1 className={classes.header}>Set Up Your Profile</h1><span><ProfileIcon /></span></div></Grid>

        <Grid item xs={2} style={{ textAlign: 'right', alignSelf: 'center' }}>
          <label htmlFor="name" className={classes.label}>
            Name <span style={{ color: 'red' }}>*</span>
          </label>
        </Grid>
        <Grid item xs={10}>
          <TextField id="name" variant="outlined" value={userProfile.name} style={{ width: '80%' }}
            onChange={(e) => {
              setUserProfile({ ...userProfile, name: e.target.value })
            }} required={true}></TextField>
          <div className={userProfile.name != "" && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>This field is required</div>
        </Grid>

        <Grid item xs={2} style={{ textAlign: 'right', alignSelf: 'center' }}>
          <label htmlFor="description" className={classes.label}>
            Description <span style={{ color: 'red' }}>*</span>
          </label>
        </Grid>
        <Grid item xs={10}>
          <TextareaAutosize id="description" value={userProfile.description} variant="outlined" style={{ fontFamily: 'Roboto', fontSize: 16, width: '78%' }} rowsMin={6} onChange={(e) => {
            setUserProfile({ ...userProfile, description: e.target.value })
          }}></TextareaAutosize>
        </Grid>
        <Grid item xs={2} style={{ textAlign: 'right', alignSelf: 'center' }}>
          <label htmlFor="profileImage" className={classes.label}>
            Profile's image <span style={{ color: 'red' }}>*</span>
          </label>
        </Grid>
        <Grid item xs={10} className={userProfile.image != "" && classes.hide || ""}>
          
          <div {...getRootProps({ className: 'dropzone' })} style={{
            height: 40, border: '1px dashed #AAAAAA',
            borderRadius: 10,
            position: 'relative',
            width: '80%'
          }}>
            <input {...getInputProps()} />
            <DropImageIcon />
          </div>
        </Grid>
        {userProfile.image != "" && (
          <Grid xs={10} item>

            <div style={{ position: "relative", width: 300, height: 300, margin: '0 auto' }}>
              <img src={userProfile.image} alt="Snow" style={{ width: "100%" }} />
              <div style={{ position: 'absolute', top: 0, right: 0, cursor: 'pointer' }} onClick={removeFile}><HighlightOffIcon /></div>
            </div>

          </Grid>
        )}
        <Grid item xs={2} style={{ textAlign: 'right', alignSelf: 'center' }}>
          <label htmlFor="email" className={classes.label}>
            Email <span style={{ color: 'red' }}>*</span>
          </label>
        </Grid>
        <Grid item xs={10}>
          <TextField id="email" value={userProfile.email} variant="outlined" style={{ width: '80%' }} type="email"
            onChange={(e) => {
              setUserProfile({ ...userProfile, email: e.target.value })
            }}></TextField>
          <div className={EmailValidator.validate(userProfile.email) && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>Email is not valid</div>
        </Grid>
        <Grid item xs={2} style={{ textAlign: 'right', alignSelf: 'center' }}>
          <label htmlFor="channel-url" className={classes.label}>
            Social URL
                    </label>
        </Grid>
        <Grid item xs={10}>
          <TextField id="channel-url" value={userProfile.socialURL} variant="outlined" style={{ width: '80%' }}
            onChange={(e) => {
              setUserProfile({ ...userProfile, socialURL: e.target.value })
            }}></TextField>
        </Grid>
        <Grid item xs={10} style={{ textAlign: 'right' }}>
          <Button color="primary" variant="contained" style={{
            width: '109px', height: '40px', marginTop: 22.5, fontFamily: "Arial",
            fontStyle: "normal",
            fontWeight: "bold",
            fontSize: 14
          }} onClick={handleSubmit}>Continue</Button>
        </Grid> */}

    </Grid>

  )
};

export default withAuthenticationRequired(ProfileSetup, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Redirecting you to the login page...</div>,
});
