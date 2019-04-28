import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import penderMiddleware from "redux-pender";
import * as modules from "../modules";

// 리듀서 할당
const reducers = combineReducers(modules);
// 미들웨어 처리기 할당
const middleware = [penderMiddleware()];
// 개발모드 설정
const isDev = process.env.NODE_ENV === "development";
const devtools = isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
const composeEnhancers = devtools || compose;

// 리덕스 연동을 위한 설정
const configure = (preloadedState) => createStore(reducers, preloadedState, composeEnhancers(
    applyMiddleware(...middleware)
));
export default configure;