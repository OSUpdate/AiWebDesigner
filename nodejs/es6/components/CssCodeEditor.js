// eslint-disable-next-line no-unused-vars
import React,{Component} from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import styles from "./css/agency.css";
require("prismjs/components/prism-jsx");

class CssCodeEditor extends Component {
    editorDidMount = (editor, monaco) => {
        editor.focus();
    }
    render(){
        const {code,onChange,index} = this.props;
        const options = {
            selectOnLineNumbers: true
        };
        const{
            editorDidMount
        } = this;
        console.log(index,"editor");
        return (
            <React.Fragment>
                <Editor
                    placeholder="HTML 태그를 입력해주새요"
                    value={code}
                    onValueChange={code =>  onChange(code, index) }
                    highlight={code => highlight(code, languages.js)}
                    padding={10}
                   
                    style={{
                        fontSize: 18,

                    }}
                />
            </React.Fragment>
        );
    }

}
export default CssCodeEditor;