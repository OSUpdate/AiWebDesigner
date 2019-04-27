import React from "react";
import {Switch, Route} from "react-router-dom";
import {
    Index,
    Info,
    Select,
    Editor,
    NotFound,
    Forgot
} from "../Page/index.async.js";

// 페이지 요청시에 각각 경로에 맞는 파일 읽어들임
const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Index}/>
            <Route exact path="/select/:folder" component={Select}/>
            <Route exact path="/select" component={Select}/>
            <Route exact path="/editor/:user/:folder/" component={Editor}/>
            <Route exact path="/info" component={Info}/>
            <Route exact path="/find" component={Forgot}/>
            <Route component={NotFound}/>
        </Switch>
    );
};
export default App;
