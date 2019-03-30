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


const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={Index}/>
            <Route exact path="/select" component={Select}/>
            <Route exact path="/editor" component={Editor}/>
            <Route exact path="/info" component={Info}/>
            <Route exact path="/find" component={Forgot}/>
            <Route component={NotFound}/>
        </Switch>
    );
};
export default App;
