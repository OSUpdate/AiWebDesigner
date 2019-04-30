import React from "react";
import {Switch, Route} from "react-router-dom";
import {MainPage, CodeEditorPage, WebEditorPage, SelectPage, NotFoundPage, MyInfoPage} from "../Page";

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={MainPage}/>
            <Route exact path="/select" component={SelectPage}/>
            <Route exact path="/editor" component={WebEditorPage}/>
            <Route exact path="/code" component={CodeEditorPage}/>
            <Route exact path="/info" component={MyInfoPage}/>
            <Route component={NotFoundPage}/>
        </Switch>
    );
};
export default App;
