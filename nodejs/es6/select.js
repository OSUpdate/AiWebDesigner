
import React from "react";
import App from "./components/App";
import {Provider} from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configure from "./store/configure";

const store = configure();
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
