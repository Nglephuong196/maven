import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';


function* stylesWatcher() {
    yield takeLatest(constants.EDIT_CHANNEL_STYLE_REQUEST, withCallback(updateChannelStyleWorker))
}



function* updateChannelStyleWorker(action) {
    const state = yield select();
    try {
        const response = yield call(updateChannelStyle, action.data.channelStyle, state.appReducer.token)
        
        if (response.success === true) {
            yield put({ type: constants.GET_CHANNEL_STYLE_SUCCESS})
            //yield put({ type: constants.EDIT_CHANNEL_STYLE_SUCCESS })
        } else {
            yield put({ type: constants.EDIT_CHANNEL_STYLE_ERROR })
        }
    } catch (error) {
        yield put({ type: constants.EDIT_CHANNEL_STYLE_ERROR })
    }
}

function updateChannelStyle(channelStyle, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/channel/channel-setting`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            //featuredVideoUrl: channelStyle.featureVideo,
            color: channelStyle.color,
            colorAccent: channelStyle.colorAccent,
            font: ''
        }),
    })
        .then(response => response.json())
        .catch((error) => { throw error })
}


export default stylesWatcher