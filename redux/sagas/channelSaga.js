import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';
import { getTiers, getChannel } from '../actions';


function* channelWatcher() {
  yield takeLatest(constants.CREATE_CHANNEL_REQUEST, withCallback(createChannelWoker))
  yield takeLatest(constants.GET_CHANNEL_REQUEST, withCallback(getChannelWoker))
  yield takeLatest(constants.EDIT_CHANNEL_REQUEST, withCallback(updateChannelWorker))
}

function* createChannelWoker(action) {
  const state = yield select();
  try {
    const response = yield call(createChannel, action.data.channelDetails, state.appReducer.token)

    const channel = {
      name: action.data.channelDetails.name,
      channelUrl: action.data.channelDetails.channelURL,
      description: action.data.channelDetails.description,
      logoUrl: action.data.channelDetails.logo
    }
    if (response.success) {
      yield put({ type: constants.CREATE_CHANNEL_SUCCESS, data: channel })
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put(getChannel())
    } else {
      yield put({ type: constants.CREATE_CHANNEL_ERROR })
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
    }
  } catch (error) {
    yield put({ type: constants.GET_CHANNEL_ERROR, error })
  }
}

function* updateChannelWorker(action) {
  const state = yield select();
  try {
    const response = yield call(updateChannel, action.channel, action.postalAddress, state.appReducer.token)
    if (response.success === true) {
      yield put({ type: constants.EDIT_CHANNEL_SUCCESS })
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put(getChannel())
    } else {
      yield put({ type: constants.EDIT_CHANNEL_ERROR })
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
    }
  } catch (error) {
    console.log(error)
    yield put({ type: constants.EDIT_CHANNEL_ERROR })
  }
}

function* getChannelWoker(action) {
  const state = yield select();

  try {
    const response = yield call(getChannel2, state.appReducer.token)
    if (response.success === true) {
      yield put({ type: constants.GET_CHANNEL_SUCCESS, data: response.data })
      yield put(getTiers())
    } else {
      yield put({ type: constants.GET_CHANNEL_ERROR, response })
    }
  } catch (error) {
    yield put({ type: constants.GET_CHANNEL_ERROR, error })
  }
}

function updateChannel(channel, postalAddress, token) {
  console.log(channel, postalAddress,token)
  let body = postalAddress ? JSON.stringify({
    name: channel.name,
    //channelUrl: channel.channelURL,
    description: channel.description,
    logoUrl: channel.logo,
    street: postalAddress.street,
    city: postalAddress.city,
    country: postalAddress.country,
    state: postalAddress.state,
    zipCode: postalAddress.zipCode,
    color: channel.color,
    colorAccent: channel.colorAccent
  }) : JSON.stringify({
    name: channel.name,
    //channelUrl: channel.channelURL,
    description: channel.description,
    logoUrl: channel.logo,
    //street: postalAddress.street,
    //city: postalAddress.city,
    //country: postalAddress.country,
    //state: postalAddress.state,
    //zipCode: postalAddress.zipCode,
    color: channel.color,
    colorAccent: channel.colorAccent
  })
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/channel/channel-setting`, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Access-Control-Request-Headers": 'Authorization',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body,
  })
    .then(response => response.json())
    .catch((error) => { { console.log(error); throw error } })
}

function getChannel2(token) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/channel/get-channel`, {
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

function createChannel(channel, token) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/channel/create-channel`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Access-Control-Request-Headers": 'Authorization',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      freeTierName: 'Free Tier',
      name: channel.name,
      channelUrl: channel.channelURL,
      description: channel.description,
      logoUrl: channel.logo
    }),
  })
    .then(response => response.json())
    .catch((error) => { throw error })
}

export default channelWatcher