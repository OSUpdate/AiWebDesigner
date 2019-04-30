import React, {Component}from "react";
import Header from "./common/Header";
import PanelList from "./PanelList";
import styles from "./css/agency.css";
import cx from "classnames";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import DropTarget from "./DropTarget";
import CodeEditor from "./CodeEditor";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { faAngleLeft, faAngleRight, faCode, faCheck, faCheckSquare, faImage} from "@fortawesome/free-solid-svg-icons";
import CssPanelList from "./CssPanelList";
import CssList from "./CssList";
import DropTargetTemplate from "./DropTargetTemplate";

class WebEditorTemplate extends Component {
    render(){
        /*
        <Sortable
                                    dangerouslySetInnerHTML={{ __html: children }}
                                    options={{
                                        animation: 150,
                                        group: {
                                            name: "clone1",
                                            pull: false,
                                            put: true
                                        },
                                        onEnd: (evt) => {
                                            console.log("end"+evt.target);
                                        },
                                        onRemove: (evt) => {
                                            console.log(evt.target);
                                        },
                                        onAdd: (evt) => {
                                            console.log(evt.target);
                                        }
                                    }}
                                    onDrop={(e)=>console.log(e.target)}
                                    onDragLeave={(e)=>console.log(e.target)}
                                >

                                </Sortable>
                                <DropTarget
                                    shape="shape"
                                >

                                </DropTarget>
        */
        const {children,panel,loginId, onMenuClick, logged, onEditorClick,onCssToggle,  onLogout, onMenuToggle, onEditorToggle, onMenuCheck, editor, onCodeChange, status, save, onSave, onSubmit, css, onCssCheck,
            onCssChange} = this.props;
        const btn1 = panel.getIn([0,"checked"]);
        const btn2 = panel.getIn([1,"checked"]);
        const btn3 = panel.getIn([2,"checked"]);
        const codeEditorToggle = true;
        return (
            <React.Fragment>
                <Header
                    loginId={loginId}    
                    logged={logged}
                    onLogout = {onLogout}
                />
                <section className={styles.editor}>
                    <div className={onMenuToggle?styles.editor_menu:cx(styles.editor_menu, styles.menu_close)}>
                        <ul className={onMenuToggle?cx(styles.nav, styles.nav_pills, styles.nav_stacked):styles.no_check}>
                            <li role="presentation" >
                                <a href="#" className={btn1? styles.clicked_btn:""} onClick={(e)=>onMenuCheck(e,0)}>
                                    <FontAwesomeIcon icon={faCheckSquare} style={styles.panel_icon}/><h4>버튼</h4>
                                    {btn1?
                                        <div className={cx(styles.tri, styles.slideInRight, styles.animated)}></div>
                                        :
                                        ""
                                    }
                                </a>
                            </li>
                            <li role="presentation" >
                                <a href="#" className={btn2? styles.clicked_btn:""} onClick={(e)=>onMenuCheck(e,1)}>
                                    <FontAwesomeIcon icon={faImage} style={styles.panel_icon}/><h4>이미지</h4>
                                    {btn2?
                                        <div className={cx(styles.tri, styles.slideInRight, styles.animated)}></div>
                                        :
                                        ""
                                    }
                                </a>
                            </li>
                            <li role="presentation" >
                                <a href="#" className={btn3? styles.clicked_btn:""} onClick={onSave}>
                                    <FontAwesomeIcon icon={faCheck} style={styles.panel_icon}/><h4>저장</h4>
                                    {btn3?
                                        <div className={cx(styles.tri, styles.slideInRight, styles.animated)}></div>
                                        :
                                        ""
                                    }
                                    
                                </a>
                            </li>
                            <li role="presentation" >
                                <a href="#" className={onEditorToggle? styles.clicked_btn:""} onClick={(e) => onEditorClick(e)}>
                                    <FontAwesomeIcon icon={faCode} style={styles.panel_icon}/><h4>편집기</h4>
                                </a>
                            </li>
                            <CssPanelList
                                css={css}
                                onClick={onCssCheck}
                            />
                        </ul>
                        <footer className={styles.panel_footer}>
                            <button className={styles.panel_btn} onClick={onSubmit}><h4>완료</h4></button>
                        </footer>
                    </div>
                    
                    <div className={onMenuToggle?styles.editor_content:cx(styles.editor_content, styles.content_open)}>
                        <div className={styles.panel_frame}>
                            <PanelList
                                panel={panel}    
                            />
                            <div className={styles.side_button}>
                                {onMenuToggle?
                                    <button className={styles.side_btn} onClick={onMenuClick} ><FontAwesomeIcon icon={faAngleLeft} size="3x" /></button>
                                    :
                                    <button className={styles.side_btn} onClick={onMenuClick} ><FontAwesomeIcon icon={faAngleRight} size="3x" /></button>
                                }
                            </div>
                           
                        </div>
                        <div className={(btn1||btn2||btn3) ? cx(styles.editor_view_frame, styles.w_85):styles.editor_view_frame}>
                            <div className={onEditorToggle || onCssToggle? cx(styles.editor_view, styles.h_70):styles.editor_view} >
                                
                                <DropTargetTemplate
                                    children={children}
                                    onChange={onCodeChange}
                                    css={css}
                                >

                                </DropTargetTemplate>
                                
                                {status?
                                    save?
                                        <div className={styles.status}>
                                            <div className={"fa fa-close fa-2x "+styles.fail}></div>
                                            <h4>저장 실패</h4>
                                        </div>
                                        :
                                        
                                        <div className={styles.status}>
                                            <div className={"fa fa-check fa-2x "+styles.success}></div>
                                            <h4>저장 성공</h4>
                                        </div>  
                                    :
                                    ""
                                }
                            </div>
                           
                            {onEditorToggle?
                                <React.Fragment>
                                    <div className={onEditorToggle? styles.code_header : cx(styles.code_header, styles.h_0)}>
                                        <div className={cx(styles.container, styles.bg_black)}>
                                            <div className={styles.code_header_title}>
                                                <p>코드 편집기</p>
                                            </div>
                                            <div>
                                                <ul className={styles.code_header_btn}>
                                                    <li>
                                                        <a onClick={(e) => onEditorClick(e)} className={styles.close_btn}>&times;</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                            
                                    <div className={onEditorToggle? cx(styles.container_editor_area, styles.h_30):cx(styles.container_editor_area)}>
                                
                                        <CodeEditor
                                            code={children}
                                            onChange={onCodeChange}
                                        >

                                        </CodeEditor>
                                    </div>
                                </React.Fragment>
                                :""}
                            <CssList 
                                css={css}
                                onChange={onCssChange}
                                onClick={onCssCheck}
                            />
                        </div>
                    </div>
                    
                </section>
            </React.Fragment>
        );
    }
}
export default DragDropContext(HTML5Backend)(WebEditorTemplate);