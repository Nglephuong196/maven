
import { useState, useEffect } from "react"
import { useAuth0 } from '@auth0/auth0-react'
import { useDispatch, useSelector } from 'react-redux'
import { getToken, getChannel, getUserProfile, setUserRole, getVideoProgress, checkVideoDuration, setStripeConnectedAccountId } from '../redux/actions/index'
import axios from 'axios';
import { useRouter } from 'next/router'
import { duration } from "moment";


const useApi = (error = false, setError = () => { }) => {
    const router = useRouter()
    const { token } = useSelector(state => ({
        token: state.appReducer.token
    }))
    const [videoId, setVideoId] = useState(0)
    const dispatch = useDispatch()
    const { isAuthenticated, loginWithRedirect, logout, user, getIdTokenClaims } = useAuth0();
    return {
        error,
        setError,
        uploadImage: async (file) => {
            try {

                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/generate-signed-url`
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'image/jpeg'
                    },
                    body: JSON.stringify({
                        fileName: file.name
                    })
                }).catch(err => console.log(err))
                let data = await res.json()
                if (data) {
                    let imgUrl = data.data.fileUrl
                    let uploadUrl = data.data.fileUploadUrl
                    let options = {
                        method: 'PUT',
                        headers: {
                            //Authorization: `Bearer ${token}`,
                            'Content-Type': 'image/jpeg',
                            mode: 'no-cors',
                            'Access-Control-Allow-Origin': 'http://localhost:3000',
                        },
                        body: file
                    }

                    const res = await fetch(uploadUrl, options).catch(err => console.log(err))
                    if (res.status == 200) {
                        return imgUrl
                    }
                    return ''
                }

                //return imgUrl
            }
            catch (error) {
                console.error(error)
            }
        },
        uploadVideo: async (file) => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'video/mp4'
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/generate-signed-url`

                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        "Access-Control-Request-Headers": 'Authorization',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'video/mp4'
                    },
                    body: JSON.stringify({
                        fileName: file.name
                    })
                }).catch(err => console.log(err))
                let data = await res.json()
                if (data) {
                    let imgUrl = data.data.fileUrl
                    let uploadUrl = data.data.fileUploadUrl
                    // let options = {
                    //     method: 'PUT',
                    //     headers: {
                    //         //Authorization: `Bearer ${token}`,
                    //         'Content-Type': 'video/mp4',
                    //         mode: 'no-cors',
                    //         "Access-Control-Request-Headers": 'Authorization',
                    //         'Access-Control-Allow-Origin': 'http://localhost:3000',
                    //     },
                    //     body: file
                    // }
                    const res = axios.request({
                        method: "put",
                        url: uploadUrl,
                        data: file,
                        //headers: headers, 
                        onUploadProgress: (p) => {
                            console.log(p);
                            dispatch(getVideoProgress({
                                fileProgress: p.loaded / p.total
                            }))
                        }
                    }).then(data => {
                        return imgUrl
                    })
                    // const res = await fetch(uploadUrl, options).catch(err => console.log(err))
                    return ''
                }

            }
            catch (error) {
                console.log(error)
            }
        },
        getSessionId: async (priceId) => {
            try {
                let createSessionUrl = `${process.env.NEXT_APP_API_ENDPOINT}/subcriber/create-checkout-session?priceId=${priceId}&successRedirectUrl=http://localhost:3000/checkout-success&cancelRedirectUrl=http://localhost:3000/checkout-cancel`
                let options = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Access-Control-Request-Headers": 'Authorization',
                    },
                }
                let res = await fetch(createSessionUrl, options)
                let data = await res.json()
                if (data) {
                    return data.data.sessionId
                }
                return ""
            }
            catch (error) {
                console.log(error)
            }
        },
        verifyUser: async () => {
            if (isAuthenticated && process.browser) {
                //  CUSTOM CODES
                const token = (await getIdTokenClaims()).__raw
                if (window.location.hostname.length > `${process.env.NEXT_APP_MAIN_DOMAIN}`.length && window.location.href.indexOf('role=creator') == -1 && window.location.href.indexOf(window.localStorage.getItem('Creator')) == -1) {
                    const res = await fetch(`${process.env.NEXT_APP_API_ENDPOINT}/auth/login-subscriber`, {
                        method: "POST",
                        headers: {
                            "Access-Control-Request-Headers": 'Authorization',
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }).catch((err) => {
                        console.log(err)
                    })

                    if (res) {
                        res.json()
                            .then(async (data) => {

                                if (data) {
                                    dispatch(getToken({ token: data.data.token }))

                                } else {
                                    console.log('test1')
                                    await logout({
                                        returnTo: window.location.origin,
                                    });
                                }
                            })
                            .catch(async (err) => {
                                console.log("checkUserFail " + err);
                                await logout({
                                    returnTo: window.location.origin,
                                });
                            });
                    } else {
                        alert('unauthorize')
                        await logout({
                            returnTo: window.location.origin,
                        });
                    }
                } else {
                    const res = await fetch(`${process.env.NEXT_APP_API_ENDPOINT}/auth/login-creator`, {
                        method: "POST",
                        headers: {
                            "Access-Control-Request-Headers": 'Authorization',
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }).catch((err) => {
                        console.log(err)
                    })
                    if (res) {
                        res.json()
                            .then(async (data) => {

                                if (data.success == true) {
                                    dispatch(setStripeConnectedAccountId({stripeConnectedAccountId: data.data.stripeConnectedAccountId}))
                                    dispatch(getToken({ token: data.data.token }))
                                    dispatch(setUserRole({ role: data.data.roleCurrent, channelUrl: data.data.channel?.channelUrl || null }))
                                    if (data.data.channel?.channelUrl && window.location.href.indexOf('role=creator') == -1 || data.data.channel?.channelUrl && localStorage.getItem('Creator') !== 'Creator') {
                                        let temp = 'https://' + data.data.channel.channelUrl + `.${process.env.NEXT_APP_MAIN_DOMAIN}/?role=creator`
                                        if (process.browser) {
                                            // Client-side-only code
                                            window.localStorage.setItem('Creator', data.data.channel.channelUrl)
                                            if (window.location.origin === `https://${process.env.NEXT_APP_MAIN_DOMAIN}` && window.location.pathname !== "/channel-styles/") {
                                                window.location.assign(temp)
                                            }
                                        }

                                    }
                                    //dispatch(getUserProfile({}))
                                    //dispatch(getChannel({}))
                                } else {
                                    alert('unauthorize')
                                    // await logout({
                                    //   returnTo: window.location.origin,
                                    // });
                                }

                            })
                            .catch(async (err) => {
                                console.log("checkUserFail " + err);
                                // await logout({
                                //   returnTo: window.location.origin,
                                // });
                            });
                    } else {
                        console.log('dont get response')
                        // await logout({
                        //     returnTo: window.location.origin,
                        // });
                    }

                }


            }
        },
        decreaseVideoAllocation: async (duration, id) => {
            let allocationUrl = `${process.env.NEXT_APP_API_ENDPOINT}/creator/allocation`
            let options = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Request-Headers": 'Authorization',
                },
                body: JSON.stringify({
                    videoLength: parseInt(duration),
                    videoId: id
                })
            }
            let res = await fetch(allocationUrl, options)
            let data = await res.json()
            console.log(data)
        },
        checkVideoDuration: async () => {
            let getAllocation = `${process.env.NEXT_APP_API_ENDPOINT}/creator/allocation`
            let options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Request-Headers": 'Authorization',
                },
            }
            let res = await fetch(getAllocation, options)
            let data = await res.json()
            if (data.success === true) {
                //return data.data.timeRemainder
                dispatch(checkVideoDuration({ videoDuration: data.data.timeRemainder }))
            }
        },
        exportToCsv: async (channelId) => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/CSV'
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/export-subscriber?channelId=${channelId}&tierId=0&searchText=`
                const res = await fetch(url, {
                    method: 'GET',
                    headers: headers
                })
                const data = res.json()
                console.log(data)
            }
            catch(err) {
                console.log(err)
            }
        },
        uploadPublishVideo: async (videoPublish, videoTranscribe, videoInfo) => {
            try {
                if (videoInfo) {
                    if (!videoTranscribe) {
                        videoTranscribe = videoPublish
                    }
                    let videoIdImp = videoInfo.id
                    let fileVideoUrl = videoInfo.fileVideo.fileUploadUrl
                    let url1  = videoInfo.fileVideo.fileUrl
                    let fileVideoNoMusicUrl = videoInfo.fileVideoNoMusic.fileUploadUrl
                    let url2 = videoInfo.fileVideoNoMusic.fileUrl
                    const res = await fetch(fileVideoUrl, {
                        method: 'PUT',
                        headers: {
                            //Authorization: `Bearer ${token}`,
                            'Content-Type': 'video/mp4',
                            mode: 'no-cors',
                            "Access-Control-Request-Headers": 'Authorization',
                            'Access-Control-Allow-Origin': 'http://localhost:3000',
                        },
                        body: videoPublish
                    }).catch(err => console.log(err))
                    const res2 = await fetch(fileVideoNoMusicUrl, {
                        method: 'PUT',
                        headers: {
                            //Authorization: `Bearer ${token}`,
                            'Content-Type': 'video/mp4',
                            mode: 'no-cors',
                            "Access-Control-Request-Headers": 'Authorization',
                            'Access-Control-Allow-Origin': 'http://localhost:3000',
                        },
                        body: videoTranscribe
                    }).catch(err => console.log(err))
                    if (res.status == 200 && res2.status == 200) {
                        let url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/video/transcribe`
                        const res3 = await fetch(url, {
                            method: 'POST',
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                                //mode: 'no-cors',
                                //"Access-Control-Request-Headers": 'Authorization',
                                //'Access-Control-Allow-Origin': 'http://localhost:3000',
                            },
                            body: JSON.stringify({
                                urlVideo: url1,
                                urlVideoNoMusic: url2,
                                videoId: videoIdImp
                            })
                        }).catch(err => console.log(err))
                        if (res3.status === 200) {
                            return videoIdImp
                        }
                    }
                }

            }
            catch (error) {
                console.log(error)
            }
        },
        createVideo: async (videoPublish, videoTranscribe, duration, title, description) => {
            try {
                if (!videoTranscribe) {
                    videoTranscribe = videoPublish
                }
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'video/mp4'
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/video/create-video`

                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        "Access-Control-Request-Headers": 'Authorization',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'video/mp4'
                    },
                    body: JSON.stringify({
                        videoName: videoPublish.name,
                        noMusicVideoName: videoTranscribe.name,
                        duration: duration,
                        descriptions: description,
                        title: title
                    })
                }).catch(err => console.log(err))
                let data = await res.json()
                if (data.success == true) {
                    return data.data
                }
                return null
            }
            catch (error) {
                console.log(error)
            }
        },
        createStripeConnectedAccount: async () => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/stripe/connect-payout`

                const res = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                }).catch(err => console.log(err))
                let data = await res.json()
                
                if (data.success == true) {
                    return data.data.accountLinkURL
                }
                return null
            }
            catch (error) {
                console.log(error)
            }
        },
        getLinkDashboard: async () => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/stripe/get-link-connected`
                const res = await fetch(url, {
                    method: 'GET',
                    headers: headers,
                }).catch(err => console.log(err))
                let data = await res.json()
                
                if (data.success == true) {
                    return data.data.url
                }
                return null
            }
            catch (error) {
                console.log(error)
            }
        },
        sendEmail: async (tierIds, videoId, type) => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/email/send-email-custom`
                const body = JSON.stringify({
                    tierIds: tierIds,
                    videoId: videoId,
                    type: type
                })
                const res = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: body
                }).catch(err => console.log(err))
                let data = await res.json()
                console.log(data)
                // if (data.success == true) {
                //     return data.data.url
                // }
                // return null
            }
            catch (error) {
                console.log(error)
            }
        },
        saveDraftEmailCustom: async (draftEmail) => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/email/save-draft-email`
                const body = JSON.stringify({
                    searchId: draftEmail.videoId,
                    typeEmail: draftEmail.typeEmail,
                    content: draftEmail.content,
                    subject: draftEmail.subject
                  })
                const res = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: body
                }).catch(err => console.log(err))
                let data = await res.json()
                return data
                // if (data.success == true) {
                //     return data.data.url
                // }
                // return null
            }
            catch (error) {
                console.log(error)
            }
        },
        getEmailTemplate: async (emailType) => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/get-email-template/${emailType}`
                const res = await fetch(url, {method: 'GET', headers})
                const data = await res.json()
                if (data.success == true) {
                    return data.data
                }
                return ''
            }
            catch (error) {
                console.log(error)
            }
        },
        getDraftEmail: async (emailId) => {
            try {
                const headers = {
                    "Access-Control-Request-Headers": 'Authorization',
                    Authorization: `Bearer ${token}`,
                }
                const url = `${process.env.NEXT_APP_API_ENDPOINT}/creator/email/${emailId}`
                const res = await fetch(url, headers)
                console.log(res)
                return 'abc'
            }
            catch (error) {
                console.log(error)
            }
        }
    }
}

export default useApi
