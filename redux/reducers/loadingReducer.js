import * as constants from '../../constants/action-types'

const initialState = {
    isVideoProcessing: false
}

const loadingReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.VIDEO_PROCESS_REQUEST:
            return Object.assign({}, state, {
                isVideoProcessing: true
            })
        case constants.VIDEO_PROCESS_SUCCESS: 
            return Object.assign({}, state, {
                isVideoProcessing: false
            })
        default: return state
    }

}

export default loadingReducer