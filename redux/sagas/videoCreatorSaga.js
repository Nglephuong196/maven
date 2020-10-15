import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';
import { getVideoCreator } from '../actions/index'

function* videoCreatorWatcher() {
    yield takeLatest(constants.SET_TIER_VIDEO_REQUEST, withCallback(setTierVideoWorker))
    yield takeLatest(constants.GET_CREATOR_VIDEO_REQUEST, withCallback(getCreatorVideoWorker))
    yield takeLatest(constants.UPDATE_TIER_FOR_VIDEO_REQUEST, withCallback(updateTierForVideoWorker))
    yield takeLatest(constants.GET_VIDEO_DETAILS_REQUEST, withCallback(getVideoDetailsWorker))
    yield takeLatest(constants.PUBLISH_VIDEO_REQUEST, withCallback(publishVideoWorker))
}

function * publishVideoWorker(action) {
    const state = yield select()
    try {
        //const response = yield call(publishVideo, action.videoId, action.channelId, state.appReducer.token)
        const response = yield call(updateTierForVideo, action.tierSetting, state.appReducer.token)
        if (response.success === true) {
            const publishResponse = yield call(publishVideo, action.tierSetting.videoId, state.appReducer.token)
            if (publishResponse.success === true) {
                yield put({ type: constants.PUBLISH_VIDEO_SUCCESS }) 
                yield put(getVideoCreator({channelId: state.channelReducer.channel.id}))
            } else {
                yield put({ type: constants.PUBLISH_VIDEO_ERROR })
            }
        } else {
            yield put({ type: constants.PUBLISH_VIDEO_ERROR })
        }

    } catch (err) {
        yield put({ type: constants.PUBLISH_VIDEO_ERROR })
    }
}

function publishVideo(videoId, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/video/${videoId}/publish`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'publish'
        })
    })
        .then(response => response.json())
        .catch((error) => { throw error })
}

function * getVideoDetailsWorker(action) {
    const state = yield select()
    try {
        const response = yield call(getVideoDetails, action.videoId, action.channelId, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.GET_VIDEO_DETAILS_SUCCESS, data: response.data})
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        } else {
            yield put({ type: constants.GET_VIDEO_DETAILS_ERROR })
           //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        }

    } catch (err) {
        yield put({ type: constants.GET_VIDEO_DETAILS_ERROR })
    }
}

function getVideoDetails(videoId,channelId, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/video/${videoId}?channelId=${channelId}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .catch((error) => { throw error })
}

function * updateTierForVideoWorker(action) {
    const state = yield select()
    try {
        const response = yield call(updateTierForVideo, action.tierSetting, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.UPDATE_TIER_FOR_VIDEO_SUCCESS})
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        } else {
            yield put({ type: constants.UPDATE_TIER_FOR_VIDEO_ERROR })
           //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        }

    } catch (err) {
        yield put({ type: constants.UPDATE_TIER_FOR_VIDEO_ERROR })
    }
}

function updateTierForVideo(tierSetting, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/video/${tierSetting.videoId}`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            //videoId: tierSetting.videoId,
            removeTiers: tierSetting.removeTiers,
            addTiers: tierSetting.addTiers,
            infoVideo: {
                title: tierSetting.title,
                descriptions: tierSetting.description
            }
            //isShared: tierSetting.isShared
        }),
    })
        .then(response => response.json())
        .catch((error) => { throw error })
}

function * getCreatorVideoWorker(action) {
    const state = yield select()
    try {
        const response = yield call(getCreatorVideo, action.channelId, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.GET_CREATOR_VIDEO_SUCCESS, data: response.data})
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        } else {
            yield put({ type: constants.GET_CREATOR_VIDEO_ERROR })
            yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        }

    } catch (err) {
        yield put({ type: constants.GET_CREATOR_VIDEO_ERROR })
    }
}

function* setTierVideoWorker(action) {

    const state = yield select();
    try {
        const response = yield call(setTierVideo, action.tierSetting, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.SET_TIER_VIDEO_SUCCESS})
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        } else {
            yield put({ type: constants.SET_TIER_VIDEO_SUCCESS })
            yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        }
    } catch (error) {
        yield put({ type: constants.SET_TIER_VIDEO_SUCCESS })
    }
}

function getCreatorVideo(channelId, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/video/get-video?channelId=${channelId}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .catch((error) => { throw error }) 
}

function setTierVideo(tierSetting, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/video/set-tier`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            videoId: tierSetting.videoId,
            tierIds: tierSetting.tierIds,
            isShared: tierSetting.isShared
        }),
    })
        .then(response => response.json())
        .catch((error) => { throw error })
}


export default videoCreatorWatcher