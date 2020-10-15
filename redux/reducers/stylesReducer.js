import * as constants from '../../constants/action-types'

const initialState = {
    channelSetting: null,
    isLoadingStyles: false
}

const stylesReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case constants.EDIT_CHANNEL_STYLE_REQUEST:
            return Object.assign({}, state, {
                isLoadingStyles: true
            })
        case constants.GET_CHANNEL_STYLE_SUCCESS:
            return Object.assign({}, state, {
                channelSetting: action.data,
                isLoadingStyles: false
            })
        case constants.EDIT_CHANNEL_STYLE_ERROR:
            return Object.assign({}, state, {
                isLoadingStyles: false
            })
        default: return state
    }
    
}

export default stylesReducer