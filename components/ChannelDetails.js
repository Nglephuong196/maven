import React, { useState, useEffect, useRef } from 'react'
import { makeStyles, Switch, Select, MenuItem, TextField, TextareaAutosize, Grid, Button, Popper, Tooltip } from '@material-ui/core'
import useApi from '../customHooks/useApi'
import { useDispatch, useSelector } from 'react-redux'
import { getChannel, updateChannel, createChannel, changeChannelStatus } from '../redux/actions/index'
import LoadingOverlay from 'react-loading-overlay'
import InfomationIcon from '../assets/icons/InfomationIcon'
import DropImageIcon from '../assets/icons/DropImageIcon'
import { useDropzone } from 'react-dropzone'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { useRouter } from 'next/router'



const useStyle = makeStyles((theme) => ({
    container: {
        margin: '0 3rem',
        width: '100%',
        minWidth: '900px',
        overflowY: 'auto'
    },
    label: {
        fontWeight: 600,
        fontSize: 14,
        whiteSpace: 'nowrap'
    },
    header: {
        fontStyle: 'normal',
        fontWeight: 600,
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
    customWidth: {
        maxWidth: 200,
        backgroundColor: theme.palette.common.black,
        fontSize: 14
    },
    selectTemplate: {
        display: 'flex',
        alignItems: 'baseline',
        paddingTop: '3rem'
    },
    name: {
        display: 'flex',
        alignItems: 'baseline',
        margin: "2rem 6rem"
    },

    description: {
        display: 'flex',
        alignItems: 'baseline',
        margin: "2rem 6rem"
    },
    logo: {
        display: 'flex',
        alignItems: 'baseline',
        margin: "2rem 6rem",
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
    hide: {
        display: 'none'
    }
}))



const ChannelDetails = () => {
    const router = useRouter()
    const classes = useStyle()
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [videoSrc, setVideoSrc] = useState(null)
    const [disabled, setDisabled] = useState(true)
    const { channel, channelCreated } = useSelector(state => ({
        channel: state.channelReducer.channel,
        channelCreated: state.channelReducer.channelCreated
    }))
    const onDrop = React.useCallback((acceptedFiles) => {
        handleUploadImage(acceptedFiles)
    })
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/jpeg, image/png' });
    const { uploadImage } = useApi()
    const [channelDetails, setChannelDetails] = useState({
        name: channel?.name || "",
        channelURL: channel?.channelUrl || '',
        description: channel?.description || '',
        logo: channel?.logoUrl || ''
    })
    const player = useRef()
    const isMatchUrl = (url) => {
        var expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
        var regex = new RegExp(expression);
        let temp  = 'https://' + url + '.maven.video'
        if (temp.match(regex)) {
            return true
        } else {
            return false
        }
    }
    useEffect(() => {
        if (channelCreated) {
            router.push('/channel-styles/')
            dispatch(changeChannelStatus({}))
        }
    }, [channelCreated])

    useEffect(() => {
        setChannelDetails({
            name: channel?.name || "",
            channelURL: channel?.channelUrl || '',
            description: channel?.description || '',
            logo: channel?.logoUrl || ''
        })
    }, [channel])

    useEffect(() => {
        if (channelDetails.name != "" && channelDetails.channelURL.length >= 3 && isMatchUrl(channelDetails.channelURL) && channelDetails.logo && channelDetails.description != "") {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [channelDetails.name, channelDetails.channelURL, channelDetails.logo,channelDetails.description])

    const handleSubmit = () => {
        if (channelDetails.channelURL != "" && channelDetails.name != "" && channelDetails.name.length < 70 && channelDetails.description.length < 200) {
            dispatch(createChannel({ channelDetails }))
        }
        //router.push('channel-styles')
    }

    const handleUpdate = () => {
        if (channelDetails.channelURL != "" && channelDetails.name != "" && channelDetails.name.length < 70 && channelDetails.description.length < 200) {
            dispatch(updateChannel({ channelInfo: channelDetails, postalAddress: null }))
        }
        router.push('channel-styles')
    }


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

    const removeFile = () => {
        acceptedFiles.pop()
        setChannelDetails({ ...channelDetails, logo: "" })
    }

    const handleUploadImage = async (e) => {
        setIsLoading(true)
        let file = e[0]
        if (file) {
            const fileUrl = await uploadImage(file)
            if (fileUrl) {
                setChannelDetails({ ...channelDetails, logo: fileUrl })
            }
            setIsLoading(false)
        } else {
            setChannelDetails({ ...channelDetails, logo: "" })
            setIsLoading(false)
        }
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState();

    const handleClick = (newPlacement) => (event) => {
        setAnchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

    return (
        <LoadingOverlay active={isLoading} spinner text="Loading">
            <Grid container spacing={2}>
                <Grid item xs={12} style={{ marginBottom: 25 }}>
                    <div className={classes.header}>Channel's Detail</div>
                </Grid>

                <Grid item xs={2} style={{ textAlign: "right", alignSelf: 'center' }}>
                    <label htmlFor="name" className={classes.label}>
                        Channel Name <span style={{ color: 'red' }}>*</span>
                    </label>
                </Grid>
                <Grid item xs={10} >
                    <TextField id="name" variant="outlined" style={{ width: '80%' }} value={channelDetails.name}
                        inputProps={{
                            maxLength: 70
                        }}
                        onChange={(e) => {
                            setChannelDetails({ ...channelDetails, name: e.target.value })
                        }} placeholder="70 characters maximum"></TextField>

                </Grid>
                <Grid item xs={2}>

                </Grid>
                <Grid item xs={10}>
                    <div className={channelDetails.name != "" && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>This field is required</div>
                    <div className={channelDetails.name.length <= 70 && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>70 characters maximum</div>
                </Grid>
                <Grid item xs={2} style={{ textAlign: "right", alignSelf: 'center' }}>
                    <label htmlFor="channelURL" className={classes.label}>
                        Channel's URL <span style={{ color: 'red' }}>*</span>
                    </label>
                </Grid>
                <Grid item xs={5} >
                    <TextField id="channelURL" variant="outlined" style={{ width: '100%' }} value={channelDetails.channelURL}
                        inputProps={{
                            maxLength: 20
                        }}
                        onChange={(e) => {
                            setChannelDetails({ ...channelDetails, channelURL: e.target.value })
                        }} disabled={channel?.channelUrl} placeholder="my-custom-url" ></TextField>
                </Grid>
                <Grid item xs={5} style={{}}>
                    <div style={{ display: 'flex' }}>
                        <p>.maven.video</p>
                        <Tooltip arrow title="This cannot be edited, please select it carefully. Your channel name should contain 3-20 characters" placement="right"
                            classes={{ tooltip: classes.customWidth }}>
                            <Button><InfomationIcon /></Button>
                        </Tooltip>
                    </div>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={10}>
                    <div className={isMatchUrl(channelDetails.channelURL) && classes.hide || ""} style={{ color: 'red', fontStyle: 'italic' }}>Url is not valid</div>
                    <div className={channelDetails.channelURL != "" && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>This field is required</div>
                    <div className={channelDetails.channelURL.length >= 3 && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>3 characters minimum</div>
                </Grid>
                <Grid item xs={2} style={{ textAlign: "right", alignSelf: 'center' }}>
                    <label htmlFor="logo" className={classes.label}>
                        <div>
                        <div>Logo <span style={{ color: 'red' }}>*</span></div>
                        <div style={{color:'#8F9BB3', fontSize: 10, paddingRight:5}}>(50x50)</div>
                        </div>
                        
                     </label>
                </Grid>
                {channelDetails.logo == "" && (
                    <Grid item xs={10} className={channelDetails.logo != "" && classes.hide || ""} style={{ alignSelf: 'center' }}>
                        <div >
                            <div {...getRootProps({ className: 'dropzone' })} style={{
                                height: 40, border: '1px dashed #AAAAAA',
                                borderRadius: 10,
                                position: 'relative',
                                width: '80%'
                            }}>
                                <input {...getInputProps()} />
                                <DropImageIcon />
                            </div>
                        </div>

                    </Grid>
                )}

                {channelDetails.logo != "" && (
                    <Grid item xs={10}>
                        <div style={{ position: "relative", width: 50, height: 50, borderRadius: 5 }}>
                            <img src={channelDetails.logo} alt="Snow" style={{ width: "100%", height: '100%' }} />
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', cursor: 'pointer' }} onClick={removeFile}><HighlightOffIcon /></div>
                        </div>
                    </Grid>
                )}

                <Grid item xs={2} style={{ textAlign: "right", alignSelf: 'center' }}>
                    <label htmlFor="description" className={classes.label}>
                        Description<span style={{ color: 'red' }}>*</span>
                     </label>
                </Grid>
                <Grid item xs={8} style={{ position: 'relative' }}>
                    <TextareaAutosize id="description" variant="outlined" style={{ width: '100%' }} maxLength={200} rowsMin={6}
                        value={channelDetails.description}
                        placeholder="About you (200 characters in maximum)"
                        onChange={(e) => setChannelDetails({ ...channelDetails, description: e.target.value })}
                    ></TextareaAutosize>
                    <div className={channelDetails.description.length <= 200 && classes.hide || ""} style={{ color: 'red', paddingTop: 10, fontStyle: 'italic' }}>200 characters maximum</div>


                </Grid>
                <Grid item xs={2} >

                </Grid>
                {!channel && (
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                        <Button color="primary" variant="contained" style={{ width: '150px', marginTop: 30, marginRight: 30, color: '#FFFFFF' }} onClick={(e) => router.push('/')}>Back</Button>
                        <Button color="secondary" variant="contained" style={{ width: '150px', marginTop: 30, color: '#FFFFFF' }} onClick={handleSubmit} disabled={channelDetails.channelURL == "" || channelDetails.name == "" || channelDetails.description == "" || channelDetails.name.length > 70 || channelDetails.description.length > 200 || channelDetails.logo == ""}>NEXT</Button>
                    </Grid>
                )}
                {channel && (
                    <Grid item xs={10} style={{ textAlign: 'right' }}>

                        <Button variant="outlined" style={{
                            width: '109px', height: '40px', marginTop: 22.5,
                            fontStyle: "normal",
                            fontSize: 14, marginRight: 30, color: '#FFFFFF'
                        }} onClick={(e) => router.push('/')}>Previous</Button>
                        <Button color="secondary" variant="contained" style={{
                            width: '109px', height: '40px', marginTop: 22.5,
                            fontStyle: "normal",
                            fontSize: 14,
                            color: '#FFFFFF',
                            backgroundColor: '#4D2CEC'   
                        }} onClick={handleUpdate} disabled={channelDetails.channelURL == "" || channelDetails.name == "" || channelDetails.description == "" || channelDetails.name.length > 70 || channelDetails.description.length > 200 || channelDetails.logo == ""}>NEXT</Button>
                    </Grid>
                )}
            </Grid>
        </LoadingOverlay>
    )
}

export default ChannelDetails
