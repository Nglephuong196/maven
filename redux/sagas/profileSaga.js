import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';

function* profileWatcher() {
  yield takeLatest(constants.EDIT_USER_PROFILE_REQUEST, withCallback(editProfileWoker))
  yield takeLatest(constants.GET_USER_PROFILE_REQUEST, withCallback(getProfileWoker))
}

function* editProfileWoker(action) {
  const state = yield select();

  try {
    console.log(action.data)
    const response = yield call(editProfile, action.data.userProfile, state.appReducer.token)
    if (response.success === true) {
      const user = {
        firstName: action.data.userProfile.firstName,
        lastName: action.data.userProfile.lastName,
        urlLink: action.data.userProfile.socialURL ?? action.data.userProfile.urlLink,
        urlImage: action.data.userProfile.image,
        email: action.data.userProfile.email,
        description: action.data.userProfile.description
      }
      yield put({ type: constants.GET_USER_PROFILE_SUCCESS, data: user })
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
    } else {
      //yield put({ type: ADD_USER_ERROR, response })
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })  
    }
  } catch (error) {
    //yield put({ type: ADD_USER_ERROR, error })
  }
}

function* getProfileWoker(action) {
  const state = yield select();

  try {

    const response = yield call(getProfile, state.appReducer.token)
    if (response.success === true) {
      yield put({ type: constants.GET_USER_PROFILE_SUCCESS, data: response.data })
    } else {
      yield put({ type: constants.GET_USER_PROFILE_ERROR, response })
    }
  } catch (error) {
    yield put({ type: constants.GET_USER_PROFILE_ERROR, error })
  }
}

function getProfile(token) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/get-profile`, {
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

function editProfile(userProfile, token) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/update-profile`, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Access-Control-Request-Headers": 'Authorization',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      urlLink: userProfile.socialURL ?? userProfile.urlLink,
      urlImage: userProfile.image,
      email: userProfile.email,
      description: userProfile.description
    }),
  })
    .then(response => response.json())
    .catch((error) => { throw error })
}

export default profileWatcher