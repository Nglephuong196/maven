import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';
import { getTiers, getChannel, sendEmail } from '../actions';


function* emailWatcher() {
  yield takeLatest(constants.SAVE_DRAFT_EMAIL_REQUEST, withCallback(saveDraftEmailWorker))
}



function* saveDraftEmailWorker(action) {
    const state = yield select();
  try {
    const response = yield call(saveDraftEmail, action.draftEmail, state.appReducer.token)
    console.log(response)
    // if (response.success === true) {
    //   yield put({ type: constants.EDIT_CHANNEL_SUCCESS })
    //   yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
    //   yield put(getChannel())
    // } else {
    //   yield put({ type: constants.EDIT_CHANNEL_ERROR })
    //   yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
    // }
  } catch (error) {
    //yield put({ type: constants.EDIT_CHANNEL_ERROR })
  }
}

function saveDraftEmail(draftEmail, token) {
    return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/email/save-draft-email`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Access-Control-Request-Headers": 'Authorization',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchId: draftEmail.videoId,
        typeEmail: draftEmail.typeEmail,
        content: draftEmail.content,
        subject: draftEmail.subject
      }),
    })
      .then(response => response.json())
      .catch((error) => { throw error })
  }


export default emailWatcher
