import React, { useRef, useState, useEffect } from 'react';
import { Player, ControlBar, PlayProgressBar, ReplayControl, PlaybackRateMenuButton, BigPlayButton } from 'video-react';
import { makeStyles, Input, InputAdornment, FormControl, Modal, Grid, FormControlLabel, Checkbox, Popover, RadioGroup, Radio, Button } from '@material-ui/core';
import SendCommentIcon from '../assets/icons/SendCommentIcon'
import { useDispatch, useSelector } from 'react-redux'
import { addCommentCreator, getListCommentCreator, hideOrUnhideComment, updateTierForVideo, getVideoDetails, getTranscription, publishVideo, startProcessVideo, endProcessVideo } from '../redux/actions/index'
import CommentBox from '../components/CommentBox'
import moment from 'moment'
import { useRouter } from 'next/router'
import AttachIcon from '../assets/icons/AttachIcon'
import HeartEmojiIcon from '../assets/icons/HeartEmojiIcon'
import CryEmojiIcon from '../assets/icons/CryEmojiIcon'
import ClapEmojiIcon from '../assets/icons/ClapEmojiIcon'
import SurpriseEmojiIcon from '../assets/icons/SurpriseEmojiIcon'
import LaughEmojiIcon from '../assets/icons/LaughEmojiIcon'
import dynamic from 'next/dynamic'
import SaveDraftButtonIcon from '../assets/icons/SaveDraftButtonIcon'
import PublishButtonIcon2 from '../assets/icons/PublishButtonIcon2'
import CreateTierIcon from '../assets/icons/CreateTierIcon'
import HLSSource from './HLSSource';
import LoadingOverlay from 'react-loading-overlay'
import Sockette from "sockette";
import SimonEditor from './SimonEditor'
import PublishedIcon from '../assets/icons/PublishedIcon';
import PublishModalIcon from '../assets/icons/PublishModalIcon'
let ws = null;


function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 450,
        backgroundColor: "#1D253E",
        //boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 2, 3),
        color: 'white'
    },
    margin: {
        margin: theme.spacing(1),
        width: '100%'
    },
    circleStyle: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#919191',
        borderRadius: "50%",
        width: 25,
        height: 25,
        textAlign: 'center',
        fontSize: 14,
        marginRight: 5
    },
    bigCircleStyle: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#919191',
        borderRadius: "50%",
        width: 50,
        height: 50,
        textAlign: 'center',
        fontSize: 14,
        marginRight: 5
    },
    hide: {
        display: 'none'
    },
    commentHide: {
        opacity: 0.5
    },
    player: {
        color: props => props.color
    },
    controlBar: {
        backgroundColor: 'blue'
    },
    '.video-react-play-progress.video-react-slider-bar': {
        backgroundColor: 'blue'
    }
}));



