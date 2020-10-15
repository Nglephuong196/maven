import * as constants from '../../constants/action-types'

const initialState = {
    tierList: [],
    tierRequesting: false,
    cancel: false,
    editTierRequesting: false,
    createTierRequesting: false
}

const tierReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.GET_TIER_LIST_REQUEST:
            return Object.assign({}, state, {
                tierRequesting: true
            })
        case constants.EDIT_TIER_REQUEST:
        case constants.EDIT_FREE_TIER_REQUEST:
            return Object.assign({}, state, {
                editTierRequesting: true
            })
        case constants.ADD_TIER_REQUEST:
            return Object.assign({}, state, {
                createTierRequesting: true
            })
        case constants.GET_TIER_LIST_SUCCESS:
            return Object.assign({}, state, {
                tierRequesting: false,
                tierList: action.data
            })
        case constants.EDIT_TIER_SUCCESS:
        case constants.EDIT_FREE_TIER_SUCCESS:
            return Object.assign({}, state, {
                editTierRequesting: false,

            })
        case constants.EDIT_TIER_ERROR:
        case constants.EDIT_FREE_TIER_ERROR:
            return Object.assign({}, state, {
                editTierRequesting: false
            })
        case constants.ADD_TIER_SUCCESS:
            return Object.assign({}, state, {
                createTierRequesting: false,
                tierList: state.tierList
            })
        case constants.DELETE_TIER_SUCCESS:
            return Object.assign({}, state, {
                tierList: state.tierList.filter(item => item.name != action.tier.tier.name)
            })
        case constants.CANCEL_ADD_OR_EDIT_TIER:
            return Object.assign({}, state, {
                cancel: !state.cancel
            })
        case constants.GET_TIER_LIST_ERROR:
            return Object.assign({}, state, {
                tierRequesting: false,
                tierList: state.tierList
            })
        case constants.ADD_TIER_ERROR:
            return Object.assign({}, state, {
                createTierRequesting: false,
            })
        case constants.DELETE_TIER_ERROR:
        case constants.EDIT_TIER_ERROR:
            return Object.assign({}, state, {
                //tierRequesting: false,
                //tierList: state.tierList
            })
        default:
            return state
    }
}

export default tierReducer