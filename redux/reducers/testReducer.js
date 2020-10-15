import * as constants from "../../constants/action-types";

const initialState = {
    value: 0,
    listData: []
}

const testReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.TEST_REQUEST:
           return Object.assign({}, state, {
                value: state.value+5,
            })
        case constants.TEST_SUCCESS:
            return Object.assign({}, state, {
                listData: action.result,
            })
        default:
            return state
    }
}

export default testReducer