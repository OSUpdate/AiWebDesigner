import React from "react";
import WebEditorContainer from "../containers/WebEditorContainer";
//import CodeEditor from "../containers/selectApp";

const WebEditorPage = ({match}) => {
    return (
        <React.Fragment>
            <WebEditorContainer>
                <h1>웹 에디터</h1>
            </WebEditorContainer>
        </React.Fragment>
    );
};

export default WebEditorPage;