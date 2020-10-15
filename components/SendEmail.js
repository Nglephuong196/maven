import { useState, useEffect } from 'react'
import { Grid, Button, TextField, FormGroup, FormControlLabel, Checkbox, DialogTitle, DialogContent, DialogActions, Dialog } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { EditorState, convertToRaw, ContentState, convertFromHTML } from "draft-js";
import { getVideoDetails, saveDraftEmail } from '../redux/actions/index'
import { stateToHTML } from 'draft-js-export-html'
import dynamic from 'next/dynamic'
import AppStyle from '../styles/AppStyle'
import RichEditorExample from '../components/EditorSendEmail'
import useApi from '../customHooks/useApi'
import { useRouter } from 'next/router'
import AttachIcon from '../assets/icons/AttachIcon'
import { Email } from '@material-ui/icons';
import CreateTierIcon from '../assets/icons/CreateTierIcon'

const Editor = dynamic(
    async () => import("react-draft-wysiwyg").then(result => result.Editor),
    {
        ssr: false
    }
)


const SendEmail = () => {
    const router = useRouter()
    const id = parseInt(router.query.id)
    const { getEmailTemplate, sendEmail, saveDraftEmailCustom } = useApi()
    const classes = AppStyle()
    const dispatch = useDispatch()
    const { tierList, token, videoDetails, channel, user } = useSelector(state => ({
        tierList: state.tierReducer.tierList,
        token: state.appReducer.token,
        channel: state.channelReducer.channel,
        videoDetails: state.videoCreatorReducer.videoDetails,
        user: state.profileReducer.user,

    }))
    const [emailDraft, setEmailDraft] = useState({
        videoId: id,
        content: '',
        typeEmail: 'VIDEO_CREATED',
        subject: ''
    })
    const [listTierSendEmail, setListTierSendEmail] = useState([])
    //const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [open, setOpen] = useState(false)
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );
    const [draftEmail, setDraftEmail] = useState()
    const [emailTemplate, setEmailTemplate] = useState()
    const onEditorStateChange = (editorState) => {
        console.log('current content', stateToHTML(editorState.getCurrentContent()))
        setEditorState(editorState)
        setEmailDraft({ ...emailDraft, content: stateToHTML(editorState.getCurrentContent()) })
    };

    const handleSaveDraft = () => {
        dispatch(saveDraftEmail({ draftEmail: emailDraft }))
    }

    const handleCheckTier = (e) => {

        if (!listTierSendEmail.includes(parseInt(e.target.value))) {
            setListTierSendEmail([...listTierSendEmail, parseInt(e.target.value)])
        } else {
            setListTierSendEmail(listTierSendEmail.filter(item => item != e.target.value))
        }
    }

    const handleCheckAllTier = (e) => {
        if (e.target.checked) {
            let temp = tierList.slice(0, 4).map(item => item.id)
            setListTierSendEmail(temp)
        } else {
            setListTierSendEmail([])
        }
    }

    function myFunction() {
        var copyText = document.getElementById("myInput");
        copyText.select();
        copyText.setSelectionRange(0, 99999)
        document.execCommand("copy");
        alert("Copied the text: " + copyText.value);
    }

    const handleSendEmail = async () => {
        const res = await saveDraftEmailCustom(emailDraft)
        if (res.success == true) {
            const msg =  await sendEmail(listTierSendEmail, id, 'CREATED')
        }       
    }

    useEffect(() => {

    }, [listTierSendEmail])

    useEffect(() => {
        if (tierList) {
            setListTierSendEmail(tierList.map(item => item.id))
        }
    }, [tierList])

    useEffect(() => {
        if (token && id && channel) {
            const getCreateVideoTemplate = async () => {
                let emailTemplate = await getEmailTemplate('VIDEO_CREATED')
                setEmailTemplate(emailTemplate)
            }
            getCreateVideoTemplate()
            dispatch(getVideoDetails({ videoId: id, channelId: channel?.id }))
        }
    }, [token, channel])

    useEffect(() => {
        console.log(videoDetails)
    }, [videoDetails])

    useEffect(() => {
        if (emailTemplate && videoDetails) {
            let temp = emailTemplate.content
            let temp1 = temp.replaceAll('<img src="{{channel_logo}}"/>', `<figure><img src=${channel.logoUrl} width="100px" height="100px" /></figure>`)
                .replaceAll('<img src="{{creator_profile_pic}}"/>', `<span><figure><img src=${videoDetails.infoVideo?.urlVideoThumbnail} width="100px" height="100px" /></figure></span>`)
                .replaceAll('{{creator_name}}', `${user.firstName} ${user.lastName}`)
                .replaceAll('{{channel_name}}', channel.name)
                .replaceAll('<img src="{{creator_profile_pic}}"/>', `<figure><img src=${user.urlImage} width="100px" height="100px" /></figure>`)
                .replaceAll('<img src="{{url_video_thumbnail}}"/>', `<figure><img src=${videoDetails.infoVideo?.urlVideoThumbnail} width="100px" height="100px" /></figure>`)
                .replaceAll('{{video_title}}', videoDetails.detailVideo.title)
                .replaceAll('{{video_description}}', videoDetails?.detailVideo?.descriptions)
                .replaceAll('{{creator_first_name}}', user.firstName)
                .replaceAll('{{channel_url}}', `${channel.channelUrl}.${process.env.NEXT_APP_MAIN_DOMAIN}`)
            const blocksFromHTML = convertFromHTML(temp1);
            const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );
            setEditorState(
                () => EditorState.createWithContent(state)
            )
            let subject = emailTemplate.subject
            subject = subject.replaceAll('{{video_title}}', videoDetails.detailVideo.title)
                .replaceAll('{{creator_name}}', `${user.firstName} ${user.lastName}`)
                .replaceAll('{{channel_url}}', `${channel.channelUrl}.${process.env.NEXT_APP_MAIN_DOMAIN}`)
            setEmailDraft({ ...emailDraft, subject: subject, content: temp1 })
        }
    }, [emailTemplate, videoDetails])
    return (
        <Grid container spacing={0} style={{ paddingLeft: 30 }}>
            <Grid item xs={12}>
                <div style={{ fontSize: 22, paddingBottom: 30 }}>Email your users about your latest episode</div>
            </Grid>
            <Grid item xs={9}>
            <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <input style={{ color: 'white', width: '100%', border: 'none', backgroundColor: '#13162C', fontSize: 48, outline: 'none' }} value={emailDraft.subject} onChange={e => setEmailDraft({ ...emailDraft, subject: e.target.value })} />
            </Grid>
            <Grid item xs={6} lg={6} >
                <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <div style={{ backgroundColor: '#1D253E', width: 230, display: 'flex',height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, cursor: 'pointer' }}
                    onClick={myFunction}>
                    <div style={{ margin: 5 }}><AttachIcon /></div>
                    <div style={{ paddingLeft: 5 }}>Copy Video Episode URL</div>
                </div>
                </div>
            </Grid>
            <Grid item xs={12} style={{ backgroundColor: '#13162C' }}>
                <input type="text" id="myInput" style={{ backgroundColor: '#13162C', border: 'none', color: '#13162C' }} value="hellll" disabled></input>
            </Grid>
            <Grid item xs={12}>
                <div style={{ display: 'flex' }}>
                    <div style={{color: '#8F9BB3'}}>Send email to:</div>
                    {tierList.slice(0, 4).filter(item => listTierSendEmail.includes(item.id)).map(item => {
                        return (
                            <div style={{ paddingLeft: 10 }}>{item.name},</div>
                        )
                    })}
                    <div style={{ paddingLeft: 10, cursor: 'pointer' }}
                        onClick={e => setOpen(true)}
                    ><CreateTierIcon /></div>
                </div>
                <Dialog
                    disableBackdropClick
                    disableEscapeKeyDown
                    maxWidth="xs"
                    //onEntering={handleEntering}
                    aria-labelledby="confirmation-dialog-title"
                    open={open}
                    PaperProps={{
                        style: { backgroundColor: '#1D253E', color: 'white', width: 380, height: 350 }
                    }}

                //{...other}
                >
                    <DialogTitle id="confirmation-dialog-title">Send email to</DialogTitle>
                    <DialogContent dividers>
                        <FormControlLabel
                            value="all"
                            control={<Checkbox onChange={handleCheckAllTier} color="primary" />}
                            label="Send email to all tiers"
                            labelPlacement="end"
                        />
                        <FormGroup aria-label="position" style={{ paddingLeft: 40 }}>
                            {tierList.slice(0, 4).map(item => {

                                return (
                                    <FormControlLabel
                                        value={item.id}
                                        control={<Checkbox onChange={handleCheckTier} checked={listTierSendEmail.includes(item.id)} color="primary" />}
                                        label={item.name}
                                        labelPlacement="end"
                                    />
                                )
                            })}
                        </FormGroup>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={e => setOpen(false)} color="primary" style={{ backgroundColor: '#4D2CEC', color: 'white' }}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
            <Grid item xs={12}>
                <div style={{ width: '100%', height: '40vh', overflow: 'auto', border: '1px solid #1D253E', marginTop: 30, backgroundColor: 'white', color: 'black' }}
                    className={classes.scrollbar}>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        toolbar={{
                            inline: { inDropdown: true },
                            list: { inDropdown: true },
                            textAlign: { inDropdown: true },
                            link: { inDropdown: true },
                            emoju: { inDropdown: false },
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded'/*, 'emoji'*/, 'image', 'remove', 'history']
                        }}
                    />
                </div>
            </Grid>
            <Grid item xs={12} style={{}}>
                <Button color="primary" variant="contained" style={{
                    width: '109px', height: '40px', marginTop: 22.5,
                    backgroundColor: 'white',
                    color: '#4D2CEC',
                    whiteSpace: 'nowrap',
                    fontStyle: "normal",
                    padding: 10,
                    fontSize: 14
                }} onClick={handleSaveDraft}>Save Draft</Button>
                <Button color="primary" variant="contained" style={{
                    width: '109px', height: '40px', marginTop: 22.5,
                    backgroundColor: '#4D2CEC',
                    whiteSpace: 'nowrap',
                    marginLeft: 20,
                    fontStyle: "normal",
                    fontSize: 14
                }} onClick={handleSendEmail}>Send Now</Button>

            </Grid>
            </Grid>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    )
}

export default dynamic(() => Promise.resolve(SendEmail), {
    ssr: false
})

