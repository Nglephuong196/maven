import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';
import { getTranscription } from '../actions/index'



function* transcriptionWatcher() {
  yield takeLatest(constants.GET_TRANSCRIPTION_REQUEST, withCallback(getTranscriptionWorker))
  yield takeLatest(constants.UPDATE_TRANSCRIPT_REQUEST, withCallback(updateTranscriptWorker))
}

function* updateTranscriptWorker(action) {
  const state = yield select();
  try {
    const response = yield call(updateTranscript, action.videoId, state.appReducer.token, action.updateBlocks)
    if (response.success === true) {
      yield put({ type: constants.UPDATE_TRANSCRIPT_SUCCESS, data: response.data })
      yield put(getTranscription({ videoId: action.videoId}))
    } else {
      yield put({ type: constants.UPDATE_TRANSCRIPT_ERROR })
    }
  } catch (error) {
    yield put({ type: constants.UPDATE_TRANSCRIPT_ERROR })
  }
}

function updateTranscript(videoId, token, updateBlocks) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/video/${videoId}/save-transcription`, {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
          "Access-Control-Request-Headers": 'Authorization',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updateBlocks: updateBlocks,
        deleteBlocks: []
    }),
  })
      .then(response => response.json())
      .catch((error) => { throw error })
}

function* getTranscriptionWorker(action) {
  const state = yield select();
  try {
    const response = yield call(getTranscription2, action.videoId, state.appReducer.token)
    if (response.success === true) {
      yield put({ type: constants.GET_TRANSCRIPTION_SUCCESS, data: response.data })
    } else {
      yield put({ type: constants.GET_TRANSCRIPTION_ERROR })
    }
  } catch (error) {
    yield put({ type: constants.GET_TRANSCRIPTION_ERROR })
  }
}


function getTranscription2(videoId, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/video/${videoId}/get-transcription`, {
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


export default transcriptionWatcher