const VideoDetailsCreator = () => {
    const router = useRouter()
    const id = parseInt(router.query.id)
    const commentId = parseInt(router.query.commentId)
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles({ color: 'red' })
    const { user, channel, listCommentCreator, tierList, videoDetails, token, transcriptedContent, isUpdateTranscriptRequesting, isUpdateTierForVideoRequesting } = useSelector((state) => ({
        tierList: state.tierReducer.tierList,
        user: state.profileReducer.user,
        channel: state.channelReducer.channel,
        listCommentCreator: state.creatorCommentReducer.listCommentCreator,
        videoDetails: state.videoCreatorReducer.videoDetails,
        token: state.appReducer.token,
        transcriptedContent: state.transcriptionReducer.transcriptedContent,
        isUpdateTranscriptRequesting: state.transcriptionReducer.isUpdateTranscriptRequesting,
        isUpdateTierForVideoRequesting: state.videoCreatorReducer.isUpdateTierForVideoRequesting
    }))
    const dispatch = useDispatch()
    const player = useRef()
    const [anchorEl, setAnchorEl] = useState()
    const [openPublish, setOpenPublish] = useState()
    const [showTierList, setShowTierList] = useState(false)
    const open = Boolean(anchorEl)
    const changeSeconds = (SECONDS) => {
        return new Date(SECONDS * 1000).toISOString().substr(11, 8)
    }
    const [currentComment, setCurrentComment] = useState("")
    const [timeBase, setTimeBase] = useState()
    const handleAddComment = () => {
        dispatch(addCommentCreator({ videoId: id, commentId: 0, videoTime: timeBase, userType: 0, content: currentComment, enable: timeBaseEnable }))
        setCurrentComment('')
    }
    const handleChangeComment = (e) => {
        if (currentComment.length === 0) {
            setTimeBase(changeSeconds(player.current.manager.store.getState().player.currentTime))
        }
        // if (currentComment.length === 0) {
        //     setTimeBase(changeSeconds(player.current.manager.store.getState().player.currentTime))
        // }
        setCurrentComment(e.target.value)
    }
    const [loading, setLoading] = useState(false)
    const [currentIndex, setCurrentIndex] = useState()
    const [currentReplyComment, setCurrentReplyComment] = useState("")
    const [replyTimeBase, setReplyTimeBase] = useState()
    const [timeBaseEnable, setTimeBaseEnable] = useState(true)
    const [replyTimeBaseEnable, setReplyTimeBaseEnable] = useState(true)
    const [hideComment, setHideComment] = useState()
    const [hideReplyComment, setHideReplyComment] = useState()
    const [vsList, setVsList] = useState([])
    const [choosenIds, setChoosenIds] = useState([])
    const [listShow, setListShow] = useState()
    const [showSaved, setShowSaved] = useState(false)
    const [count, setCount] = useState(0)
    const [tierSetting, setTierSetting] = useState({
        title: videoDetails?.detailVideo?.title,
        description: videoDetails?.detailVideo?.descriptions,
        videoId: id,
        removeTiers: [],
        addTiers: [],
        isShared: 0
    })
    const simonEditor = useRef()
    const handleAddReply = (Id) => {
        dispatch(addCommentCreator({ videoId: id, commentId: Id, videoTime: replyTimeBase, userType: 0, content: currentReplyComment, enable: replyTimeBaseEnable }))
        setCurrentReplyComment('')
    }
    const handleReply = (e) => {
        if (currentReplyComment.length === 0) {
            setReplyTimeBase(changeSeconds(player.current.manager.store.getState().player.currentTime))
        }
        setCurrentReplyComment(e.target.value)
    }


    // const handleAddVideoVisability = (id) => {
    //     let addItem = tierList.filter(item => item.id == id)
    //     console.log(addItem)
    //     let temp1 = []
    //     vsList?.map(item => {
    //         temp1.push(item)
    //     })
    //     temp1.push(addItem[0])
    //     console.log(temp1)
    //     setVsList(temp1)
    //     setChoosenIds(temp1.map(item => item.id))

    //     let temp = videoDetails.infoTiers.map(item => {
    //         item.id
    //     })

    //     let newTier = addItem[0];
    //     let currentLstAddTier = tierSetting.addTiers;
    //     let existTier = videoDetails.infoTiers.filter(item => item.id === newTier.id);
    //     if (existTier.length == 0) {
    //         currentLstAddTier.push(newTier.id);
    //         console.log(currentLstAddTier)
    //         setTierSetting({ ...tierSetting, addTiers: currentLstAddTier })
    //     }
    // }
    const handleAddVideoVisability = (id) => {
        id = parseInt(id)
        let addItem = tierList.filter(item => item.id == id)
        let temp = []
        vsList.map(item => temp.push(item))
        temp.push(addItem[0])
        setVsList(temp)
        let existTier = videoDetails.infoTiers.filter(item => item.id == id)
        let currentLstAddTier = tierSetting.addTiers
        if (existTier.length == 0 && !currentLstAddTier.includes(id)) {
            currentLstAddTier.push(id)
            setTierSetting({ ...tierSetting, addTiers: currentLstAddTier })
        }

        if (existTier.length > 0 && tierSetting.removeTiers.includes(id)) {
            setTierSetting({ ...tierSetting, removeTiers: tierSetting.removeTiers.filter(item => item != id) })
        }

    }

    const handleDeleteVideoVisability = (id) => {
        id = parseInt(id)
        setVsList(vsList.filter(item => item.id != id))
        let currentLstRemoveTier = tierSetting.removeTiers;
        let existTier = videoDetails.infoTiers.filter(item => item.id == id)
        if (existTier.length > 0 && !currentLstRemoveTier.includes(id)) {
            currentLstRemoveTier.push(existTier[0].id)
            setTierSetting({ ...tierSetting, removeTiers: currentLstRemoveTier })
        }
        existTier = tierSetting.addTiers.filter(item => item == id);
        console.log(existTier)
        if (existTier.length > 0) {
            let lstUpdate = tierSetting.addTiers.filter(item => item != existTier[0]);
            setTierSetting({ ...tierSetting, addTiers: lstUpdate });
        }
    }

    // const handleDeleteVideoVisability = (id) => {
    //     setVsList(vsList.filter(item => item.id != id));

    //     let currentLstRemoveTier = tierSetting.removeTiers;
    //     let existTier = videoDetails.infoTiers.filter(item => item.id === id);
    //     if (existTier.length > 0) {
    //         currentLstRemoveTier.push(existTier[0].id);
    //         setTierSetting({ ...tierSetting, removeTiers: currentLstRemoveTier })
    //     }

    //     existTier = tierSetting.addTiers.filter(item => item === id);
    //     console.log(tierSetting.addTiers)
    //     if (existTier.length > 0) {
    //         let lstUpdate = tierSetting.addTiers.filter(item => item !== existTier[0]);
    //         setTierSetting({ ...tierSetting, addTiers: lstUpdate });
    //     }
    // }

    const handleSave = () => {
        setTierSetting({ ...tierSetting, videoId: id })
        dispatch(publishVideo({ tierSetting }))
        router.push('/video-management')
    }

    const handleSaveDraft = () => {
        //console.log(simonEditor.current)
        dispatch(updateTierForVideo({ tierSetting }))
        simonEditor.current.saveDraftTranscript()
    }

    const handleTimeClick = (time) => {
        player.current.seek(time);
    }

    const handleCheckTiers = (e) => {
        if (e.target.checked) {
            handleAddVideoVisability(e.target.value)
        } else {
            handleDeleteVideoVisability(e.target.value)
        }
    }



    useEffect(() => {
        if (isUpdateTranscriptRequesting || isUpdateTierForVideoRequesting) {
            setCount(count + 1)
        }
        if (!isUpdateTranscriptRequesting && count > 0 || !isUpdateTierForVideoRequesting && count > 0) {
            setShowSaved(true)
            setTimeout(() => {
                setShowSaved(false)
            }, 2000)
        }
    }, [isUpdateTierForVideoRequesting, isUpdateTranscriptRequesting])

    useEffect(() => {
        if (token && channel) {
            dispatch(getVideoDetails({ videoId: id, channelId: channel?.id }))
            dispatch(getTranscription({ videoId: id }))
        }

    }, [token, channel])

    useEffect(() => {
        if (channel?.id) {
            dispatch(getListCommentCreator({ videoId: id }))
        }

    }, [channel?.id, id])

    useEffect(() => {
        setListShow(listCommentCreator?.reverse())

    }, [listCommentCreator])
    useEffect(() => {
        var elmnt = document.getElementById(commentId.toString());
        if (elmnt) {
            console.log(elmnt)
            elmnt.scrollIntoView(true)
        }
    }, [listShow])
    // useEffect(() => {
    //     if (videoDetails) {
    //         setVsList(videoDetails.infoTiers)
    //         let temp = true
    //         if (videoDetails.infoTiers.length == 1 && videoDetails.infoTiers[0].isFree) {
    //             temp = false
    //         }
    //         setShowTierList(temp)
    //         setTierSetting({ ...tierSetting, description: videoDetails.detailVideo.descriptions, title: videoDetails.detailVideo.title })
    //     }
    // }, [tierList, videoDetails])

    useEffect(() => {

    }, [videoDetails?.infoVideo?.urlVideo])

    useEffect(() => {
        console.log(transcriptedContent)
    }, [transcriptedContent])

    /*Set up web socket */
    useEffect(() => {
        if (videoDetails?.infoVideo?.id === id && videoDetails?.infoVideo?.status === "UPLOADED" || videoDetails?.infoVideo?.id === id && videoDetails?.infoVideo?.status === "STARTED") {
            setLoading(true)
            dispatch(startProcessVideo())
            setTimeout(() => {
                const ping = (e) => {
                    console.log('Pinging123!');
                    const pingMessage = {
                        action: 'PING'
                    };
                    ws.json(pingMessage);
                    setTimeout(ping, 57000);
                };
                ws = new Sockette(
                    `${process.env.NEXT_WEB_SOCKET}`,
                    {
                        maxAttempts: 1,
                        onopen: e => {
                            console.log("connected:", e);
                            const newMessage = { videoId: id };
                            console.log('newMessage', newMessage)
                            ws.json({
                                action: "sendMessage",
                                data: JSON.stringify(newMessage)
                            });
                            //reconnect();
                            ping();
                        },
                        onmessage: e => onMessageReceied(e),
                        onreconnect: e => {
                            console.log("reconnecting:", e);
                        },
                        onmaximum: e => console.log("Stop Attempting!", e),
                        onclose: e => console.log("Closed!", e),
                        onerror: e => console.log("Error:", e)
                    }
                );
            }, 3000)
        }
        if (videoDetails?.infoVideo?.id == id && videoDetails?.infoVideo?.status == "DRAFT") {
            setLoading(false)
            dispatch(endProcessVideo())

        }
        if (videoDetails) {
            setVsList(videoDetails.infoTiers)
            let temp = true
            if (videoDetails.infoTiers.length == 1 && videoDetails.infoTiers[0].isFree) {
                temp = false
            }
            setShowTierList(temp)
            setTierSetting({ ...tierSetting, description: videoDetails.detailVideo.descriptions, title: videoDetails.detailVideo.title })
        }
    },
        [videoDetails]
    );

    const onMessageReceied = ({ data }) => {
        console.log(data);
        if (ws != null) {
            ws.close()
        }
        dispatch(getVideoDetails({ videoId: id, channelId: channel?.id }))
        dispatch(getTranscription({ videoId: id }))
        dispatch(endProcessVideo())
        setLoading(false)
    };
    /* Websocket end here */
    /* Simon Function */

    /* Simon Func End Here */

    /* Player time change */
    const [playerTime, setPlayerTime] = useState(0)
    useEffect(() => {
        player.current.subscribeToStateChange(changePlayerTime)
    }, [player])

    useEffect(() => {
        return function cleanup() {
            console.log('closed')
            ws?.close()
            dispatch(endProcessVideo())
        };
    }, [])

    const changePlayerTime = (state, prevState) => {
        setPlayerTime(state.currentTime)
    }
    /* Player time change end */



    function scrollToTop() {
        var elmnt = document.getElementById(commentId.toString());
        elmnt.scrollIntoView(true); // Top
    }


    return (

            <Grid container spacing={2} style={{ minWidth: 1000 }}>
                <Grid item xs={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Player
                                playsInline
                                poster="/assets/poster.png"
                                //src="https://stream.mux.com/oUL006rz9NVpbWJE01Oy3tPH2uxJ01JN02yUuH00cw6vQxKg.m3u8"
                                ref={player}
                                className={classes.player}
                            >
                                {videoDetails?.infoVideo?.id === id && videoDetails?.infoVideo?.urlVideo && (
                                    <HLSSource
                                        isVideoChild
                                        src={videoDetails?.infoVideo?.urlVideo + '?token=' + videoDetails?.infoVideo?.muxVideoToken}
                                    //src='https://creators-assets.s3.amazonaws.com/1/kr3Pb1j5z4FMVVYJLITrLeMvHGcx1hY00U00P00ULlIPZc.m3u8'
                                    />
                                )}
                                <BigPlayButton position="center" />
                                <ControlBar autoHide={false}>
                                    <PlaybackRateMenuButton rates={[2, 1.75, 1.5, 1.25, 1]} />
                                    {/* <ReplayControl seconds={30} order={2.1} /> */}
                                    {/* <PublishButtonIcon2 order={2.1} style={{color: 'red'}} /> */}
                                </ControlBar>
                                {/* <ControlBar autoHide={false} className={classes.controlBar} /> */}
                                <PlayProgressBar className={classes.controlBar} />
                            </Player>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex' }}>
                            <Grid item xs={1} style={{ maxWidth: '100%' }}>
                                <div className={classes.bigCircleStyle} >
                                    {user?.urlImage ? (
                                        <img style={{
                                            borderRadius: "50%",
                                            width: 50,
                                            height: 50,
                                        }} src={user.urlImage} />
                                    ) : (
                                            <p>P</p>
                                        )}
                                </div>
                            </Grid>
                            <Grid item xs={3}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div><input maxLength="70" style={{
                                        fontSize: 22, border: 'none', backgroundColor: 'transparent',
                                        color: 'white', outline: 'none', width: '-webkit-fill-available'
                                    }}
                                        onChange={e => setTierSetting({ ...tierSetting, title: e.target.value })}
                                        value={tierSetting.title}></input></div>
                                    <div style={{ color: '#8F9BB3' }}>{moment(videoDetails?.infoVideo?.createdAt).format('MMMM Do YYYY')}</div>
                                </div>
                            </Grid>
                            {/* <Grid item xs={2}>
                        <input type="text" value={process.browser && window.location.href} id="myInput" style={{ display: 'none' }} />
                        <div style={{
                            display: 'flex', backgroundColor: '#1D253E',
                            height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 5
                        }} onClick={e => {
                            var copyText = document.getElementById("myInput");

                        }}>
                            <span style={{ paddingRight: 5 }}><AttachIcon /></span> Copy URL
                        </div>
                    </Grid>
                    <Grid item xs={3} >
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div><HeartEmojiIcon /></div>
                            <div><ClapEmojiIcon /></div>
                            <div> <SurpriseEmojiIcon /></div>
                            <div><LaughEmojiIcon /></div>
                            <div><CryEmojiIcon /></div>
                        </div>
                    </Grid> */}

                            <Grid item xs={5} >
                                {videoDetails?.infoVideo.status === "PUBLISH" && (
                                    <PublishedIcon />
                                )}
                            </Grid>
                            <Grid item xs={1} style={{ display: 'flex', alignItems: 'center' }}>
                                <div>{isUpdateTranscriptRequesting || isUpdateTierForVideoRequesting ? 'Saving' : showSaved ? 'Saved' : ""}</div>
                                {/* <div>{showSaved && !isUpdateTranscriptRequesting || showSaved && !isUpdateTierForVideoRequesting ? 'Saved' : ''}</div> */}
                            </Grid>
                            <Grid item xs={2} style={{ maxWidth: '100%', display: 'flex', alignItems: 'center' }}>
                                <Button style={{
                                    display: 'flex', backgroundColor: '#FFFFFF', borderRadius: 10, color: '#4D2CEC', padding: '1em',
                                    width: '130px', height: 40, justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
                                }} onClick={handleSaveDraft} disabled={showSaved || isUpdateTierForVideoRequesting || isUpdateTranscriptRequesting}>
                                    <span style={{ paddingRight: 10, whiteSpace: 'nowrap' }}><SaveDraftButtonIcon /></span><div style={{ whiteSpace: 'nowrap' }}>{videoDetails?.infoVideo.status === "PUBLISH" ? "Save" : "Save Draft"}</div>
                                </Button>
                            </Grid>
                            {videoDetails?.infoVideo.status !== "PUBLISH" && (
                                <Grid item xs={3} style={{ maxWidth: '100%', display: 'flex', alignItems: 'center' }}>
                                    <Button disabled={vsList?.length == 0} style={{
                                        display: 'flex', backgroundColor: '#4D2CEC', borderRadius: 10,
                                        padding: '1em',
                                        width: '130px', height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 20, cursor: 'pointer'
                                    }}
                                        onClick={e => setOpenPublish(true)}>
                                        <span style={{ paddingRight: 10 }}><PublishButtonIcon2 /></span>
                                        {vsList?.length == 0 ?
                                            (
                                                <div style={{ color: '#8F9BB3' }}>Publish</div>
                                            ) :
                                            (
                                                <div style={{ color: 'white' }}>Publish</div>
                                            )

                                        }
                                    </Button>
                                    <Modal
                                        open={openPublish}
                                        onClose={e => setOpenPublish(false)}
                                        aria-labelledby="simple-modal-title"
                                        aria-describedby="simple-modal-description"
                                    >
                                        <div style={modalStyle} className={classes.paper}>
                                            <div style={{ textAlign: 'center', fontSize: 22 }}>Ready to publish?</div>
                                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0px' }}><PublishModalIcon /></div>
                                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                                <div style={{ backgroundColor: '#4D2CEC', width: 180, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 10, cursor: 'pointer' }}
                                                    onClick={handleSave}
                                                >
                                                    Yeh let’s do this!
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                                    onClick={e => setOpenPublish(false)}>
                                                    Nah, I want to edit a bit more!
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                </Grid>
                            )}

                        </Grid>

                        <Grid item xs={12}>
                            <textarea style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%' }}
                                value={tierSetting.description} onChange={e => setTierSetting({ ...tierSetting, description: e.target.value })}
                                placeholder="Your description here" maxLength="280"
                            ></textarea>
                        </Grid>

                        <Grid item xs={2} >
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                <div style={{ color: '#8F9BB3' }}>
                                    Video’s visibility:
                            </div>
                            </div>
                        </Grid>
                        <Grid item xs={10}>
                            <div style={{ display: 'flex' }}>
                                {vsList?.map(item => {
                                    return (
                                        <div key={item.id}
                                            style={{ width: 'fit-content', height: 25, borderRadius: 12, display: 'flex', padding: 5 }}>
                                            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>{item.name + ', '}</div>

                                        </div>
                                    )
                                })}
                                <div onClick={e => setAnchorEl(e.currentTarget)}><CreateTierIcon /></div>
                                {/* <Select
                                    inputProps={{
                                        style: {
                                            marginTop: 100,
                                            backgroundColor: 'black'
                                        }
                                    }}
                                    placeholder='Add'
                                    color='secondary'
                                    onChange={handleAddVideoVisability}
                                    value={null}
                                >
                                    {tierList?.filter(item => !choosenIds.includes(item.id)).map(item => {
                                        return (
                                            <option key={item.id} value={item}>{item.name}</option>
                                        )
                                    })}

                                </Select> */}
                            </div>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={e => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <div style={{ backgroundColor: '#1D253E', color: 'white', width: 380, padding: 30 }}>
                                    <div style={{ fontSize: 22 }}>
                                        Video’s visibility
                                    </div>
                                    <RadioGroup aria-label="gender" name="gender1" value={showTierList} onChange={e => {
                                        setShowTierList(!showTierList)

                                        if (showTierList) {
                                            setTierSetting({ ...tierSetting, addTiers: [tierList.filter(item => item.isFree)[0].id], removeTiers: vsList.map(item => item.id) })
                                            setVsList(tierList.filter(item => item.isFree))

                                        } else {
                                            setVsList(videoDetails.infoTiers)
                                            setTierSetting({ ...tierSetting, addTiers: [], removeTiers: [] })
                                        }

                                    }}>
                                        <FormControlLabel value={false} control={<Radio />} label="Public" />
                                        <FormControlLabel value={true} control={<Radio />} label="Select tier" />
                                    </RadioGroup>
                                    {showTierList && tierList?.filter(item => item.status === 1 && !item.isFree).slice(0, 4).map(item => {
                                        return (
                                            <div style={{ paddingLeft: 20 }}>
                                                <Checkbox id={item.id.toString()} value={item.id} onChange={handleCheckTiers} checked={vsList.filter(vsItem => vsItem.id == item.id).length == 1} />
                                                <label htmlFor={item.id}>{item.name}</label>
                                            </div>
                                        )
                                    })}
                                    <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                        <Button style={{ backgroundColor: '#4D2CEC', width: 85, color: 'white' }} onClick={e => {
                                            dispatch(updateTierForVideo({ tierSetting }))
                                            setTierSetting({ ...tierSetting, addTiers: [], removeTiers: [] })
                                        }}>Save</Button>
                                    </div>

                                </div>
                            </Popover>
                        </Grid>

                        {
                            transcriptedContent && transcriptedContent[0]?.videoId == id && (
                                <Grid item xs={12}>
                                    <SimonEditor ref={simonEditor} rawContent={transcriptedContent} onTimeSelected={handleTimeClick} id={id} playerTime={playerTime} />
                                </Grid>
                            )
                        }
                    </Grid>
                </Grid>

                <Grid item xs={4} style={{ backgroundColor: '#272E49' }}>
                    <Grid container spacing={2} style={{ padding: 10 }}>
                        {listShow?.map(item => {
                            return (
                                <Grid id={item.id.toString()} key={item.id} item xs={12} className={item.isHide ? classes.commentHide : undefined}>
                                    <div style={{ display: 'flex' }}>
                                        <div className={classes.circleStyle} >
                                            {item?.userInfo[0]?.urlImage ? (
                                                <img style={{
                                                    borderRadius: "50%",
                                                    width: 25,
                                                    height: 25,
                                                }} src={item?.userInfo[0]?.urlImage} />
                                            ) : (
                                                    <p>P</p>
                                                )}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', paddingBottom: 5 }}>
                                                <div >{item?.userInfo[0]?.firstName}</div>
                                                <div style={{ fontSize: 12, color: '#8F9BB3', padding: '0 10px' }}>{moment(item?.commentAt).fromNow()}</div>
                                                <div style={{ fontSize: 12, color: '#8F9BB3', cursor: 'pointer' }}
                                                    onClick={e => {
                                                        dispatch(hideOrUnhideComment({ videoId: id, replyId: 0, commentId: item?.id, isHide: !item?.isHide }))
                                                    }}
                                                >{item.isHide ? 'Unhide' : 'Hide'}</div>
                                            </div>
                                            <div>
                                                <span style={{ color: '#4D2CEC' }}>{item.videoTime} </span>{item.content}
                                            </div>
                                            {item?.lstReplies.map(childItem => {
                                                return (
                                                    <div style={{ display: 'flex', paddingTop: 20 }} key={childItem.id} className={childItem.isHide ? classes.hide : undefined}>
                                                        <div className={classes.circleStyle} >
                                                            {childItem?.userInfo[0]?.urlImage ? (
                                                                <img style={{
                                                                    borderRadius: "50%",
                                                                    width: 25,
                                                                    height: 25,
                                                                }} src={childItem?.userInfo[0]?.urlImage} />
                                                            ) : (
                                                                    <p>P</p>
                                                                )}
                                                        </div>
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <div style={{ display: 'flex', paddingBottom: 5 }}>
                                                                <div >{childItem?.userInfo[0]?.firstName}</div>
                                                                <div style={{ fontSize: 12, color: '#8F9BB3', padding: '0 10px' }}>{moment(childItem?.commentAt).fromNow()}</div>
                                                                <div style={{ fontSize: 12, color: '#8F9BB3', cursor: 'pointer' }}
                                                                    onClick={e => {
                                                                        dispatch(hideOrUnhideComment({ videoId: id, replyId: childItem?.id, commentId: item?.id, isHide: !childItem?.isHide }))
                                                                    }}
                                                                >{childItem.isHide ? 'Un Hide' : 'Hide'}</div>
                                                            </div>
                                                            <div>
                                                                <span style={{ color: '#4D2CEC' }}>{childItem?.videoTime} </span>{childItem.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <div style={{ fontSize: 12, color: '#8F9BB3', paddingTop: 10 }} onClick={e => setCurrentIndex(item.id)}>
                                                Reply
                                        </div>
                                            <div className={item?.id !== currentIndex ? classes.hide : undefined}>
                                                <FormControl className={classes.margin}>
                                                    <Input
                                                        color='secondary'
                                                        onChange={handleReply}
                                                        onKeyDown={e => { e.key == "Enter" ? handleAddReply(item?.id) : {} }}
                                                        value={currentReplyComment}
                                                        startAdornment={
                                                            <InputAdornment position="start">
                                                                <div className={classes.circleStyle} >
                                                                    {user?.urlImage ? (
                                                                        <img style={{
                                                                            borderRadius: "50%",
                                                                            width: 25,
                                                                            height: 25,
                                                                        }} src={user.urlImage} />
                                                                    ) : (
                                                                            <p>P</p>
                                                                        )}
                                                                </div>
                                                                {/* <FormControlLabel
                                                                    value={replyTimeBase}
                                                                    control={<Checkbox color="primary" checked={replyTimeBaseEnable}
                                                                        onChange={e => setReplyTimeBaseEnable(!replyTimeBaseEnable)} />}
                                                                    label={replyTimeBase}
                                                                    labelPlacement="start"
                                                                    style={{ color: '#4D2CEC' }}
                                                                /> */}
                                                            </InputAdornment>
                                                        }
                                                        endAdornment={
                                                            <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                                                                <div onClick={e => handleAddReply(item?.id)}><SendCommentIcon /></div>
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </FormControl>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        })}
                        <Grid item xs={12}>
                            <FormControl className={classes.margin}>
                                <Input
                                    color='secondary'
                                    onChange={handleChangeComment}
                                    onKeyDown={e => { e.key == "Enter" ? handleAddComment() : {} }}
                                    value={currentComment}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <div className={classes.circleStyle} >
                                                {user?.urlImage ? (
                                                    <img style={{
                                                        borderRadius: "50%",
                                                        width: 25,
                                                        height: 25,
                                                    }} src={user.urlImage} />
                                                ) : (
                                                        <p>P</p>
                                                    )}
                                            </div>
                                            {/* <FormControlLabel
                                                value={timeBase}
                                                control={<Checkbox color="primary" checked={timeBaseEnable} onChange={e => {
                                                    setTimeBaseEnable(!timeBaseEnable)
                                                }} />}
                                                label={timeBase}
                                                labelPlacement="start"
                                                style={{ color: '#4D2CEC' }}
                                            /> */}
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                                            <div onClick={handleAddComment} ><SendCommentIcon /></div>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
    )
}

// export default dynamic(() => Promise.resolve(VideoDetailsCreator), {
//     ssr: false
// })

export default VideoDetailsCreator
