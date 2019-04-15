// eslint-disable-next-line no-unused-vars
import React,{Component} from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import styles from "./css/agency.css";
require("prismjs/components/prism-jsx");

class CodeEditor extends Component {
    editorDidMount = (editor, monaco) => {
        editor.focus();
    }
    render(){
        const {code,onChange} = this.props;
        const options = {
            selectOnLineNumbers: true
        };
        const{
            editorDidMount
        } = this;
        return (
            <React.Fragment>
                <Editor
                    placeholder="HTML 태그를 입력해주새요"
                    value={code}
                    onValueChange={code =>  onChange(code) }
                    highlight={code => highlight(code, languages.js)}
                    padding={10}
                   
                    style={{
                        fontSize: 18,
                        lineHeight: "1.1em",

                    }}
                />
            </React.Fragment>
        );
    }

}
export default CodeEditor;