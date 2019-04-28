
import React from "react";
import App from "./components/App";
import {Provider} from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configure from "./store/configure";
// 리덕스 설정값 가져옴
const store = configure();
// 리덕스 연동 및 라우터 사용 설정
const Select = () => {
    return(
        <Provider store = {store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
        
    );
};

export default Select;
