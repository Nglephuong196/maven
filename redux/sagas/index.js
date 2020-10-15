import {all} from 'redux-saga/effects';
import testWatcher from './testSaga'
import profileWatcher from './profileSaga';
import channelWatcher from './channelSaga';
import stylesWatcher from './stylesSaga'
import tierWatcher from './tierSaga';
import videoCreatorWatcher from './videoCreatorSaga'
import subscriberListWatcher from './subscriberListSaga'
import creatorCommentWatcher from './creatorCommentSaga'
import transcriptionWatcher from './transcriptionSaga'
import emailWatcher from './emailSaga'

export default function* IndexSaga () {  
    yield  all( [
      testWatcher(),
      profileWatcher(),
      channelWatcher(),
      stylesWatcher(),
      tierWatcher(),
      videoCreatorWatcher(),
      subscriberListWatcher(),
      creatorCommentWatcher(),
      transcriptionWatcher(),
      emailWatcher()
    ]);
  }