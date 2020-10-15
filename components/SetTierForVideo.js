import { Grid, Checkbox, Radio, RadioGroup, FormControlLabel, Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import {setTierVideo} from '../redux/actions/index'
import LoadingOverlay from 'react-loading-overlay'
import {useRouter} from 'next/router'

const SetTierForVideo = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const { tiers, isSetTierRequesting } = useSelector(state => ({
        tiers: state.tierReducer.tierList,
        isSetTierRequesting: state.videoCreatorReducer.isSetTierRequesting
    }))
    const [sendEmail, setSendEmail] = useState(false)
    const [value, setValue] = React.useState('Off');
    const [tierSetting, setTierSetting] = useState({
        tierIds : [],
        isShared: 0,
        videoId: 15,
        tierSendEmailIds: []
    })
    const handleContinue = () => {
        dispatch(setTierVideo({tierSetting: tierSetting}))
        if (sendEmail === true) {
            router.push('/send-email')
        } else {
            router.push('/video-management')
        }
         
    }

    const chooseSendEmailTiers = (e) => {
        if (e.target.checked == true) {
            let temp =[]
            for (let i of tierSetting.tierSendEmailIds) {
                temp.push(i)
            }
            temp.push(e.target.value)
            setTierSetting({...tierSetting, tierSendEmailIds: temp})
        } else {
            let temp =[]
            for (let i of tierSetting.tierSendEmailIds) {
                temp.push(i)
            }
            temp = temp.filter(item => item !== e.target.value)
            setTierSetting({...tierSetting, tierSendEmailIds: temp})
        }
    }

    const changeShareStatus = (e) => {
        setTierSetting({...tierSetting, isShared: parseInt(e.target.value)})

    };
    const chooseTiers = (e) => {
        if (e.target.checked == true) {
            let temp =[]
            for (let i of tierSetting.tierIds) {
                temp.push(i)
            }
            temp.push(e.target.value)
            setTierSetting({...tierSetting, tierIds: temp})
        } else {
            let temp =[]
            for (let i of tierSetting.tierIds) {
                temp.push(i)
            }
            temp = temp.filter(item => item !== e.target.value)
            setTierSetting({...tierSetting, tierIds: temp})
        }
    }
    useEffect(() => {
        
    }, [tiers, isSetTierRequesting])
    useEffect(() => {
       
    }, [tierSetting.tierSendEmailIds])
    return (
    <LoadingOverlay active={isSetTierRequesting} spinner>
        <Grid container spacing={1} style={{ marginLeft: 30 }}>
            <Grid item xs={12} style={{marginBottom: 30}}>
                <div style={{ fontSize: 32, fontWeight: 'bold' }}>Start creating your contents</div>
            </Grid>
            <Grid item xs={12}>
                <div>Video’s visibility</div>
            </Grid>
            <Grid item xs={12}>
            {tiers.slice(0, 4).map(item => {
                return (
                    <div key={item.id}>
                        <Checkbox id={item.id.toString()} value={item.id} onChange={chooseTiers} />
                        <label htmlFor={item.id}>{item.name}</label>
                    </div>
                )
            })}
            </Grid>
            
            <Grid item xs={12}>
                <div>Share</div>

            </Grid>
            <Grid item xs={12}>
                <RadioGroup aria-label="gender" name="gender1" value={tierSetting.isShared.toString()} onChange={changeShareStatus}>
                    <FormControlLabel value='0' control={<Radio />} label="Off" />
                    <FormControlLabel value='1' control={<Radio />} label="Users can share clips" />
                </RadioGroup>
            </Grid>
            <Grid item xs={12}>
                <div>Email option</div>

            </Grid>
            <Grid item xs={12}>
                <Grid item xs={12}>
                <div>
                    <Checkbox id='all' checked={sendEmail} onChange={e => setSendEmail(!sendEmail)} />
                    <label htmlFor='all'>Send email to users</label>
                </div>
            </Grid>
            <Grid item xs={12}>
                <div style={{ paddingLeft: 20 }}>
                    <Checkbox id='Followers' />
                    <label htmlFor="Followers">Followers</label>
                </div>
            </Grid>
            {tiers.slice(0, 3).map(item => {
                return (
                    <Grid item xs={12} key={item.id}>
                        <div style={{ paddingLeft: 20 }}>
                            <Checkbox id={item.id.toString()} value={item.id} onChange={chooseSendEmailTiers} />
                            <label htmlFor={item.id}>{item.name}</label>
                        </div>
                    </Grid>
                )
            })}
            </Grid>
            <Grid item xs={12} style={{  }}>
                        <Button color="secondary" variant="contained" style={{
                            width: '109px', height: '40px', marginTop: 22.5,
                            fontStyle: "normal",
                            fontSize: 14,
                            color: '#FFFFFF',
                            backgroundColor: '#4D2CEC'
                        }} onClick={handleContinue} >Continue</Button>
                    </Grid>
        </Grid>
        </LoadingOverlay>
    )
}

export default SetTierForVideo
