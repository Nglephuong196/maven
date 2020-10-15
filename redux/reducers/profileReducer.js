import * as constants from '../../constants/action-types'

const initialState = {
    user: undefined,
    isRequestingUser: false
}

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.GET_USER_PROFILE_REQUEST:
            return Object.assign({}, state,{
                isRequestingUser: true
            })
        case constants.GET_USER_PROFILE_SUCCESS:
            return Object.assign({}, state, {
                user: action.data,
                isRequestingUser: false
            })
            case constants.GET_USER_PROFILE_ERROR:
                return Object.assign({}, state,{
                    isRequestingUser: false
                })
        default: return state
    }
    
}

export default profileReducer