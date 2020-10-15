import { useState, useEffect, useRef } from 'react'
import { Grid, LinearProgress, TextField, Button, TextareaAutosize } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { endProcessVideo, startProcessVideo } from '../redux/actions/index'
import UploadPublishVideo from '../assets/icons/UploadPublishVideo'
import UploadTranscribeVideo from '../assets/icons/UploadTranscribeVideo'
import TimeWarning from '../assets/icons/TimeWarning'
import RemoveFile from '../assets/icons/RemoveFile'
import useApi from '../customHooks/useApi'
import { Player, ControlBar } from 'video-react';
import appReducer from '../redux/reducers/appReducer'
import { useRouter } from 'next/router'
import LoadingOverlay from 'react-loading-overlay'
import Sockette from "sockette";
import WarningUploadIcon from '../assets/icons/WarningUploadIcon'
import dynamic from 'next/dynamic'
import { publishVideo } from '../redux/actions'
import RemoveVideoIcon from '../assets/icons/RemoveVideoIcon'
let ws = null;

const UploadVideo = () => {
    const router = useRouter()
    const player = useRef()
    const player2 = useRef()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [videoState, setVideoState] = useState({
        videoPublish: null,
        videoTranscribe: null,
        title: '',
        description: ""
    })
    const [criteria, setCriteria] = useState({
        videoSize: false,
        videoLength: false,
        videoAllocation: false,
        diffLength: false
    })
    const [publishLength, setPublishLength] = useState()
    const [transcribeLength, setTranscribeLength] = useState()
    const [videoId, setVideoId] = useState()
    const [duration, setDuration] = useState(0)
    const [disabled, setDisabled] = useState(true)
    const { fileProgress, timeRemain } = useSelector(state => ({
        fileProgress: state.appReducer.fileProgress,
        timeRemain: state.appReducer.timeRemain
    }))
    const { uploadPublishVideo, checkVideoDuration, decreaseVideoAllocation, createVideo } = useApi()
    const countDuration = (files) => {
        var video = document.createElement('video');
        //let video = player
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            var duration = video.duration;
            setDuration(duration)
            if (duration > 900) {
                setCriteria({
                    ...criteria,
                    videoLength: true
                })
            } else {
                setCriteria({
                    ...criteria,
                    videoLength: false
                })
            }
        }
        if (files[0]) {
            video.src = URL.createObjectURL(files[0]);
        }
    }

    const checkTwoVideoLength = (files, type) => {
        var video = document.createElement('video');
        //let video = player
        video.onloadedmetadata = function () {
            window.URL.revokeObjectURL(video.src);
            var duration = video.duration;
            if (type == "PUBLISH") {
                setPublishLength(parseInt(duration))
            }
            if (type == "TRANSCRIBE") {
                setTranscribeLength(parseInt(duration))
            }
        }
        if (files[0]) {
            video.src = URL.createObjectURL(files[0]);
            //console.log(video.src)
        }
    }

    const handleUploadPublish = async (e) => {
        setCriteria({ ...criteria, diffLength: false })
        if (e.target.files[0]) {
            setVideoState({ ...videoState, videoPublish: e.target.files[0] })
            countDuration(e.target.files)
            console.log('check video allocation', e.target.files)
            checkTwoVideoLength(e.target.files, "PUBLISH")
        
            if (e.target.files[0].size > 5000000000) {
                setCriteria({
                    ...criteria,
                    videoSize: true
                })
            } else {
                setCriteria({
                    ...criteria,
                    videoSize: false
                })
            }
        }
    }
    const handleUploadTranscribe = async (e) => {
        setCriteria({ ...criteria, diffLength: false })
        if (e.target.files[0]) {
            //countDuration(e.target.files)
            checkTwoVideoLength(e.target.files, "TRANSCRIBE")
            setVideoState({ ...videoState, videoTranscribe: e.target.files[0] })
        }
    }
    const removeVideoPublish = () => {
        setVideoState({ ...videoState, videoPublish: null })
        setCriteria({
            videoSize: false,
            videoLength: false,
            videoAllocation: false,
            diffLength: false
        })
        setPublishLength()
    }
    const removeVideoTranscribe = () => {
        setVideoState({ ...videoState, videoTranscribe: null })
        setTranscribeLength()
    }

    const handleSubmit = async () => {
        if (publishLength && transcribeLength) {
            if (publishLength != transcribeLength) {
                setCriteria({ ...criteria, diffLength: true })
                return
            } else {
                setCriteria({ ...criteria, diffLength: false })
            }
        }



        setLoading(true)
        dispatch(startProcessVideo())
        const res = await createVideo(videoState.videoPublish, videoState.videoTranscribe, duration, videoState.title, videoState.description)
        if (res) {
            const ping = (e) => {
                console.log('Pinging!');
                const pingMessage = {
                    action: 'PING'
                };
                ws.json(pingMessage);
                setTimeout(ping, 570000);
            };
            ws = new Sockette(
                `${process.env.NEXT_WEB_SOCKET}`,
                {
                    maxAttempts: 1,
                    onopen: e => {
                        console.log("connected:", e);
                        const newMessage = { videoId: res.id };
                        console.log('newMessage', newMessage)
                        ws.json({
                            action: "sendMessage",
                            data: JSON.stringify(newMessage)
                        });
                        ping();
                    },
                    onmessage: e => onMessageReceied(e, res.id),
                    onreconnect: e => console.log("Reconnecting...", e),
                    onmaximum: e => console.log("Stop Attempting!", e),
                    onclose: e => console.log("Closed!", e),
                    onerror: e => console.log("Error:", e)
                }
            );
            setVideoId(res.id)
            await uploadPublishVideo(videoState.videoPublish, videoState.videoTranscribe, res)
            const isDecreaseAllocation = await decreaseVideoAllocation(duration, res.id)
        }
    }

    /*Set up web socket */
    useEffect(() => {
        return function cleanup() {
            ws?.close()
            dispatch(endProcessVideo())
        };
    }, [])

    const onMessageReceied = ({ data }, id) => {
        console.log('onMessageReceied', data)
        setLoading(false)
        dispatch(endProcessVideo())
        if (ws != null) {
            ws.close()
        }
        router.push(`/video-details?id=${id}`)
    };
    /* Websocket end here */

    useEffect(() => {
    }, [videoState.videoPublish, videoState.videoTranscribe, timeRemain])

    useEffect(() => {

    }, [criteria.videoAllocation, criteria.videoLength, criteria.videoSize, criteria.diffLength])

    useEffect(() => {
        if (timeRemain < duration && duration != 0) {
            if (duration > 900) {
                setCriteria({ ...criteria, videoAllocation: true, videoLength: true })
            } else {
                setCriteria({ ...criteria, videoAllocation: true, videoLength: false })
            }
        } else {
            if ((duration > 900) && duration != 0) {
                setCriteria({ ...criteria, videoAllocation: false, videoLength: true })
            } else {
                setCriteria({ ...criteria, videoAllocation: false, videoLength: false })
            }
        }

    }, [duration])

    useEffect(() => {
        if (videoState?.publishVideo) {
            countDuration([videoState.publishVideo])
        }

    }, [videoState.publishVideo])

    return (
        
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <p style={{ fontSize: 22 }}>Upload your video</p>
                </Grid>
                <Grid item xs={12}>
                    <p>Video’s title<span style={{ color: 'red' }}>*</span></p>
                </Grid>
                <Grid item xs={12}>
                    <TextField variant="outlined" placeholder="The deconstruction of 21st century monopolies" style={{ width: '50%' }}
                        value={videoState.title}
                        onChange={e => setVideoState({ ...videoState, title: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                    <p>Video’s description<span style={{ color: 'red' }}>*</span></p>
                </Grid>
                <Grid item xs={12}>
                    <TextareaAutosize variant="outlined" placeholder="The deconstruction of 21st century monopolies" rowsMin={3} style={{ width: '50%' }}
                        value={videoState.description}
                        onChange={e => setVideoState({ ...videoState, description: e.target.value })} />
                </Grid>
                <Grid item xs={6}>
                    <p>Video 1: upload your video for publishing <span>*</span></p>
                </Grid>
                <Grid item xs={6}>
                    <p>Video 2: upload your video for transcription <span>*</span></p>
                </Grid>
                {videoState.videoPublish === null && (
                    <Grid item xs={6}>
                        <div style={{ border: '1px dashed #8F9BB3', width: '90%', height: 200, borderRadius: 10 }}>
                            <label htmlFor="publish-video" style={{ cursor: 'pointer' }}><UploadPublishVideo /></label>
                            <input id="publish-video" type="file" accept="video/mp4, video/quicktime, video/x-m4v" onChange={e => handleUploadPublish(e)} style={{ display: 'none' }} />
                        </div>
                    </Grid>
                )}
                {videoState.videoPublish !== null && (
                    // <Grid item xs={6}>
                    //     <div style={{ position: "relative", width: '90%', height: 'fit-content' }}>

                    //         <Player playsInline ref={player} src="https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4" style={{ height: 200, position: 'absolute' }}>
                    //         </Player>
                    //         <div style={{ position: 'absolute', top: '-10px', right: '-10px', cursor: 'pointer' }} onClick={removeVideoPublish}><RemoveFile /></div>
                    //     </div>
                    // </Grid>
                    <Grid item xs={6}>
                        {/* <div>{videoState.videoPublish.name}<span style={{ paddingLeft: 10, color: '#4D2CEC', cursor: 'pointer' }} onClick={removeVideoPublish}>x</span></div> */}
                        <div style={{ border: '1px solid #272E49', borderRadius: 10, minWidth: 150, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexDirection: 'column' }}>
                            <div>{videoState.videoPublish.name}</div>
                            <div>{parseInt(videoState.videoPublish.size / 1000000)} mb</div>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', cursor: 'pointer' }} onClick={removeVideoPublish}><RemoveVideoIcon /></div>
                        </div>
                    </Grid>
                )}
                {videoState.videoTranscribe === null && (
                    <Grid item xs={6}>
                        <div style={{ border: '1px dashed #8F9BB3', width: '90%', height: 200, borderRadius: 10, cursor: 'pointer' }}>
                            <label htmlFor="transcribe-video" style={{ cursor: 'pointer' }}><UploadTranscribeVideo /></label>
                            <input id="transcribe-video" type="file" accept="video/mp4, video/quicktime" onChange={e => handleUploadTranscribe(e)} style={{ display: 'none' }} />
                        </div>
                    </Grid>

                )}
                {videoState.videoTranscribe !== null && (
                    // <Grid item xs={6}>
                    //     <div style={{ position: "relative", width: '90%', height: 'fit-content' }}>
                    //         <Player playsInline ref={player} src="https://storage.googleapis.com/muxdemofiles/mux-video-intro.mp4" style={{ height: 200 }}>
                    //         </Player>
                    //         <div style={{ position: 'absolute', top: '-10px', right: '-10px', cursor: 'pointer' }} onClick={removeVideoTranscribe}><RemoveFile /></div>
                    //     </div>
                    // </Grid>
                    <Grid item xs={6}>
                        {/* <div>{videoState.videoTranscribe.name}<span style={{ paddingLeft: 10, color: '#4D2CEC', cursor: 'pointer' }} onClick={removeVideoTranscribe}>x</span></div> */}
                        <div style={{ border: '1px solid #272E49', borderRadius: 10, minWidth: 150, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexDirection: 'column' }}>
                            <div>{videoState.videoTranscribe.name}</div>
                            <div>{parseInt(videoState.videoTranscribe.size / 1000000)} mb</div>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', cursor: 'pointer' }} onClick={removeVideoTranscribe}><RemoveVideoIcon /></div>
                        </div>
                    </Grid>
                )}

                {/* {disabled && (
                    <Grid item xs={12}>
                        
                    </Grid>
                )} */}
                {(criteria.videoLength || criteria.videoSize || criteria.videoAllocation) && (
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', border: '1px solid #C12E3E', width: 600, color: 'red' }}>
                            <ul>
                                {criteria.videoSize && (
                                    <li>Video Size must be less than 5 GB</li>
                                )}
                                {criteria.videoLength && (
                                    <li>Min and max length: 5 mins - 15 mins</li>
                                )}
                                {criteria.videoAllocation && (
                                    <li>Sorry, the allocated video’s length is not sufficient to process this video</li>
                                )}
                            </ul>
                        </div>
                    </Grid>
                )}
                {criteria.diffLength && (
                    <Grid item xs={12}>
                        <div style={{ display: 'flex', border: '1px solid #C12E3E', width: 600, color: 'red' }}>
                            <ul>
                                <li>2 videos should be the same length</li>
                            </ul>
                        </div>
                    </Grid>
                )}


                <Grid item xs={12} style={{}}>

                    <Button color="primary" variant="contained" style={{
                        width: '109px', height: '40px', marginTop: 22.5,
                        backgroundColor: '#4D2CEC',
                        fontStyle: "normal",
                        fontSize: 14
                    }} onClick={handleSubmit} disabled={videoState.title == "" || videoState.description == "" || !videoState.videoPublish || criteria.videoLength || criteria.videoSize || criteria.videoAllocation}>CONTINUE</Button>

                </Grid>
            </Grid>
    )
}

export default UploadVideo
