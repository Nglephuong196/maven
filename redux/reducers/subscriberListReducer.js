import * as constants from '../../constants/action-types'

const initialState = {
    isRequestingSubcriberList: false,
    subscriberList: null
}

const subscriberListReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case constants.GET_LIST_SUBSCRIBER_REQUEST:
            return Object.assign({}, state, {
                isRequestingSubcriberList: true
            })
        case constants.GET_LIST_SUBSCRIBER_SUCCESS: 
            return Object.assign({}, state, {
                isRequestingSubcriberList: false,
                subscriberList: action.data
            })
        case constants.GET_LIST_SUBSCRIBER_ERROR:
            return Object.assign({}, state, {
                isRequestingSubcriberList: false
            })
        default: return state
    }
    
}

export default subscriberListReducer