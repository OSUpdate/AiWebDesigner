import React, {Component} from "react";
import SelectViewList from "../components/SelectViewList";
import Modal from "react-modal";
import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as viewActions from "../modules/view";
import * as postActions from "../modules/post";
import * as signActions from "../modules/sign";
import Loading from "../components/Loading";
import ViewTemplate from "../components/ViewTemplate";
import Header from "../components/common/Header";
import cx from "classnames";
import styles from"../components/css/agency.css";

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
        padding                 : "0"
        
    },
    overlay : {
        zIndex              :"10020"
    }
};
Modal.setAppElement("#root");
/* 템플릿 선택 컴포넌트 */
class SelectViewListContainer extends Component {
    /* 초기 로그인 여부 체크 함수*/
    initialize = async () => {
        const {SignActions, ViewActions, token} = this.props;
        if(localStorage.getItem("userInfo")){
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            SignActions.tempLogin(userInfo);
            try{
                await ViewActions.init(userInfo.token);
                await SignActions.checkLogin();
            }
            catch(e){
                if(token === "")
                    localStorage.removeItem("userInfo");
                this.handleNotInit();
            }
            return;
        }
        try{
            await SignActions.checkLogin();
            if(token !== "")
                await ViewActions.init(token);
        }
        catch(e){
            this.handleNotSignIn();
            
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
    /* 템플릿 선택 onClick 함수 */
    handleCheck = (e, id) => {
        e.preventDefault();
        const {ViewActions, template, view} = this.props;
        if(template){
            const checkedList = view.filter(
                (item)=>{
                    return item.get("checked") === true;
                }
            );
            if(checkedList.getIn([0,"id"]) === id && checkedList.size >= 1){
                ViewActions.toggle(id);
                return;
            }
            if(checkedList.size >= 1){
                ViewActions.error("한 개의 템플릿만 선택할 수 있습니다.");
                return;
            }
            ViewActions.toggle(id);
            return;
        }
        else
            ViewActions.toggle(id);
    }
    handleUpdateTemplate = async () => {
        const {ViewActions, page, end} = this.props;
        console.log("1");
        ViewActions.update();
        setTimeout(async () => {
            
            try{
                await ViewActions.updateTemplate(page);
            }
            catch(e){
                console.log(e);
            }
        },2000);
    
    }
    handleScroll = () => {
        const{end} = this.props;
        let scrollTop = this.scroll.scrollTop;
        let scrollHeight = this.scroll.scrollHeight;
        let clientHeight = this.scroll.clientHeight;
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        if(scrolledToBottom && !end){
            this.handleUpdateTemplate();
        }
    }
    /* 완료 버튼 onClick 함수 */
    handleSubmit = async () => {
        const {view, history, ViewActions, template, SignActions, token} = this.props; 
        try{
            await SignActions.checkLogin();
        }
        catch(e){
            this.handleNotSignIn();
            
        }
        //console.log(checkList[0]);
        const views = view.toJS();
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const checkedList = view.filter(
            (item)=>{
                return item.get("checked") === true;
            }
        );
        try{
            if(template){
                const checkedList = view.filter(
                    (item)=>{
                        return item.get("checked") === true;
                    }
                );
                if(checkedList.size === 0){
                    ViewActions.error("한 개의 템플릿을 선택해주세요.");
                    return;
                }
                await ViewActions.submit(userInfo.token, checkedList);
                console.log(`/editor/${userInfo.id}/${checkedList.toJS()[0].name}`);
                history.push(`/editor/${userInfo.id}/${checkedList.toJS()[0].name}/`);
                return;
            }
            else{
                if(checkedList.size === 0){
                    ViewActions.error("한 개 이상의 템플릿을 선택해주세요.");
                    return;
                }
                await ViewActions.setTemplates(userInfo.token, checkedList);
                return;
            }
        }
        catch(e){
            this.handleNotInit();
        }
        //console.log(checkedList.toJS());

    }
    handleCancelCheck = () => {
        const {ViewActions} = this.props;
        ViewActions.cancelChecked();
    }
    /* 비밀번호 변경 처리 결과 모달 확인 버튼 onClick 함수 */
    handleCloseMessage = () => {
        const {ViewActions, history} = this.props;
        ViewActions.closeMessage();
        
    }
    handleNotInit = () => {
        const {ViewActions} = this.props;
        ViewActions.error("서버와 연결에 문제가 발생했습니다.");
        
    }
    handleCloseExceed = () => {
        const {ViewActions} = this.props;
        ViewActions.closeMessage();
    }
    /* 로그인되어 있지 않을 경우 메시지 모달 확인 버튼 onClick 함수 */
    handleCloseNotSignIn = () => {
        const {ViewActions, history} = this.props;
        ViewActions.closeMessage();
        history.push("/");
    }
    /* 로그인되어 있지 않을 경우 실행되는 함수 */
    handleNotSignIn = () => {
        const {ViewActions} = this.props;
        ViewActions.error("로그인이 필요한 서비스입니다.");
    }
    async componentDidMount(){
        this.initialize();
        let view = document.getElementById("view");
        view.className = "view-noOverflow";
        
    }
    handleContinue = () => {
        const {history} = this.props;
        if(localStorage.getItem("saveInfo") && localStorage.getItem("userInfo")){
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const saveInfo = JSON.parse(localStorage.getItem("saveInfo"));
            history.push(`/editor/${userInfo.id}/${saveInfo.folder}`);
        }
        
    }
    handleDeleteHtml = () => {
        const {ViewActions, token, history} = this.props;
        ViewActions.deleteHtml(token);
        localStorage.removeItem("saveInfo");
        history.push("/");
    }
    componentWillUnmount(){
        const {ViewActions} = this.props;
        ViewActions.unmount();
        let view = document.getElementById("view");
        view.className = "";
    }
    /* 실제 화면에 렌더링 해주는 함수 */
    render(){
        const {view, post, error, loading, logged, loginId, history, message, title, content, setTemplate, update, continueMsg, continueTitle, continueContent} = this.props; 
        const {
            handleCancelCheck,
            handleContinue,
            handleDeleteHtml,
            handleCheck,
            handleSubmit,
            handleLogout,
            handleCloseMessage,
            handleCloseNotSignIn,
            handleNotSignIn,
            handleCloseExceed,
            handleScroll,
            home
        } = this;
        return (
            <React.Fragment>
                {logged?
                    loading? 
                        <Loading/>
                        :
                        <React.Fragment>
                            {setTemplate?
                                <Loading/>
                                :
                                ""
                            }
                            <Header
                                loginId={loginId} 
                                logged={logged}
                                onLogout={handleLogout}   
                            />
                            <div className={cx(styles.bg_light_gray, styles.h_85, styles.editor)}>
                                <div className={styles.info_view_content}ref={ref => {
                                    this.scroll = ref;
                                }} onScroll={handleScroll}>
                                    <ViewTemplate
                                        update={update}
                                        loginId={loginId}
                                        title="디자인 선택"
                                        subtitle="마음에 드는 디자인을 선택하세요"
                                    >   
                                        <SelectViewList
                                            view={view}
                                            onCheck={handleCheck}
                                        />
                
                                    </ViewTemplate>
                                    
                                </div>
                            </div>
                            <div className={styles.select_btn}>
                                <button className={cx(styles.btn, styles.btn_m)}
                                    onClick={handleCancelCheck}
                                >체크해제</button>
                                <button className={cx(styles.btn, styles.btn_m)}
                                    onClick={handleSubmit}
                                >완료</button>
                            </div>
                            <Modal 
                                isOpen={message}
                                style={messageStyles}
                                onRequestClose={handleCloseExceed}
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
                                    <button onClick={handleCloseExceed}>확인</button>
                                </div>
                            </Modal>
                            <Modal 
                                isOpen={continueMsg}
                                style={messageStyles}
                                onRequestClose={handleDeleteHtml}
                                contentLabel="modal"
                                closeTimeoutMS={400}
                            >
                                <div className={styles.message}>
                                    <div className={styles.message_header}>
                                        <h3>{continueTitle}</h3>
                                        
                                    </div>
                                    <div className={styles.message_content}>
                                        <h4>{continueContent}</h4>
                                    </div>
                                </div>
                                <div className={styles.option}>
                                    <button onClick={handleContinue}>예</button>
                                    <button onClick={handleDeleteHtml}>아니요</button>
                                </div>
                            </Modal>
                        </React.Fragment>
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
            </React.Fragment>

        );
    }
}
/* 상태 관리 라이브러리 Redux와 연동하는 부분 */
export default connect(
    (state) => ({
        view: state.view.get("view"),
        post: state.post.get("data"),
        loading: state.pender.pending["view/INIT"],
        setTemplate: state.pender.pending["view/SET_TEMPLATE"],
        error: state.pender.failure["view/INIT"],
        loginId: state.sign.get("loginId"),
        logged: state.sign.get("logged"),
        message: state.view.getIn(["message","modal"]),
        title: state.view.getIn(["message","title"]),
        content: state.view.getIn(["message","content"]),
        template: state.view.get("template"),
        token: state.sign.get("token"),
        update: state.view.get("update"),
        page: state.view.get("page"),
        end: state.view.get("end"),
        continueMsg: state.view.getIn(["continue","modal"]),
        continueTitle: state.view.getIn(["continue","title"]),
        continueContent: state.view.getIn(["continue","content"]),

    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        ViewActions: bindActionCreators(viewActions, dispatch),
        SignActions: bindActionCreators(signActions, dispatch)
    })  
)(withRouter(SelectViewListContainer));