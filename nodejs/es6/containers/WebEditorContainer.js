import React, {Component} from "react";
import SelectViewList from "../components/SelectViewList";
import Modal from "react-modal";
import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as panelActions from "../modules/panel";
import * as postActions from "../modules/post";
import * as signActions from "../modules/sign";
import * as editorActions from "../modules/editor";
import WebEditorTemplate from "../components/WebEditorTemplate";
import cx from "classnames";
import Loading from "../components/Loading";
import styles from "../components/css/agency.css";
import axios from "axios";

const messageStyles = {
    content : {
        top                   : "50%",
        left                  : "50%",
        right                 : "auto",
        bottom                : "auto",
        marginRight           : "-50%",
        transform             : "translate(-50%, -50%)",
        boxShadow             : "1px 1px 15px 1px #aaaaaa",
        width                 : "100%",
        maxWidth              : "400px",
        margin                : "4em auto",
        transition            : "all .5s ease",
        padding                 : "0",
        
        
    },
    overlay : {
        zIndex              :"10020"
    }
};
Modal.setAppElement("#root");

/* 편집기 UI 컴포넌트 */
class WebEditorContainer extends Component {
    /* 초기 로그인 여부 체크 함수 */
    initialize = async () => {
        const {SignActions, EditorActions, PanelActions, token} = this.props;
        if(localStorage.getItem("userInfo")){
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            SignActions.tempLogin(userInfo);
            try{
                await EditorActions.init(userInfo.token);
                await PanelActions.init(userInfo.token);
            }
            catch(e){
                this.handleNotInit();
            }
            return;
        }
        try {
            await SignActions.checkLogin();
            if(token !== ""){
                await EditorActions.init(token);
                await PanelActions.init(token);
            }
        }
        catch(e){
            this.handleNotSignIn();
            localStorage.removeItem("userInfo");
        }
        
    }
    /* 로그아웃 버튼 onClick 함수 */
    handleLogout = async () => {
        const {SignActions, history} = this.props;
        try{
            await SignActions.logout();
            localStorage.removeItem("userInfo");
            history.push("/");
        }
        catch(e){
            this.handleNotInit();
        }
    }
    /* 버튼, 이미지 등 패널 버튼 onClick 함수 */
    handleCheck = (e,id) => {
        const {PanelActions} = this.props;
        e.currentTarget.blur();
        PanelActions.toggle(id);
    }
    /* 메뉴창 toggle 함수 */
    handleMenuToggle = () => {
        const {PanelActions} = this.props;
        PanelActions.menuToggle();
    }
    handleCssMenuCheck = (e, id) => {
        const {EditorActions} = this.props;
        e.currentTarget.blur();
        EditorActions.cssToggle(id);
    }
    /* 코드 편집기 버튼 onClick toogle 함수 */
    handleEditorToggle = (e) => {
        const {EditorActions} = this.props;
        e.currentTarget.blur();
        EditorActions.toggle();
    }
    /* 코드 편집기 코드 입력, 버튼 추가 함수 */
    handleCodeChange = (code) => {
        const {EditorActions} = this.props;
        EditorActions.change(code);
    }
    handleCssCodeChange = (code, id) => {
        const {EditorActions} = this.props;
        EditorActions.cssChange([code, id]);
    }
    /* 로그인되어 있지 않을 경우 실행되는 함수 */
    handleNotSignIn = () => {
        const {EditorActions} = this.props;
        EditorActions.error("로그인이 필요한 서비스입니다.");
    }
    handleNotInit = () => {
        const {EditorActions} = this.props;
        EditorActions.error("서버와 연결에 문제가 발생했습니다.");
    }
    /* 로그인되어 있지 않을 경우 메시지 모달 확인 버튼 onClick 함수 */
    handleCloseNotSignIn = () => {
        const {EditorActions, history} = this.props;
        EditorActions.closeMessage();
        history.push("/");
    }
    handleSave = () => {
        const {EditorActions, token, editor, css, history} = this.props;
        EditorActions.save(token, editor.get("content"), editor.get("name"),css);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        localStorage.setItem(
            "saveInfo",
            JSON.stringify({
                folder: editor.get("name")
            })
        );
        //console.log(css.toJS());
        /*
        css.map(
            (item) => {
                const { name } = item.toJS();
                console.log(`/editor/${userInfo.id}/${editor.get("name")}/${name}`);
                axios.patch(`/editor/${userInfo.id}/${editor.get("name")}/${name}`);
            }
        );*/
        setTimeout(()=>EditorActions.closeStatus(),3000);
        
        console.log(`/editor/${userInfo.id}/${editor.get("name")}`);
        history.push(`/editor/${userInfo.id}/${editor.get("name")}`);

    }
    handleSubmit = async () => {
        const {EditorActions, token, editor, css} = this.props;
        localStorage.setItem(
            "saveInfo",
            JSON.stringify({
                folder: editor.get("name")
            })
        );
        try{
            await EditorActions.submit(token, editor.get("content"), editor.get("name"), css);
            //await EditorActions.download(token);
            setTimeout(()=>EditorActions.closeStatus(),3000);
        }
        catch(e){
            console.log(e);
        }
    }
    /* 컴포넌트 로드 후 테스트용 템플릿 추가*/
    componentDidMount(){
        this.initialize();

        /*
        PanelActions.insert([
            "<button>test</button>",
            "<button>test1</button>",
            "<button>test2</button>"
        ]);
        PanelActions.insert(["<button>test</button"]);
        PanelActions.insert(["<button>test</button"]);
        */
    }
    componentWillUnmount() {
        const {EditorActions} = this.props;
        EditorActions.unmount();
    }
    /* 실제 화면에 렌더링 해주는 함수 */
    render(){
        
        const html = `
            <body>
                <header>
                    <div>
                        <h1>헤더</h1>
                    </div>
                </header>
                <section>
                    <div>
                        <h1>컨텐츠</h1>
                    </div>
                </section>

            </body>`;
        const {panel, post, error, loading, loginId, logged, cssToggle, menuToggle, editorToggle, editor, history, message, title, content, statusToggle, save, editLoading, panelLoading, css} = this.props; 
        const {
            handleCheck,
            handleCssMenuCheck,
            home,
            handleMenuToggle,
            handleEditorToggle,
            handleCodeChange,
            handleLogout,
            handleCloseNotSignIn,
            handleSave,
            handleSubmit,
            handleCssCodeChange
        } = this;
        return (

            <div className={cx(styles.index, styles.non_scroll)}>
                {logged?
                    ((editLoading||panelLoading)? 
                        <Loading/>
                        :
                        <React.Fragment>
                            <WebEditorTemplate
                                logged={logged}
                                panel={panel}
                                editor={editor}
                                onCodeChange={handleCodeChange}
                                onMenuCheck={handleCheck}
                                loginId={loginId}
                                children={editor.get("content")}
                                onMenuToggle={menuToggle}
                                onMenuClick={handleMenuToggle}
                                onEditorToggle={editorToggle}
                                onEditorClick={handleEditorToggle}
                                onLogout={handleLogout}
                                status={statusToggle}
                                save={save}
                                onSave={handleSave}
                                onSubmit={handleSubmit}
                                css={css}
                                onCssCheck={handleCssMenuCheck}
                                onCssChange={handleCssCodeChange}
                                onCssToggle={cssToggle}
                            />   
                    
                            <Modal 
                                isOpen={message}
                                style={messageStyles}
                                onRequestClose={handleCloseNotSignIn}
                                contentLabel="modal"
                                closeTimeoutMS={400}
                            >
                                <div className={styles.message}>
                                    <div className={styles.message_header}>
                                        <h3>{title}</h3>
                                        
                                    </div>
                                    <div className={styles.message_content}>
                                        <h4>{content}</h4>
                                    </div>
                                </div>
                                <div className={styles.option}>
                                    <button onClick={handleCloseNotSignIn}>확인</button>
                                </div>
                            </Modal>
                            
                        </React.Fragment>
                    )
                    :
                    <Modal 
                        isOpen={message}
                        style={messageStyles}
                        onRequestClose={handleCloseNotSignIn}
                        contentLabel="modal"
                        closeTimeoutMS={400}
                    >
                        <div className={styles.message}>
                            <div className={styles.message_header}>
                                <h3>{title}</h3>
                                        
                            </div>
                            <div className={styles.message_content}>
                                <h4>{content}</h4>
                            </div>
                        </div>
                        <div className={styles.option}>
                            <button onClick={handleCloseNotSignIn}>확인</button>
                        </div>
                    </Modal>
                    
                }
            </div>

        );
    }
}
/* 상태 관리 라이브러리 Redux와 연동하는 부분 */
export default connect(
    (state) => ({
        panel: state.panel.get("panel"),
        menuToggle: state.panel.get("menuToggle"),
        editor: state.editor.get("editor"),
        editorToggle: state.editor.get("toggle"),
        post: state.post.get("data"),
        editLoading: state.pender.pending["editor/INIT"],
        panelLoading: state.pender.pending["panel/INIT"],
        editError: state.pender.failure["editor/INIT"],
        panelError: state.pender.failure["panel/INIT"],
        loginId: state.sign.get("loginId"),
        logged: state.sign.get("logged"),
        message: state.editor.getIn(["message","modal"]),
        title: state.editor.getIn(["message","title"]),
        content: state.editor.getIn(["message","content"]),
        token: state.sign.get("token"),
        save:state.editor.getIn(["status","error"]),
        statusToggle: state.editor.get("statusToggle"),
        css:state.editor.get("css"),
        cssToggle:state.editor.get("cssToggle")

    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        PanelActions: bindActionCreators(panelActions, dispatch),
        EditorActions:  bindActionCreators(editorActions, dispatch),
        SignActions: bindActionCreators(signActions, dispatch)
    })  
)(withRouter(WebEditorContainer));
