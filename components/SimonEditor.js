import dynamic from 'next/dynamic'
import { currentFilter, currentMedia, mediaTimecode, rawContent } from '../components/mock'
import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateTranscript } from '../redux/actions/index'

// const PS4 = dynamic(() => import('ss-editor'), {
//   ssr: false
// })

// let thatPS4 = null



function onSaveStateChange(isCurrentContentDistinctThanOriginal) {
  //console.log('onSaveStateChange', isCurrentContentDistinctThanOriginal)
}

function onBookmarkChange(transcript) {
  //console.log('onBookmarkChange', { transcript })
  return Promise.resolve(true)
}

function onAddMediaSpeaker(speaker) {
  //console.log('onAddMediaSpeaker', { speaker })
  return Promise.resolve(speaker)
}

function onUpdateMediaSpeaker(speaker) {
  //console.log('onUpdateMediaSpeaker', { speaker })
  return Promise.resolve(speaker)
}

function onCtrlSpace() {
  //console.log('onCtrlSpace')
}

function getInstance(instance) {
  //console.log('getInstance', instance)
  //instance.goToNextTranscription(true)
}

const SimonEditor = React.forwardRef((props, ref) => {
  React.useImperativeHandle(
    ref,
    () => ({
      onCtrlSpace,
      saveDraftTranscript,
      onSelectedPlayTime
    }),
  )
  const dispatch = useDispatch()
  const [PS4, setPS4] = useState()
  useEffect(() => {
    if (process.browser) {

      import('ss-editor').then((mod) => setPS4(mod.default))
    }

  }, [])
  useEffect(() => {
  }, [props.rawContent])

  useEffect(() => {
    if (editor && editor.current) {
      editor.current.highlightText(props.playerTime)
    }
  }, [props.playerTime])

  const editor = useRef()

  const currentMedia = {
    id: 'abc',
    speakers: [
      {

      },
      {

      }
    ],
  }

  const saveDraftTranscript = () => {
    //console.log('editor.current', editor.current)
    editor.current.autoSaveChanges('abc')
  }

  function _getInstance(instance) {
    //console.log('_getInstance_getInstance_getInstance_getInstance_getInstance', instance)
    setThatPS4(instance)
  }

  function _onSaveStateChange(isCurrentContentDistinctThanOriginal) {
    //console.log('onSaveStateChange', isCurrentContentDistinctThanOriginal)
  }

  function onSaveTranscript(transcriptRows, mediaId) {
    //console.log(transcriptRows )
    // console.log(props.rawContent)
    let count = 0
    let updateBlocks = []
    for (let key in transcriptRows) {
      let startTime = transcriptRows[key].wordsJson[0].startTime
      let endTime = transcriptRows[key].wordsJson.slice(-1)[0].endTime
      let updatedBlock = {
        annotation: transcriptRows[key].annotation,
        wordsJson: transcriptRows[key].wordsJson,
        readOnlyText: "",
        startTime: startTime,
        endTime: endTime
      }
      //updatedBlock.wordsJson = JSON.stringify(updatedBlock.wordsJson)
      updateBlocks.push(updatedBlock)
    }
    dispatch(updateTranscript({ videoId: props.id, updateBlocks: updateBlocks }))
    return Promise.resolve(true)
  }

  function onSelectedPlayTime(value) {
    props.onTimeSelected(value)
  }

  return (

    <div className="project-view">
      <div className="project-transcription">
        <div className="transcriptions-list-container">
          <div className="transcriptions-list">

            {PS4 && (
              <PS4
                ref={editor}
                getInstance={getInstance}
                isReadOnly={false}
                currentMedia={currentMedia}
                currentFilters={currentFilter}
                mediaTimecode={mediaTimecode}
                externalPlayer={{}}
                isPublicPageView={false}
                disableAutoScroll={false}
                isLocked={false}
                onSelectedPlayTime={onSelectedPlayTime}
                onSaveTranscript={onSaveTranscript}
                onSaveStateChange={_onSaveStateChange}
                onUpdateMediaSpeaker={onUpdateMediaSpeaker} // api
                onAddMediaSpeaker={onAddMediaSpeaker} // api
                onBookmarkChange={onBookmarkChange} //drop
                onCtrlSpace={onCtrlSpace}
                rawContent={props.rawContent}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

export default SimonEditor