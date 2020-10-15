import { takeLatest, call, put } from 'redux-saga/effects'
import * as constants from '../../constants/action-types'
import { withCallback } from 'redux-saga-callback';

function* testWatcher(){
    yield takeLatest(constants.TEST_REQUEST, withCallback(testWoker) )
}

function* testWoker(action){
    
    try {
      
        const response = yield call(getList) 
    
        if(response.msg === "success"){
            let result = []
            response.data.map((item)=> result.push(item))
       
          yield put({ type: constants.TEST_SUCCESS, result })
        }else{
          //yield put({ type: ADD_USER_ERROR, response })  
        }
      } catch(error){
        //yield put({ type: ADD_USER_ERROR, error })
      }
}

function getList(){
    return fetch(`https://tiki-minesweeper.herokuapp.com/getMines?size=9&mines=10`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        //Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        // "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(response => response.json())
    .catch((error) => { throw error }) 
  }

export default testWatcher