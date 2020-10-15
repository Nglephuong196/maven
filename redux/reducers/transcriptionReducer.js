import * as constants from '../../constants/action-types'

const initialState = {
    transcriptedContent: null,
    isTranscriptRequesting: false,
    isUpdateTranscriptRequesting: false
}

const transcriptionReducer = (state = initialState, action) => {
    switch (action.type) {
        case constants.UPDATE_TRANSCRIPT_REQUEST:
            return Object.assign({}, state, {
                isUpdateTranscriptRequesting: true
            })
        case constants.GET_TRANSCRIPTION_REQUEST:
            return Object.assign({}, state, {
                isTranscriptRequesting: true
            })
        case constants.UPDATE_TRANSCRIPT_SUCCESS:
            return Object.assign({}, state, {
                isUpdateTranscriptRequesting: false
            })
        case constants.GET_TRANSCRIPTION_SUCCESS:
            console.log(action.data)
            return Object.assign({}, state, {
                isTranscriptRequesting: false,
                transcriptedContent: action.data
            })
        case constants.UPDATE_TRANSCRIPT_ERROR:
            return Object.assign({}, state, {
                isUpdateTranscriptRequesting: false
            })
        case constants.GET_TRANSCRIPTION_ERROR:
            return Object.assign({}, state, {
                isTranscriptRequesting: false
            })
        default: return state
    }

}

export default transcriptionReducer