import { takeLatest, call, put, select } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';
import { getTiers } from '../actions';


function* tierWatcher() {
  yield takeLatest(constants.ADD_TIER_REQUEST, withCallback(createTierWoker))
  yield takeLatest(constants.GET_TIER_LIST_REQUEST, withCallback(getTierListWoker))
  yield takeLatest(constants.EDIT_TIER_REQUEST, withCallback(updateTierWorker))
  yield takeLatest(constants.EDIT_FREE_TIER_REQUEST, withCallback(updateFreeTierWorker))
}

function* updateFreeTierWorker(action) {
  const state = yield select();
  try {
    const response = yield call(updateFreeTier, action.freeTier, state.appReducer.token, state.channelReducer.channel)
    console.log(response)
    if (response.success === true) {
      yield put(getTiers({}))
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put({ type: constants.EDIT_FREE_TIER_SUCCESS })
    } else {
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put({ type: constants.EDIT_FREE_TIER_ERROR })
    }
  } catch (error) {
    yield put({ type: constants.EDIT_FREE_TIER_ERROR })
    yield put(getTiers({}))
  }
}

function updateFreeTier(tier, token, channel) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/tier/update-free-tier`, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Access-Control-Request-Headers": 'Authorization',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tierId: tier.id,
      channelId: channel.id,
      tierName: tier.name,
      description: tier.description,
    }),
  })
    .then(response => response.json())
    .catch((error) => { throw error })
}

function* createTierWoker(action) {
  const state = yield select();
  try {
    const response = yield call(addTier, action.data, action.level, state.appReducer.token, state.channelReducer.channel)
    if (response.success === true) {
      yield put(getTiers({}))
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put({ type: constants.ADD_TIER_SUCCESS })
    } else {
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put({ type: constants.ADD_TIER_ERROR })
    }
  } catch (error) {
    yield put({ type: constants.ADD_TIER_ERROR })
    yield put(getTiers({}))
  }
}

function* updateTierWorker(action) {
  const state = yield select();
 
  try {
    const response = yield call(updateTier, action.data, state.appReducer.token)
    if (response.success === true) {
      yield put(getTiers({}))
      //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put({ type: constants.EDIT_TIER_SUCCESS })
    } else {
      yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
      yield put({ type: constants.EDIT_TIER_ERROR })
      
    }
  } catch (error) {
    yield put({ type: constants.EDIT_TIER_ERROR })
    yield put(getTiers({}))
  }
}

function* getTierListWoker(action) {
  const state = yield select();
  try {
    const response = yield call(getTierList, state.appReducer.token, state.channelReducer.channel)
     if (response.success === true) {
       yield put({ type: constants.GET_TIER_LIST_SUCCESS, data: response.data })
       
     } else {
      //yield put({ type: constants.CHANGE_MESSAGE, data: response.message })
       yield put({ type: constants.GET_TIER_LIST_ERROR })
     }
  } catch (error) {
    yield put({ type: constants.GET_TIER_LIST_ERROR })
    //yield put({ type: constants.CHANGE_MESSAGE, data: error.message })
  }
}

function updateTier(tier, token) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/tier/update-tier`, {
    method: 'PUT', // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Access-Control-Request-Headers": 'Authorization',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tierId: tier.id,
      tierName: tier.name,
      description: tier.description,
      status: tier.status,
      tierYearlyEnabled: tier.tierYearlyEnabled,
      tierYearlyPrice: parseFloat(tier.tierYearlyPrice),
      tierMonthlyEnabled: tier.tierMonthlyEnabled,
      tierMonthlyPrice: parseFloat(tier.tierMonthlyPrice)
    }),
  })
    .then(response => response.json())
    .catch((error) => { throw error })
}

function getTierList(token, channel) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/tier?channelId=${channel.id}`, {
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

function addTier(tier, level, token, channel) {
  return fetch(`${process.env.NEXT_APP_API_ENDPOINT}/creator/tier/create-tier`, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Access-Control-Request-Headers": 'Authorization',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        channelId: channel.id,
        tierName: tier.name,
        description: tier.description,
        status: tier.status,
        tierYearlyPrice: parseFloat(tier.tierYearlyPrice),
        tierMonthlyPrice: parseFloat(tier.tierMonthlyPrice),
        level: `t${level}`
    }),
  })
    .then(response => response.json())
    .catch((error) => { throw error })
}

export default tierWatcher