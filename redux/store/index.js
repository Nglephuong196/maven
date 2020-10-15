import { createStore,applyMiddleware } from "redux";
import rootReducer from "../reducers/index";
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from "redux-saga";
import IndexSagas from '../sagas/index';

const initializeSagaMiddleware = createSagaMiddleware();

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(initializeSagaMiddleware))
    );

    initializeSagaMiddleware.run(IndexSagas);

export default store;