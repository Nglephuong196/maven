import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ColorPicker from 'material-ui-color-picker'
import { Player, ControlBar } from 'video-react';
import PenIcon from '../assets/icons/PenIcon'
import { makeStyles, TextareaAutosize, Button, TextField, Grid, Tooltip, FormControl, Select, InputLabel, MenuItem, Popover } from "@material-ui/core";
import { getChannel, updateChannel, createChannel, changeChannelStatus } from '../redux/actions/index'
import useApi from '../customHooks/useApi'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import InfomationIcon from '../assets/icons/InfomationIcon'
import CopiedChannelUrlIcon from '../assets/icons/CopiedChannelUrlIcon'
import CopiedIcon from '../assets/icons/CopiedIcon'

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        width: '100%',
        paddingRight: 10
    },
    customWidth: {
        maxWidth: 185,
        backgroundColor: 'black'
    },
    circleStyle: {
        //paddingTop: 100,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#919191',
        borderRadius: "50%",
        width: 160,
        height: 160,
        textAlign: 'center',
        fontSize: 44,
        margin: '0 auto'
    },
    player: {
        color: props => props.color
    },
}))

const USstates = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District Of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
const CanadianProvinces = ['Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon']

const EditChannel = () => {
    const dispatch = useDispatch()
    const { createStripeConnectedAccount, uploadImage, getLinkDashboard } = useApi()
    const [editMode, setEditMode] = useState(false)
    const [alchorEl, setAnchorEl] = useState()
    const open = Boolean(alchorEl)
    const { channel, channelCreated, stripeConnectedAccountId } = useSelector(state => ({
        channel: state.channelReducer.channel,
        channelCreated: state.channelReducer.channelCreated,
        stripeConnectedAccountId: state.appReducer.stripeConnectedAccountId
    }))
    // const [channelStyle, setChannelStyle] = useState({
    //     color: channel?.setting?.color,
    //     colorAccent: channel?.setting?.colorAccent
    // })
    const [channelInfo, setChannelInfo] = useState({
        name: '',
        description: '',
        color: '',
        colorAccent: '',
        logo: ''
    })
    const [listState, setListState] = useState()
    const [postalAddress, setPostalAddress] = useState({
        street: null,
        city: null,
        country: null,
        state: null,
        zipCode: null
    })
    const [channelInfoOpen, setChannelInfoOpen] = useState(true)
    const [stripeAccountOpen, setStripeAccountOpen] = useState(true)
    const [videoThemeOpen, setVideoThemeOpen] = useState(true)
    const [postalAddressOpen, setPostalAddressOpen] = useState(true)
    const classes = useStyles({ color: channelInfo?.color })
    const player = useRef()
    const test = useRef()
    const test1 = useRef()
    const [zipCodeError, setZipCodeError] = useState(false)

    const checkCanadaCode = (code) => {
        if (code) {
            var expression = /[A-Za-z]\d[A-Za-z] +\d[A-Za-z]\d/;
            var regex = new RegExp(expression);
            if (code.match(regex)) {
                return false
            } else {
                return true
            }
        }
        return false
    }
    const handleCountryChange = (e) => {
        setPostalAddress({ ...postalAddress, country: e.target.value, state: null })
        switch (e.target.value) {
            case 'USA':
                setListState(USstates)
                break
            case 'Canada':
                setListState(CanadianProvinces)
                break
            default:
                setListState()
        }
    }

    const createConnectedAccount = async () => {
        const connectedUrl = await createStripeConnectedAccount()
        if (connectedUrl) {
            window.location.assign(connectedUrl)
        }
    }

    const handleCopyChannelUrl = (e) => {
        var copyText = document.getElementById("channelUrl");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");

        /* Alert the copied text */
        setAnchorEl(e.currentTarget)
    }

    useEffect(() => {
        if (test.current && test1.current) {
            test.current.style.backgroundColor = channelInfo?.color
            test1.current.style.backgroundColor = channelInfo?.colorAccent
        }
    }, [channelInfo, editMode])
    useEffect(() => {
        if (channel) {
            setChannelInfo({
                name: channel.name,
                description: channel.description,
                color: channel.setting?.color,
                colorAccent: channel.setting?.colorAccent,
                logo: channel?.logoUrl
            })
            setPostalAddress({
                street: channel.postalAddress?.street,
                city: channel.postalAddress?.city,
                country: channel.postalAddress?.country,
                state: channel.postalAddress?.state,
                zipCode: channel.postalAddress?.zipCode
            })
            switch (channel.postalAddress?.country) {
                case 'USA':
                    setListState(USstates)
                    break
                case 'Canada':
                    setListState(CanadianProvinces)
                    break
                default:
                    setListState()
            }
        }
        console.log(stripeConnectedAccountId)
    }, [channel])

    const handleUploadImage = async (e) => {
        let file = e.target.files[0]
        if (file) {
            const fileUrl = await uploadImage(file)
            if (fileUrl) {
                setChannelInfo({ ...channelInfo, logo: fileUrl })
            }
        } else {
            setChannelInfo({ ...channelInfo, logo: "" })
        }
    }

    const handleSave = () => {
        //setEditMode(false)
        dispatch(updateChannel({ channelInfo, postalAddress }))
    }
    const handleGetLinkDashboard = async () => {
        const dashboardLink = await getLinkDashboard()
        if (dashboardLink) {
            window.location.assign(dashboardLink)
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <div style={{ fontSize: 48, textAlign: 'center' }}>Channel's Settings</div>
            </Grid>
            <Grid item xs={3}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className={classes.circleStyle} >
                        {channelInfo?.logo ? (
                            <img style={{
                                borderRadius: "50%",
                                width: 160,
                                height: 160,
                            }} src={channelInfo.logo} />
                        ) : (
                                <p>P</p>
                            )}
                    </div>
                    {editMode && (
                        <div style={{ paddingTop: 50, color: '#6647FF' }}>
                            <label htmlFor="change-photo" style={{ cursor: 'pointer' }}>CHANGE PHOTO</label>
                            <input id='change-photo' accept="image/*"
                                style={{ display: 'none' }}
                                type="file"
                                onChange={handleUploadImage}></input>
                        </div>
                    )}

                </div>
            </Grid>
            <Grid item xs={6}>
                {editMode ? (
                    <Grid container spacing={0}>
                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 16 }}>CHANNEL'S INFO</div>
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>Channel Name</div>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField variant="outlined" color="secondary" style={{ width: '100%' }}
                                value={channelInfo.name}
                                inputProps={{ maxLength: 70 }}
                                onChange={e => setChannelInfo({ ...channelInfo, name: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>Public Description</div>
                        </Grid>
                        <Grid item xs={8} style={{ marginTop: 20 }}>
                            <TextareaAutosize variant="outlined" color="secondary" style={{ width: '100%' }}
                                rows={3}
                                maxLength={280}
                                value={channelInfo.description}
                                onChange={e => setChannelInfo({ ...channelInfo, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                            <div>Channel URL</div>
                        </Grid>
                        <Grid item xs={8} style={{ marginTop: 20 }}>
                            <TextField variant="outlined" color="secondary" style={{ width: '100%' }}
                                value={`${channel?.channelUrl}.${process.env.NEXT_APP_MAIN_DOMAIN}`}
                            />
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: 20 }}>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: 16 }}>STRIPE’S ACCOUNT & PAYMENTS</div>
                                    <div>
                                        <Tooltip arrow title="Connect your bank account with Stripe so you can receive your subscription revenue. Learn more" placement="right"
                                            classes={{ tooltip: classes.customWidth }}>
                                            <Button><InfomationIcon /></Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', cursor: 'pointer', background: 'linear-gradient(180deg, #78C2EA 0%, #2C9BDF 100%)', height: 40, width: 'fit-content', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10 }}
                                    onClick={createConnectedAccount}>
                                    <div style={{ fontSize: 24, paddingRight: 20 }}>S</div>
                                    <div>Connect with Stripe</div>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} style={{ marginTop: 20 }}>
                            <Grid item xs={12}>
                                <div style={{ fontSize: 16 }}>VIDEO THEME</div>
                            </Grid>
                            <Grid item xs={3}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ColorPicker
                                        name='Color'

                                        style={{ width: '100px' }}
                                        inputRef={test}
                                        InputLabelProps={{
                                            style: {
                                                color: channelInfo?.color,
                                                display: 'none'
                                            }
                                        }}
                                        inputProps={{
                                            style: {
                                                margin: 5
                                            }
                                        }}
                                        value={channelInfo?.color}
                                        onChange={color => {
                                            setChannelInfo({ ...channelInfo, color: color })
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
                            <Grid item xs={3}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ColorPicker
                                        name='Color'

                                        style={{ width: '100px' }}
                                        inputRef={test1}
                                        InputLabelProps={{
                                            style: {
                                                color: channelInfo?.colorAccent,
                                                display: 'none'
                                            }
                                        }}
                                        inputProps={{
                                            style: {
                                                margin: 5
                                            }
                                        }}
                                        value={channelInfo?.colorAccent}
                                        onChange={color => {
                                            setChannelInfo({ ...channelInfo, colorAccent: color })
                                            test1.current.style.backgroundColor = color
                                        }}
                                        variant="outlined"

                                    />
                                    <p style={{ fontSize: 10, color: '#8F9BB3' }}>Accent</p>
                                </div>
                            </Grid>

                            <Grid item xs={5}></Grid>

                            <Grid item xs={12} style={{ alignSelf: 'center' }}>
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
                        </Grid>
                        <Grid container spacing={2} style={{ paddingTop: 40 }}>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: 16 }}>POSTAL ADDRESS</div>
                                    <div>
                                        <Tooltip arrow title="Mandatory to send emails to your subscribers and visibile to recipients. Learn more" placement="right"
                                            classes={{ tooltip: classes.customWidth }}>
                                            <Button><InfomationIcon /></Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ fontSize: 10, color: '#8F9BB3' }}>(Mandatory to send emails to your subscribers and visibile to recipients. <span style={{ color: '#4D2CEC' }}>Learn more</span>)</div>
                            </Grid>
                            <Grid container spacing={0} style={{ marginTop: 20 }}>
                                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: '#8F9BB3' }}>Street</div>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField variant="outlined" color="secondary" style={{ width: '100%' }}
                                        value={postalAddress.street}
                                        onChange={e => setPostalAddress({ ...postalAddress, street: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} style={{ marginTop: 20 }}>
                                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: '#8F9BB3' }}>City</div>
                                </Grid>
                                <Grid item xs={8}>
                                    <TextField variant="outlined" color="secondary" style={{ width: '100%' }}
                                        value={postalAddress.city}
                                        onChange={e => setPostalAddress({ ...postalAddress, city: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} style={{ marginTop: 20 }}>
                                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ color: '#8F9BB3' }}>Country | State/Province</div>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="Country">Country</InputLabel>
                                        <Select
                                            labelId="Country"
                                            id="Country"
                                            label="Country"
                                            value={postalAddress.country}
                                            onChange={handleCountryChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={'USA'}>USA</MenuItem>
                                            <MenuItem value={'Canada'}>Canada</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="Province">State/Province</InputLabel>
                                        <Select
                                            labelId="Province"
                                            id="Province"
                                            label="Province"
                                            value={postalAddress.state}
                                            onChange={e => setPostalAddress({ ...postalAddress, state: e.target.value })}
                                        >
                                            {listState?.map(item => {
                                                return (
                                                    <MenuItem value={item}>{item}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {postalAddress?.country == "USA" && (
                                <Grid container spacing={0} style={{ marginTop: 20 }}>
                                    <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ color: '#8F9BB3' }}>Zip code</div>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField variant="outlined" color="secondary" style={{ width: '50%' }}
                                            inputProps={{ maxLength: 5 }}
                                            value={postalAddress.zipCode}
                                            onChange={e => setPostalAddress({ ...postalAddress, zipCode: e.target.value })}
                                        ></TextField>
                                    </Grid>
                                </Grid>
                            )}
                            {postalAddress?.country == "Canada" && (
                                <Grid container spacing={0} style={{ marginTop: 20 }}>
                                    <Grid item xs={4} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{ color: '#8F9BB3' }}>Zip code</div>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <TextField variant="outlined" color="secondary" style={{ width: '50%' }}
                                            value={postalAddress.zipCode}
                                            onChange={e => {
                                                setZipCodeError(checkCanadaCode(e.target.value))
                                                setPostalAddress({ ...postalAddress, zipCode: e.target.value })
                                            }}
                                        ></TextField>
                                        {zipCodeError && (
                                            <div style={{ color: 'red', paddingTop: 10 }}>Zip Code is not valid</div>
                                        )}
                                    </Grid>

                                </Grid>
                            )}

                        </Grid>
                    </Grid>
                ) : (
                        <Grid container spacing={0}>
                            <Grid container spacing={0}>
                                <Grid item xs={11}>
                                    {channelInfoOpen ? (
                                        <Grid container spacing={2} >
                                            <Grid item xs={12}>
                                                <div style={{ fontSize: 16 }}>CHANNEL'S INFO</div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div style={{ display: 'flex', borderBottom: '1px solid #272E49', padding: '10px 10px' }}>
                                                    <div style={{ flex: 1 }}>Channel Name</div>
                                                    <div style={{ flex: 2 }}>{channel?.name}</div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div style={{ display: 'flex', borderBottom: '1px solid #272E49', padding: '10px 10px' }}>
                                                    <div style={{ flex: 1 }}>Public Description</div>
                                                    <div style={{ flex: 2 }}>{channel?.description}</div>
                                                </div>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <div style={{ display: 'flex', padding: '0px 10px', alignItems: 'center' }}>
                                                    <div style={{ flex: 1 }}>Channel URL</div>
                                                    <div style={{ flex: 2 }}>
                                                        <input id='channelUrl' value={`${channel?.channelUrl}.${process.env.NEXT_APP_MAIN_DOMAIN}`} onChange={e => { }}
                                                            style={{ backgroundColor: '#13162C', color: 'white', border: 'none' }} 
                                                        >
                                                        </input>
                                                    </div>
                                                    <div style={{ cursor: 'pointer' }} onClick={e => handleCopyChannelUrl(e)}><CopiedChannelUrlIcon /></div>
                                                 </div>
                                                <Popover
                                                    anchorOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'right',
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'center',
                                                        horizontal: 'left',
                                                    }}
                                                    open={open}
                                                    alchorEl={alchorEl}
                                                    onClose={e => setAnchorEl()}
                                                >
                                                    <div style={{width: 400, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor:'#272E49'}}>
                                                    <div style={{paddingLeft: 50, color: 'white'}}>URL  was copied</div>
                                                    <div style={{paddingRight: 30, color: '#8F9BB3', cursor: 'pointer'}} 
                                                    onClick={e => setAnchorEl()}
                                                    >x</div>
                                                    </div>
                                                </Popover>
                                            </Grid>
                                        </Grid >
                                    ) : (
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <div style={{ fontSize: 16 }}>CHANNEL'S INFO</div>
                                                </Grid>
                                            </Grid>
                                        )}
                                </Grid>
                                <Grid item xs={1}>
                                    {/* {channelInfoOpen ? (
                                        <div onClick={e => setChannelInfoOpen(false)}>
                                            <ArrowDropDownIcon />
                                        </div>
                                    ) : (
                                            <div onClick={e => setChannelInfoOpen(true)}>
                                                <ArrowRightIcon />
                                            </div>
                                        )} */}
                                </Grid>
                            </Grid>
                            <Grid container spacing={0} style={{ paddingTop: 40 }}>
                                <Grid item xs={11}>
                                    {stripeAccountOpen ? (
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div style={{ fontSize: 16 }}>STRIPE’S ACCOUNT & PAYMENTS</div>
                                                    <div>
                                                        <Tooltip arrow title="Connect your bank account with Stripe so you can receive your subscription revenue. Learn more" placement="right"
                                                            classes={{ tooltip: classes.customWidth }}>
                                                            <Button><InfomationIcon /></Button>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </Grid>
                                            {stripeConnectedAccountId ? (
                                                <Grid item xs={12}>
                                                <div style={{ display: 'flex', cursor: 'pointer', background: 'linear-gradient(180deg, #78C2EA 0%, #2C9BDF 100%)', height: 40, width: 'fit-content', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10 }}
                                                    onClick={handleGetLinkDashboard}>
                                                    <div style={{ fontSize: 24, paddingRight: 20 }}>S</div>
                                                    <div>Access your dashboard</div>
                                                </div>
                                            </Grid>
                                            ) : (
                                                <Grid item xs={12}>
                                                <div style={{ display: 'flex', cursor: 'pointer', background: 'linear-gradient(180deg, #78C2EA 0%, #2C9BDF 100%)', height: 40, width: 'fit-content', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 10 }}
                                                    onClick={createConnectedAccount}>
                                                    <div style={{ fontSize: 24, paddingRight: 20 }}>S</div>
                                                    <div>Connect with Stripe</div>
                                                </div>
                                            </Grid>
                                            )}
                                            
                                        </Grid>
                                    ) : (
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <div style={{ fontSize: 16 }}>STRIPE’S ACCOUNT & PAYMENTS</div>
                                                </Grid>

                                            </Grid>
                                        )}
                                </Grid>
                                <Grid item xs={1}>
                                    {/* {stripeAccountOpen ? (
                                        <div onClick={e => setStripeAccountOpen(false)}>
                                            <ArrowDropDownIcon />
                                        </div>
                                    ) : (
                                            <div onClick={e => setStripeAccountOpen(true)}>
                                                <ArrowRightIcon />
                                            </div>
                                        )} */}
                                </Grid>
                            </Grid>

            <Grid container spacing={0} style={{ paddingTop: 40 }}>
                <Grid item xs={11}>
                    {videoThemeOpen ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div style={{ fontSize: 16 }}>VIDEO'THEME</div>
                            </Grid>
                            <Grid item xs={3}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ColorPicker
                                        name='Color'

                                        style={{ width: '100px' }}
                                        inputRef={test}
                                        InputLabelProps={{
                                            style: {
                                                color: channelInfo.color,
                                                display: 'none'
                                            }
                                        }}
                                        inputProps={{
                                            style: {
                                                margin: 5
                                            }
                                        }}
                                        value={channelInfo.color}
                                        onChange={color => {
                                            setChannelInfo({ ...channelInfo, color: color })
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
                            <Grid item xs={3}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <ColorPicker
                                        name='Color'

                                        style={{ width: '100px' }}
                                        inputRef={test1}
                                        InputLabelProps={{
                                            style: {
                                                color: channelInfo.colorAccent,
                                                display: 'none'
                                            }
                                        }}
                                        inputProps={{
                                            style: {
                                                margin: 5
                                            }
                                        }}
                                        value={channelInfo.colorAccent}
                                        onChange={color => {
                                            setChannelInfo({ ...channelInfo, colorAccent: color })
                                            test1.current.style.backgroundColor = color
                                        }}
                                        variant="outlined"
                                    />
                                    <p style={{ fontSize: 10, color: '#8F9BB3' }}>Accent</p>
                                </div>
                            </Grid>
                            <Grid item xs={5}></Grid>
                            <Grid item xs={12} style={{ alignSelf: 'center' }}>
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
                        </Grid>
                    ) : (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div style={{ fontSize: 16 }}>VIDEO'THEME</div>
                                </Grid>
                            </Grid>
                        )}
                </Grid>
                <Grid item xs={1}>
                    {/* {videoThemeOpen ? (
                                        <div onClick={e => setVideoThemeOpen(false)}>
                                            <ArrowDropDownIcon />
                                        </div>
                                    ) : (
                                            <div onClick={e => setVideoThemeOpen(true)}>
                                                <ArrowRightIcon />
                                            </div>
                                        )} */}
                </Grid>
            </Grid>
            <Grid container spacing={0} style={{ paddingTop: 40 }}>
                <Grid item xs={11}>
                    {postalAddressOpen ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ fontSize: 16 }}>POSTAL ADDRESS</div>
                                    <div>
                                        <Tooltip arrow title="Mandatory to send emails to your subscribers and visibile to recipients. Learn more" placement="right"
                                            classes={{ tooltip: classes.customWidth }}>
                                            <Button><InfomationIcon /></Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ fontSize: 10, color: '#8F9BB3' }}>(Mandatory to send emails to your subscribers and visibile to recipients. <span style={{ color: '#4D2CEC' }}>Learn more</span>)</div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #272E49', padding: '10px 10px' }}>
                                    <div style={{ flex: 1, color: '#8F9BB3' }}>Address line #1</div>
                                    <div style={{ flex: 2 }}>{channel?.postalAddress?.street} {channel?.postalAddress?.city}, {channel?.postalAddress?.state}, {channel?.postalAddress?.country}</div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div style={{ display: 'flex', borderBottom: '1px solid #272E49', padding: '10px 10px' }}>
                                    <div style={{ flex: 1, color: '#8F9BB3' }}>Zip Code</div>
                                    <div style={{ flex: 2 }}>{channel?.postalAddress?.zipCode}</div>
                                </div>
                            </Grid>
                        </Grid>
                    ) : (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div style={{ fontSize: 16 }}>POSTAL ADDRESS</div>
                                </Grid>
                            </Grid>
                        )}
                </Grid>
                <Grid item xs={1}>
                    {/* {postalAddressOpen ? (
                                        <div onClick={e => setPostalAddressOpen(false)}>
                                            <ArrowDropDownIcon />
                                        </div>
                                    ) : (
                                            <div onClick={e => setPostalAddressOpen(true)}>
                                                <ArrowRightIcon />
                                            </div>
                                        )} */}
                </Grid>
            </Grid>
        </Grid>


    )
}

{
    !editMode ? (
        <Grid container spacing={0}>
            <Grid item xs={6}>
            </Grid>
            <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button color="primary" variant="contained" style={{
                    width: '170px', height: '40px',
                    fontStyle: "normal",
                    fontSize: 13,
                    marginTop: 30,
                    backgroundColor: '#4D2CEC'
                }} onClick={e => setEditMode(true)}><PenIcon />  <span style={{ paddingLeft: 5 }}>Edit Channel</span></Button>
            </Grid>

        </Grid>
    ) : (
            <Grid container spacing={0} style={{ marginTop: 20 }}>
                <Grid item xs={3}></Grid>
                <Grid item xs={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ cursor: 'pointer' }} onClick={e => setEditMode(false)}>
                        DISCARD
                    </div>
                </Grid>
                <Grid item xs={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button color="primary" variant="contained" style={{
                        width: '150px', height: '40px',
                        fontStyle: "normal",
                        fontSize: 13,
                        backgroundColor: '#4D2CEC'
                    }} onClick={handleSave}
                        disabled={channelInfo.name == "" || channelInfo.description == ""}
                    >Save changes</Button>
                </Grid>

            </Grid>
        )
}
            </Grid >
        </Grid >
    )
}

export default EditChannel
