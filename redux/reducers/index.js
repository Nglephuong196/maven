import { combineReducers } from 'redux'
import testReducer from './testReducer'
import tierReducer from './tierReducer'
import stylesReducer from './stylesReducer'
import profileReducer from './profileReducer'
import appReducer from './appReducer'
import channelReducer from './channelReducer'
import videoCreatorReducer from './videoCreatorReducer'
import subscriberListReducer from './subscriberListReducer'
import creatorCommentReducer from './creatorCommentReducer'
import transcriptionReducer from './transcriptionReducer'
import emailReducer from './emailReducer'
import loadingReducer from './loadingReducer'

const rootReducer = combineReducers({
    testReducer,
    tierReducer,
    stylesReducer,
    profileReducer,
    appReducer,
    channelReducer,
    videoCreatorReducer,
    subscriberListReducer,
    creatorCommentReducer,
    transcriptionReducer,
    emailReducer,
    loadingReducer
})
  
export default rootReducer