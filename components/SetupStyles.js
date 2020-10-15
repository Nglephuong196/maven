import React, { useState, useEffect, useRef, useCallback } from 'react'
import { makeStyles, Switch, Select, MenuItem, TextField, TextareaAutosize, FormControl, InputLabel, Checkbox, Typography, Slider, Grid, Button } from '@material-ui/core'
import { useAuth0 } from "@auth0/auth0-react";
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import ColorPicker from 'material-ui-color-picker'
import { Player, ControlBar } from 'video-react';
import useApi from '../customHooks/useApi'
import LoadingOverlay from 'react-loading-overlay'
import { useDispatch, useSelector } from 'react-redux'
import { updateChannelStyle } from '../redux/actions/index'
import { Autocomplete } from '@material-ui/lab';
import { useDropzone } from 'react-dropzone';
import DropVideoIcon from '../assets/icons/DropVideoIcon'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import fontFamilyJson from '../assets/json/font-family'
import { useRouter } from 'next/router'

const useStyle = makeStyles((theme) => ({
    container: {
        margin: '0 3rem',
        width: '100%',
        minWidth: '400px'
    },
    label: {
        fontWeight: 500,
        fontSize: "14px",
    },
    header: {
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '22px',
        lineHeight: '25px'
    },
    featureVideo: {
        "& input": {
            paddingLeft: '30%'
        },
        width: '75%',
        height: '75%',
        paddingTop: '2rem',
        margin: "0 auto"
    },

    selectTemplate: {
        display: 'flex',
        alignItems: 'baseline',
        paddingTop: '3rem'
    },

    text: {
        display: 'flex',
        alignItems: 'baseline',
        margin: "2rem 6rem",
    },

    videoDesign: {
        display: 'flex',
        alignItems: 'center',
        margin: "2rem 6rem",
    },
    hidePreview: {
        display: 'none'
    },
    player: {
        color: props => props.color
    },
    template1: {
        border: '1px solid #6415a8'
    }, 
    template2: {
        border: '1px solid #76c88a'
    }
}))



