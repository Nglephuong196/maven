import * as constants from '../../constants/action-types'

const initialState = {
    isSetTierRequesting: false,
    isCreatorVideoRequesting: false,
    videoList: [],
    videoDetails: null,
    isVideoDetailsRequesting: false,
    isPublishVideoRequesting: false,
    isUpdateTierForVideoRequesting: false,
}

const videoCreatorReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.UPDATE_TIER_FOR_VIDEO_REQUEST:
            return Object.assign({}, state, {
                isUpdateTierForVideoRequesting: true
            })
        case constants.UPDATE_TIER_FOR_VIDEO_SUCCESS:
            return Object.assign({}, state, {
                isUpdateTierForVideoRequesting: false
            })
        case constants.UPDATE_TIER_FOR_VIDEO_ERROR:
            return Object.assign({}, state, {
                isUpdateTierForVideoRequesting: false
            })
        case constants.PUBLISH_VIDEO_REQUEST:
            return Object.assign({}, state, {
                isPublishVideoRequesting: true
            })
        case constants.PUBLISH_VIDEO_SUCCESS:
            return Object.assign({}, state, {
                isPublishVideoRequesting: false
            })
        case constants.PUBLISH_VIDEO_ERROR:
            return Object.assign({}, state, {
                isPublishVideoRequesting: false
            })
        case constants.SET_TIER_VIDEO_REQUEST:
            return Object.assign({}, state, {
                isSetTierRequesting: true
            })
        case constants.SET_TIER_VIDEO_ERROR:
        case constants.SET_TIER_VIDEO_SUCCESS:
            return Object.assign({}, state, {
                isSetTierRequesting: false
            })
        case constants.GET_CREATOR_VIDEO_REQUEST:
            return Object.assign({}, state, {
                isCreatorVideoRequesting: true
            })
        case constants.GET_CREATOR_VIDEO_SUCCESS:
            return Object.assign({}, state, {
                isCreatorVideoRequesting: false,
                videoList: action.data
            })
        case constants.GET_CREATOR_VIDEO_ERROR:
            return Object.assign({}, state, {
                isCreatorVideoRequesting: false
            })
        case constants.GET_VIDEO_DETAILS_REQUEST:
            return Object.assign({}, state, {
                isVideoDetailsRequesting: true
            })
        case constants.GET_VIDEO_DETAILS_SUCCESS:
            return Object.assign({}, state, {
                isVideoDetailsRequesting: false,
                videoDetails: action.data
            })
        case constants.GET_VIDEO_DETAILS_ERROR:
            return Object.assign({}, state, {
                isVideoDetailsRequesting: false
            })
        default: return state
    }

}

export default videoCreatorReducer