import { Draft, EditorState, convertFromRaw, RichUtils, convertToRaw } from 'draft-js';
import { useEffect } from 'react';
import dynamic from 'next/dynamic'
import BaseSetup from '../components/BaseSetup'
import { stateToHTML } from 'draft-js-export-html'
import { currentFilter, currentMedia, mediaTimecode, rawContent } from '../components/mock'
import SideBarDrawer from '../components/SideBarDrawer'



const PS4 = dynamic(() => import('ss-editor'), {
  ssr: false
})

const Editor = dynamic(() => import('../components/QuillEditor'), {
  ssr: false
})

function onSelectedPlayTime(value) {
  console.log('onSelectedPlayTime', { value })
}

function onSaveTranscript(transcriptRows, mediaId) {
  console.log('onSaveTranscript', { transcriptRows, mediaId })
  return Promise.resolve(true)
}

function onSaveStateChange(isCurrentContentDistinctThanOriginal) {
  console.log('onSaveStateChange', isCurrentContentDistinctThanOriginal)
}

function onBookmarkChange(transcript) {
  console.log('onBookmarkChange', { transcript })
  return Promise.resolve(true)
}

function onAddMediaSpeaker(speaker) {
  console.log('onAddMediaSpeaker', { speaker })
  return Promise.resolve(speaker)
}

function onUpdateMediaSpeaker(speaker) {
  console.log('onUpdateMediaSpeaker', { speaker })
  return Promise.resolve(speaker)
}

function onCtrlSpace() {
  console.log('onCtrlSpace')
}

function getInstance(instance) {
  console.log('getInstance', instance)
  instance.goToNextTranscription(true)
}

const test = () => {
  const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        text: 'sad',
        key: 'foo',
        type: 'unstyled',
        entityRanges: [],
      },
      {
        key: '16d0k',
        text: 'You can edit this text.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [{ offset: 0, length: 23, style: 'BOLD' }],
        entityRanges: [],
        data: {},
      },
      {
        key: '98peq',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
      {
        key: 'ecmnc',
        text:
          'Luke Skywalker has vanished. In his absence, the sinister FIRST ORDER has risen from the ashes of the Empire and will not rest until Skywalker, the last Jedi, has been destroyed.',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          { offset: 0, length: 14, style: 'BOLD' },
          { offset: 133, length: 9, style: 'BOLD' },
        ],
        entityRanges: [],
        data: {},
      },
      {
        key: 'fe2gn',
        text: '',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
  });
  function myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'blockquote') {
      return 'superFancyBlockquote';
    }
  }
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createWithContent(emptyContentState),
  );
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }
  const _onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  useEffect(() => {
    console.log(stateToHTML(editorState.getCurrentContent()))
  })
  return (
    <Editor />
    // <div className="project-view">
    //   <div className="project-transcription">
    //     <div className="transcriptions-list-container">
    //       <div className="transcriptions-list">
    //         <PS4
    //           //ref={childRef}
    //           isReadOnly={false}
    //           currentMedia={currentMedia}
    //           currentFilters={currentFilter}
    //           mediaTimecode={mediaTimecode}
    //           externalPlayer={{}}
    //           isPublicPageView={false}
    //           isLocked={false}
    //           disableAutoScroll={true}
    //           onSelectedPlayTime={onSelectedPlayTime}
    //           onSaveTranscript={onSaveTranscript}
    //           onSaveStateChange={onSaveStateChange}
    //           onUpdateMediaSpeaker={onUpdateMediaSpeaker}
    //           onAddMediaSpeaker={onAddMediaSpeaker}
    //           onBookmarkChange={onBookmarkChange}
    //           onCtrlSpace={onCtrlSpace}
    //           rawContent={rawContent}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>

  )
}

export default test