const SetupStyles = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { uploadVideo } = useApi()
    const onDrop = useCallback((acceptedFiles) => {

        handleUploadVideo(acceptedFiles)
    })
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'video/mp4' });
    const [channelStyle, setChannelStyle] = useState({
        color: '',
        colorAccent: '',
        font: '',
        isTemplate1: false,
        isTemplate2: false
    })
    const classes = useStyle({ color: channelStyle?.color })
    const [isLoading, setIsLoading] = useState(false)
    const { channelSetting, channel } = useSelector(state => ({
        channelSetting: state.stylesReducer.channelSetting,
        channel: state.channelReducer.channel,
    }))

    const [videoSrc, setVideoSrc] = useState(null)
    const player = useRef()
    const test = useRef()
    const test1 = useRef()
    useEffect(() => {

    }, [player, channelStyle, videoSrc, channelSetting, channel])
    useEffect(() => {

    }, [channelStyle.color])
    function setFileInfo(e) {
        var files = e.target.files;
        var video = document.createElement('video');


        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);

            var duration = video.duration;

        }
        if (files[0]) {
            video.src = URL.createObjectURL(files[0]);
        }
    }

    const handleSubmit = () => {
        dispatch(updateChannelStyle({ channelStyle }))
        window.location.assign("https://" + channel.channelUrl + '.' + `${process.env.NEXT_APP_MAIN_DOMAIN}/tiers/?role=creator`)
    }
    const handleSave = () => {
        dispatch(updateChannelStyle({ channelStyle }))
    }

    const handleUploadVideo = async (e) => {
        setIsLoading(true)
        let file = e[0]
        if (file) {
            const fileUrl = await uploadVideo(file)
            if (fileUrl) {
                setChannelStyle({ ...channelStyle, featureVideo: fileUrl })
                setIsLoading(false)
            }
        } else {
            setChannelStyle({ ...channelStyle, featureVideo: "" })
            setIsLoading(false)
        }
    }

    useEffect(() => {
        console.log(channelStyle)
    }, [channelStyle?.color])


    return (
        <LoadingOverlay active={isLoading} spinner text="Loading">
            <Grid container spacing={2} style={{ minWidth: 700 }}>
                <Grid item xs={4} style={{ textAlign: 'right', marginBottom: 25, alignSelf: 'center' }}>
                    <div className={classes.header}>Design Your Channel</div>
                </Grid>
                <Grid item xs={8}>

                </Grid>

                <Grid item xs={2} style={{ textAlign: "right", alignSelf: 'center' }}>
                    <label htmlFor="template" className={classes.label}>Select template</label>
                </Grid>
                <Grid item xs={5}>
                    <label htmlFor="checkbox">
                        <div className={channelStyle.isTemplate1 ? classes.template1 : undefined} style={{ backgroundColor: '#272E49', width: 200, height: 150, borderRadius: 10, paddingTop: 10 }}>
                            <div style={{ backgroundColor: '#1D253E', width: 170, height: 110, margin: '0 auto', borderRadius: 10, padding: 10 }}>

                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                Template #1
                        <Button style={{ backgroundColor: '#9eef5a', height: 26, color: 'white' }}>NEW</Button>
                            </div>
                        </div></label>
                    <Checkbox id='checkbox' checked={channelStyle.isTemplate1} style={{ display: 'none' }}
                        onChange={e => setChannelStyle({ ...channelStyle, isTemplate1: !channelStyle.isTemplate1, isTemplate2: false,
                        color: '#9eef5a', colorAccent: '#6415a8' })} />
                </Grid>
                <Grid item xs={5}>
                    <label htmlFor="checkbox2">
                        <div className={channelStyle.isTemplate2 ? classes.template2 : undefined} style={{ backgroundColor: '#272E49', width: 200, height: 150, borderRadius: 10, paddingTop: 10 }}>
                            <div style={{ backgroundColor: '#1D253E', width: 170, height: 110, margin: '0 auto', borderRadius: 10, padding: 10 }}>

                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                Template #2
                        <Button style={{ backgroundColor: '#8c3a78', height: 26, color: 'white' }}>NEW</Button>
                            </div>
                        </div></label>
                    <Checkbox id='checkbox2' checked={channelStyle.isTemplate2} style={{ display: 'none' }}
                        onChange={e => 
                            setChannelStyle({ ...channelStyle, isTemplate2: !channelStyle.isTemplate2, isTemplate1: false,
                            color: '#8c3a78', colorAccent: '#76c88a' })
                        } />
                </Grid>
                {!channelStyle.useTemplate && (
                    <Grid container spacing={2} style={{paddingTop: 20}}>
                        <Grid item xs={2} style={{ textAlign: "right", alignSelf: 'center' }}>
                            <label htmlFor="text" >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p className={classes.label} style={{ margin: 0 }}>Customization</p>
                                    <p style={{ margin: 0, fontSize: 10, color: '#8F9BB3' }}>(Select color)</p>
                                </div>
                            </label>
                        </Grid>
                        <Grid item xs={2}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <ColorPicker
                                    name='Color'

                                    style={{ width: '100px' }}
                                    inputRef={test}
                                    InputLabelProps={{
                                        style: {
                                            color: channelStyle.backgroundColor,
                                            display: 'none'
                                        }
                                    }}
                                    inputProps={{
                                        style: {
                                            margin: 5
                                        }
                                    }}
                                    value={channelStyle.color}
                                    onChange={color => {
                                        setChannelStyle({ ...channelStyle, color: color })
                                        test.current.style.backgroundColor = color
                                    }}
                                    variant="outlined"

                                />
                                <p style={{ fontSize: 10, color: '#8F9BB3' }}>Main</p>
                            </div>
                        </Grid>
                        <Grid item xs={1} style={{ alignSelf: 'center' }}>
                            <div>~</div>
                        </Grid>
                        <Grid item xs={2}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <ColorPicker
                                    name='Color'

                                    style={{ width: '100px' }}
                                    inputRef={test1}
                                    InputLabelProps={{
                                        style: {
                                            color: channelStyle.mainColor,
                                            display: 'none'
                                        }
                                    }}
                                    inputProps={{
                                        style: {
                                            margin: 5
                                        }
                                    }}
                                    value={channelStyle.colorAccent}
                                    onChange={color => {
                                        setChannelStyle({ ...channelStyle, colorAccent: color })
                                        test1.current.style.backgroundColor = color
                                    }}
                                    variant="outlined"

                                />
                                <p style={{ fontSize: 10, color: '#8F9BB3' }}>Accent</p>
                            </div>
                        </Grid>

                        <Grid item xs={5}></Grid>
                        <Grid item xs={2}>
                        </Grid>
                        {/* <Grid item xs={10}>
                            <Autocomplete
                                id="combo-box-demo"
                                options={fontFamilyJson.families}
                                getOptionLabel={(option) => option}
                                style={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={2}>

                        </Grid> */}

                        <Grid item xs={7} style={{ alignSelf: 'center' }}>
                            <div >
                                <Player
                                    ref={player}
                                    playsInline
                                    poster="/assets/poster.png"
                                    src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
                                    className={classes.player}
                                >
                                </Player>
                            </div>
                        </Grid>
                        <Grid item xs={3}></Grid>

                    </Grid>
                )}
                {!channelSetting && (
                    <Grid item xs={10} style={{ textAlign: 'right' }}>

                        <Button variant="outlined" style={{
                            width: '109px', height: '39px', marginTop: 22.5,
                            fontStyle: "normal",
                            color: '#FFFFFF',
                            fontSize: 14, marginRight: 30
                        }} onClick={(e) => {router.push('/channel-details') }}>Previous</Button>
                        <Button color="primary" variant="contained" style={{
                            width: '109px', height: '39px', marginTop: 22.5,
                            fontStyle: "normal",
                            backgroundColor: '#4D2CEC',
                            color: '#FFFFFF',
                            fontSize: 14
                        }} onClick={handleSubmit}>Done</Button>
                    </Grid>

                )}
                {channelSetting && (
                    <Grid item xs={10} style={{ textAlign: 'right' }}>

                        <Button variant="outlined" style={{
                            width: '109px', height: '39px', marginTop: 22.5,
                            fontStyle: "normal",
                            color: '#FFFFFF',
                            fontSize: 14, marginRight: 30
                        }} onClick={(e) => history.push('')}>Cancel</Button>
                        <Button color="primary" variant="contained" style={{
                            width: '109px', height: '39px', marginTop: 22.5,
                            fontStyle: "normal",
                            fontSize: 14,
                            backgroundColor: '#4D2CEC',
                            color: '#FFFFFF',
                        }} onClick={handleSave}>Update</Button>
                    </Grid>

                )}
            </Grid>
        </LoadingOverlay >
    )
}

export default SetupStyles
