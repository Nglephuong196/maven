import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';
import { getListCommentCreator } from '../actions/index'




function* creatorCommentWatcher() {
    yield takeLatest(constants.ADD_COMMENT_CREATOR_REQUEST, withCallback(addCommentCreatorWorker))
    yield takeLatest(constants.GET_LIST_COMMENT_CREATOR_REQUEST, withCallback(getListCommentCreatorWorker))
    yield takeLatest(constants.HIDE_OR_UNHIDE_COMMENT_REQUEST, withCallback(hideOrUnhideCommentWorker))
}

function * hideOrUnhideCommentWorker(action) {
    const state = yield select()
    try {
        const response = yield call(hideOrUnhideComment, state.channelReducer.channel.id, action.videoId, action.replyId, action.commentId,action.isHide, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.HIDE_OR_UNHIDE_COMMENT_SUCCESS})
            yield put(getListCommentCreator({videoId: action.videoId}))
        } else {
            yield put({ type: constants.HIDE_OR_UNHIDE_COMMENT_ERROR })
        }

    } catch (err) {
        yield put({ type: constants.HIDE_OR_UNHIDE_COMMENT_ERROR })
    }
}

function hideOrUnhideComment(channelId, videoId, replyId, commentId, isHide, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/comment/hide-and-unhide-comment`, {
        method: 'PUT', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            channelId: channelId,
            videoId: videoId,
            replyId: replyId,
            commentId: commentId,
            isHide: isHide
          }),
    })
        .then(response => response.json())
        .catch((error) => { throw error }) 
}

function * addCommentCreatorWorker(action) {
    const state = yield select()
    try {
        const response = action.enable ? yield call(addCommentCreator, state.channelReducer.channel.id, action.videoId, action.videoTime, action.content,action.userType, action.commentId, state.appReducer.token)
                                        : yield call(addCommentCreator, state.channelReducer.channel.id, action.videoId, null, action.content,action.userType, action.commentId, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.ADD_COMMENT_CREATOR_SUCCESS})
            yield put(getListCommentCreator({videoId: action.videoId}))
        } else {
            yield put({ type: constants.ADD_COMMENT_CREATOR_ERROR })
        }

    } catch (err) {
        yield put({ type: constants.ADD_COMMENT_CREATOR_ERROR })
    }
}

function addCommentCreator(channelId, videoId, videoTime, content, userType, commentId, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/comment/add-comment`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Access-Control-Request-Headers": 'Authorization',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            channelId: channelId,
            videoId: videoId,
            videoTime: videoTime,
            content: content,
            userType: userType,
            commentId: commentId
          }),
    })
        .then(response => response.json())
        .catch((error) => { throw error }) 
}

function * getListCommentCreatorWorker(action) {
    const state = yield select()
    try {
        const response = yield call(getListCommentCreator2, state.channelReducer.channel.id, action.videoId, state.appReducer.token)
        if (response.success === true) {
            yield put({ type: constants.GET_LIST_COMMENT_CREATOR_SUCCESS, data: response.data})
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        } else {
            yield put({ type: constants.GET_LIST_COMMENT_CREATOR_ERROR })
            //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
        }

    } catch (err) {
        yield put({ type: constants.GET_LIST_COMMENT_CREATOR_ERROR })
    }
}

function getListCommentCreator2(channelId, videoId, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/comment/get-comment?channelId=${channelId}&videoId=${videoId}&userType=${0}`, {
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


export default creatorCommentWatcher