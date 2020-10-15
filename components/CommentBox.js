import { Grid, makeStyles, Input, InputAdornment, FormControl, FormControlLabel, Checkbox } from "@material-ui/core"
import { useEffect, useState } from "react";
import SendCommentIcon from '../assets/icons/SendCommentIcon'
import { useDispatch, useSelector } from "react-redux";


const useStyle = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        backgroundColor: '#13162C',
        border: '1px solid #4D2CEC',
        borderRadius: 10
    },
    input: {
        border: 'none',
        outline: 'none',
        backgroundColor: '#13162C',
        overflow: 'auto',
        resize: 'none',
        flex: 1,
    },
    iconButton: {
        //padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    circleStyle: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#919191',
        borderRadius: "50%",
        width: 20,
        height: 20,
        textAlign: 'center',
        fontSize: 10,
        marginRight: 10
    },
    hide: {
        display: 'none'
    }
}))


const CommentBox = (props) => {
    const classes = useStyle()
    const dispatch = useDispatch()
    const { user } = useSelector(state => ({
        user: state.profileReducer.user
    }))
    const [currentIndex, setCurrentIndex] = useState()
    const [currentComment, setCurrenComment] = useState()
    const [timeBase, setTimeBase] = useState(props.timeBase)
    const handleAddReply = () => {

    }
    const handleReply = (e) => {
        if (currentComment.length === 0) {
            setTimeBase(props.timeBase)
        }
        // if (currentComment.length === 0) {
        //     setTimeBase(changeSeconds(player.current.manager.store.getState().player.currentTime))
        // }
        setCurrentComment(e.target.value)
    }

    useEffect(() => {
    }, [timeBase])
    return (
        <Grid container spacing={2} style={{ backgroundColor: '#272E49' }}>
            {props.commentList?.map(item => {
                return (
                    <Grid item xs={12}>
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
                                <div style={{ display: 'flex' }}>
                                    <div >{item?.userInfo[0]?.firstName}</div>
                                    <div style={{ fontSize: 12, color: '#8F9BB3', padding: '0 10px' }}>1 min ago</div>
                                    <div style={{ fontSize: 12, color: '#8F9BB3' }}>Hide</div>
                                </div>
                                <div>
                                    {item.content}
                                </div>
                                {item?.lstReplies.map(childItem => {
                                    return (
                                        <div style={{ display: 'flex', paddingTop: 20 }}>
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
                                                <div style={{ display: 'flex' }}>
                                                    <div >{childItem?.userInfo[0]?.firstName}</div>
                                                    <div style={{ fontSize: 12, color: '#8F9BB3', padding: '0 10px' }}>1 min ago</div>
                                                    <div style={{ fontSize: 12, color: '#8F9BB3' }}>Hide</div>
                                                </div>
                                                <div>
                                                    {childItem.content}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div style={{ fontSize: 12, color: '#8F9BB3', paddingTop: 10 }} onClick={e => setCurrentIndex(item.id)}>
                                    Reply
                                </div>
                                <div className={item?.id !== currentIndex && classes.hide}>
                                    <FormControl className={classes.margin}>
                                        <Input
                                            color='secondary'
                                            onChange={handleReply}
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
                                                    <FormControlLabel
                                                        value={timeBase}
                                                        control={<Checkbox color="primary" />}
                                                        label={timeBase}
                                                        labelPlacement="start"
                                                        style={{ color: '#4D2CEC' }}
                                                    />
                                                </InputAdornment>
                                            }
                                            endAdornment={
                                                <InputAdornment position="end" style={{ cursor: 'pointer' }}>
                                                    <div onClick={handleAddReply}><SendCommentIcon /></div>
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

            {/* <Grid item xs={12}>
                <div component="form" className={classes.root}>
                    <IconButton className={classes.iconButton} aria-label="menu">
                    <div className={classes.circleStyle} >
                        <div>P</div>
                    </div>
                    </IconButton>
                    <TextareaAutosize  
                        className={classes.input}
                        placeholder="Search Google Maps"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton color="primary" className={classes.iconButton} aria-label="directions">
                        <DirectionsIcon />
                    </IconButton>
                </div>
            </Grid> */}
        </Grid>

    )
}

export default CommentBox
