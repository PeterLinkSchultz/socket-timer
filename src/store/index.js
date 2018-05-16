import { createStore, combineReducers, applyMiddleware } from 'redux';
import {composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
//import { routerMiddleware } from 'react-router-redux';
//import {browserHistory} from 'react-router';
//import reducers from '../reducers';
/*
export const store = createStore(reducers, composeWithDevTools(
    applyMiddleware(thunk),
    //applyMiddleware(routerMiddleware(browserHistory))
)) ;*/