import React from "react";
import WebEditorContainer from "../containers/WebEditorContainer";
//import CodeEditor from "../containers/selectApp";
// 웹 편집 페이지
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