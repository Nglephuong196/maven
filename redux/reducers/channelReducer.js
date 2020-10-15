import * as constants from '../../constants/action-types'

const initialState = {
    channel: undefined,
    channelStyles: undefined,
    isRequestingChannel: false,
    channelCreated: false
}

const channelReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.CREATE_CHANNEL_REQUEST:
        case constants.EDIT_CHANNEL_REQUEST:
        case constants.GET_CHANNEL_REQUEST:
            return Object.assign({}, state, {
                isRequestingChannel: true
            })
        case constants.GET_CHANNEL_SUCCESS:
            return Object.assign({}, state, {
                channel: action.data,
                isRequestingChannel: false
            })
        case constants.EDIT_CHANNEL_SUCCESS:
        case constants.CREATE_CHANNEL_SUCCESS:
            return Object.assign({}, state, {
                isRequestingChannel: false,
                channelCreated: true
            })
        case constants.CHANGE_CHANNEL_STATUS: 
            return Object.assign({}, state, {
                channelCreated: false
            })
        case constants.CREATE_CHANNEL_ERROR:
            return Object.assign({}, state, {
                isRequestingChannel: false,
                channelCreated: false
            })
        case constants.EDIT_CHANNEL_ERROR:
        case constants.GET_CHANNEL_ERROR:
            return Object.assign({}, state, {
                isRequestingChannel: false
            })
        default: return state
    }

}

export default channelReducer