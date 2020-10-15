import * as constants from '../../constants/action-types'

const initialState = {
    token: null,
    role: null,
    channelUrl: null, 
    msg: null,
    pushMsg: true,
    fileProgress: 0,
    timeRemain: 0,
    stripeConnectedAccountId: undefined
}

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.GET_TOKEN:
    
            return Object.assign({}, state, {
                token: action.token.token
            })
        case constants.SET_USER_ROLE: 
            return Object.assign({}, state, {
                role: action.role,
                channelUrl: action.channelUrl
            })
        case constants.SET_STRIPE_ACCOUNT_ID:
            return Object.assign({}, state, {
                stripeConnectedAccountId:  action.stripeConnectedAccountId
            })
        case constants.CHANGE_MESSAGE: 
            return Object.assign({}, state, {
                msg: action.data,
                pushMsg: !state.pushMsg
            })
        case constants.GET_VIDEO_PROGRESS:
            return Object.assign({}, state, {
                fileProgress: action.fileProgress
            })
        case constants.CHECK_VIDEO_DURATION:
            return Object.assign({}, state, {
                timeRemain: action.videoDuration
            })
        default: return state
    }
    
}

export default appReducer
