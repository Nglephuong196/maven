import * as constants from "../../constants/action-types";

export function getToken(token) {
    return {
        type: constants.GET_TOKEN,
        token: token
    }
}

export function setStripeConnectedAccountId({stripeConnectedAccountId}) {
    return {
        type: constants.SET_STRIPE_ACCOUNT_ID,
        stripeConnectedAccountId: stripeConnectedAccountId
    }
}

export function setUserRole({role, channelUrl}) {
    return {
        type: constants.SET_USER_ROLE,
        role: role,
        channelUrl: channelUrl
    }
}

export function getVideoCreator({channelId}) {
    return {
        type: constants.GET_CREATOR_VIDEO_REQUEST,
        channelId: channelId
    }
}

export function startProcessVideo() {
    return {
        type: constants.VIDEO_PROCESS_REQUEST
    }
}

export function endProcessVideo() {
    return {
        type: constants.VIDEO_PROCESS_SUCCESS
    }
}

export function setTierVideo({tierSetting}) {
    return {
        type: constants.SET_TIER_VIDEO_REQUEST,
        tierSetting: tierSetting
    }
}

export function getVideoProgress({fileProgress}) {
    return {
        type: constants.GET_VIDEO_PROGRESS,
        fileProgress: fileProgress
    }
}

export function checkVideoDuration({videoDuration}) {
    return {
        type: constants.CHECK_VIDEO_DURATION,
        videoDuration: videoDuration
    }
}

export function getTiers() {
    return {
        type: constants.GET_TIER_LIST_REQUEST
    }
}

export function getTranscription({videoId}) {
    return {
        type: constants.GET_TRANSCRIPTION_REQUEST,
        videoId: videoId
    }
}

export function updateTranscript({videoId, updateBlocks}) {
    return {
        type: constants.UPDATE_TRANSCRIPT_REQUEST,
        videoId: videoId,
        updateBlocks: updateBlocks
    }
}

export function addTier({tier, level}) {
    return {
        type: constants.ADD_TIER_REQUEST,
        data: tier,
        level: level
    }
}

export function cancelAddOrEditTier() {
    return {
        type: constants.CANCEL_ADD_OR_EDIT_TIER
    }
}

export function addCommentCreator({videoId, commentId, videoTime, userType, content, enable}) {
    return {
        type: constants.ADD_COMMENT_CREATOR_REQUEST,
        videoId: videoId,
        commentId: commentId,
        videoTime: videoTime,
        userType: userType,
        content: content,
        enable: enable
    }
}

export function getListCommentCreator({videoId}) {
    return {
        type: constants.GET_LIST_COMMENT_CREATOR_REQUEST,
        videoId: videoId
    }
}

export function hideOrUnhideComment({videoId, replyId, commentId, isHide}) {
    return {
        type: constants.HIDE_OR_UNHIDE_COMMENT_REQUEST,
        videoId: videoId,
        replyId: replyId,
        commentId: commentId, 
        isHide: isHide
    }
}

export function getVideoDetails({videoId, channelId}) {
    return {
        type: constants.GET_VIDEO_DETAILS_REQUEST,
        videoId: videoId,
        channelId: channelId
    }
}

export function getListSubscriber({tierId, searchText}) {
    return {
        type: constants.GET_LIST_SUBSCRIBER_REQUEST,
        tierId: tierId,
        searchText: searchText
    }
}

export function getListSubscriberWithFilter() {
    return {
        type: constants.GET_LIST_SUBSCRIBER_WITH_FILTER_REQUEST
    }
}



export function editTier(tier) {
    return {
        type: constants.EDIT_TIER_REQUEST,
        data: tier.tier
    }
}

export function saveDraftEmail({draftEmail}) {
    return {
        type: constants.SAVE_DRAFT_EMAIL_REQUEST,
        draftEmail: draftEmail
    }
}

export function sendEmail({draftEmail}) {
    return {
        type: constants.SEND_EMAIL_NEW_VIDEO_REQUEST,
        draftEmail: draftEmail
    }
}

export function editFreeTier({freeTier}) {
    return {
        type: constants.EDIT_FREE_TIER_REQUEST,
        freeTier: freeTier
    }
}

export function deleteTier(tier) {
    return {
        type: constants.DELETE_TIER_SUCCESS,
        tier: tier
    }
}


export function editUserProfile(userProfile) {
    console.log('vao')
    return {
        type: constants.EDIT_USER_PROFILE_REQUEST,
        data: userProfile
    }
}

export function getUserProfile() {
    return {
        type: constants.GET_USER_PROFILE_REQUEST,
    }
}

export function createChannel(channel) {
    return {
        type: constants.CREATE_CHANNEL_REQUEST,
        data: channel
    }
}

export function changeChannelStatus() {
    return {
        type: constants.CHANGE_CHANNEL_STATUS
    }
}

export function getChannel() {
    return {
        type: constants.GET_CHANNEL_REQUEST
    }
}

export function updateChannel({channelInfo, postalAddress}) {
    return {
        type: constants.EDIT_CHANNEL_REQUEST,
        channel: channelInfo,
        postalAddress: postalAddress
    }
}

export function getChannelStyle() {
    return {
        type: constants.GET_CHANNEL_STYLE_REQUEST
    }
}

export function createChannelStyle(channelStyle) {
    return {
        type: constants.CREATE_CHANNEL_STYLE_REQUEST,
        data: channelStyle
    }
}

export function updateChannelStyle(channelStyle) {
    return {
        type: constants.EDIT_CHANNEL_STYLE_REQUEST,
        data: channelStyle
    }
} 

export function updateTierForVideo({tierSetting}) {
    return {
        type: constants.UPDATE_TIER_FOR_VIDEO_REQUEST,
        tierSetting: tierSetting
    }
}

export function publishVideo({tierSetting}) {
    return {
        type: constants.PUBLISH_VIDEO_REQUEST,
        tierSetting: tierSetting
    }
}
