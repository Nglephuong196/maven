import * as constants from '../../constants/action-types'

const initialState = {
    listCommentCreator: null,
    isRequestingCreatorComment: false
}

const creatorCommentReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.GET_LIST_COMMENT_CREATOR_REQUEST:
            return Object.assign({}, state, {
                isRequestingCreatorComment: true,
            })
        case constants.GET_LIST_COMMENT_CREATOR_SUCCESS: 
            return Object.assign({}, state, {
                isRequestingCreatorComment: false,
                listCommentCreator: action.data
            })
        case constants.GET_LIST_COMMENT_CREATOR_ERROR:
            return Object.assign({}, state, {
                isRequestingCreatorComment: false
            })
        default: return state
    }
}

export default creatorCommentReducer