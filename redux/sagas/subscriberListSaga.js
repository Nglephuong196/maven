import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';




function* subscriberListWatcher() {
    yield takeLatest(constants.GET_LIST_SUBSCRIBER_REQUEST, withCallback(getListSubscriberWorker))
    //yield takeLatest(constants.GET_CREATOR_VIDEO_REQUEST, withCallback(getCreatorVideoWorker))
}

function * getListSubscriberWorker(action) {
    const state = yield select()
    try {
        const response = yield call(getListSubscriber, state.channelReducer.channel.id, action.tierId, action.searchText, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.GET_LIST_SUBSCRIBER_SUCCESS, data: response.data})
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        } else {
            yield put({ type: constants.GET_LIST_SUBSCRIBER_ERROR })
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        }

    } catch (err) {
        yield put({ type: constants.GET_LIST_SUBSCRIBER_ERROR })
    }
}

function getListSubscriber(channelId, tierId, searchText, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/get-subscriber?channelId=${channelId}&tierId=${tierId}&searchText=${searchText}`, {
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



export default subscriberListWatcher