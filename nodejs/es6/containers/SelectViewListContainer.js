import React, {Component} from "react";
import SelectViewList from "../components/SelectViewList";
import Modal from "react-modal";
import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import { List, Map, fromJS} from "immutable";
import * as viewActions from "../modules/view";
import * as postActions from "../modules/post";
import * as signActions from "../modules/sign";
import Loading from "../components/Loading";
import ViewTemplate from "../components/ViewTemplate";
import Header from "../components/common/Header";
import cx from "classnames";
import styles from"../components/css/agency.css";

// 메시지 모달 스타일
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
        // 로컬저장소에서 로그인 데이터 확인
        if(localStorage.getItem("userInfo")){
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            // 로그인 데이터가 있을 경우 임시 로그인 설정
            SignActions.tempLogin(userInfo);
            try{
                // 서버에 view 데이터 요청
                await ViewActions.init(userInfo.token);
                // 서버에 로그인 여부 체크
                await SignActions.checkLogin();
            }
            // 로그인 여부, 데이터 요청 중 에러 발생시 처리
            catch(e){
                if(token === "")
                    // 로컬저장소 로그인데이터 삭제
                    localStorage.removeItem("userInfo");
                // 로그인 안되어있는 경우 처리함수 호출
                this.handleNotInit();
            }
            return;
        }
        // 로컬저장소에 로그인 데이터가 없는 경우
        try{
            // 서버에 로그인 여부 체크
            await SignActions.checkLogin();
            if(token !== "")
                // 서버에 view 데이터 요청
                await ViewActions.init(token);
        }
        // 로그인 여부, 데이터 요청 중 에러 발생시 처리
        catch(e){
            // 로그인 안되어있는 경우 처리함수 호출
            this.handleNotSignIn();
            
        }
        
    }
    /* 로그아웃 버튼 onClick 함수 */
    handleLogout = async () => {
        const {SignActions, history} = this.props;
        try{
            // 서버에 로그아웃 요청
            await SignActions.logout();
            // 로컬저장소 로그인 데이터 삭제
            localStorage.removeItem("userInfo");
            //메인페이지로 이동
            history.push("/");
        }
        // 로그아웃 중 에러 발생시 처리
        catch(e){
            // 로그인 안되어있는 경우 처리함수 호출
            this.handleNotInit();
        }
    }
    /* 모든 템플릿 선택 onClick 함수 */
    handleCheck = (e, id) => {
        e.preventDefault();
        const {ViewActions, template, view,history} = this.props;
        // 한번 템플릿을 선택한 경우
        if(template){
            // 선택된 리스트를 가져옴
            const checkedList = view.filter(
                (item)=>{
                    return item.get("checked") === true;
                }
            );
            // 이미 선택되어 있는 템플릿이 선택되었을 경우
            if(checkedList.getIn([0,"id"]) === id && checkedList.size >= 1){
                // 해당 템플릿 toggle 함수 호출
                ViewActions.toggle(id);
                return;
            }
            // 선택된 템플릿이 1개 있을 경우
            if(checkedList.size >= 1){
                // 에러 처리 함수 호출
                ViewActions.error("한 개의 템플릿만 선택할 수 있습니다.");
                return;
            }
            // 해당 템플릿 toggle 함수 호출
            ViewActions.toggle(id);
            return;
        }
        // 처음 선택 하는 경우
        else
        // 해당 템플릿 toggle 함수 호출
            ViewActions.toggle(id);
    }
    /* 추천 템플릿 선택 onClick 함수 */
    handleRecommendCheck = (e, id) => {
        e.preventDefault();
        const {ViewActions, template, recommend} = this.props;
        // 한번 템플릿을 선택한 경우
        if(template){
            // 선택된 리스트를 가져옴
            const checkedList = recommend.filter(
                (item)=>{
                    return item.get("checked") === true;
                }
            );
            // 이미 선택되어 있는 템플릿이 선택되었을 경우
            if(checkedList.getIn([0,"id"]) === id && checkedList.size >= 1){
                // 해당 템플릿 toggle 함수 호출
                ViewActions.recommendToggle(id);
                return;
            }
            // 선택된 템플릿이 1개 있을 경우
            if(checkedList.size >= 1){
                // 에러 처리 함수 호출
                ViewActions.error("한 개의 템플릿만 선택할 수 있습니다.");
                return;
            }
            // 해당 템플릿 toggle 함수 호출
            ViewActions.recommendToggle(id);
            return;
        }
        // 처음 선택 하는 경우
        else
            // 해당 템플릿 toggle 함수 호출
            ViewActions.recommendToggle(id);
    }
    /* 최근 사용자 작업 템플릿 선택 onClick 함수 */
    handleUserCheck = (e, id) => {
        e.preventDefault();
        const {ViewActions, template, user} = this.props;
        // 한번 템플릿을 선택한 경우
        if(template){
            // 선택된 리스트를 가져옴
            const checkedList = user.filter(
                (item)=>{
                    return item.get("checked") === true;
                }
            );
            // 이미 선택되어 있는 템플릿이 선택되었을 경우
            if(checkedList.getIn([0,"id"]) === id && checkedList.size >= 1){
                // 해당 템플릿 toggle 함수 호출
                ViewActions.userToggle(id);
                return;
            }
            // 선택된 템플릿이 1개 있을 경우
            if(checkedList.size >= 1){
                // 해당 템플릿 toggle 함수 호출
                ViewActions.error("한 개의 템플릿만 선택할 수 있습니다.");
                return;
            }
            // 해당 템플릿 toggle 함수 호출
            ViewActions.userToggle(id);
            return;
        }
        // 처음 선택 하는 경우
        else
            // 해당 템플릿 toggle 함수 호출
            ViewActions.userToggle(id);
    }
    /* 모든 템플릿 페이징 처리 함수 */
    handleUpdateTemplate = async () => {
        const {ViewActions, page, end} = this.props;
        // 페이지 증가
        ViewActions.update();
        // 2초 후 실행
        setTimeout(async () => {
            
            try{
                // 서버에 페이지 데이터 요청
                await ViewActions.updateTemplate(page);
            }
            // 데이터 요청 중 에러 발생시 처리
            catch(e){
                console.log(e);
            }
        },2000);
    
    }
    /* 모든 템플릿 스크롤 이벤트 */
    handleScroll = () => {
        const{end} = this.props;
        let scrollTop = this.scroll.scrollTop;
        let scrollHeight = this.scroll.scrollHeight;
        let clientHeight = this.scroll.clientHeight;
        // 페이지 맨 아래인지 계산
        let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        // 맨 아래이고 페이지가 더 남은 경우
        if(scrolledToBottom && !end){
            // 페이징 처리 함수 호출
            this.handleUpdateTemplate();
        }
    }
    /* 완료 버튼 onClick 함수 */
    handleSubmit = async () => {
        const {view, history, ViewActions, template, SignActions, token, recommend, user} = this.props; 
        try{
            // 로그인 체크
            await SignActions.checkLogin();
        }
        // 로그인 체크 중 에러 발생시 처리
        catch(e){
            // 로그인이 안되어있을 경우 함수 호출
            this.handleNotSignIn();
            
        }
        
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        
        try{
            // 한번 완료버튼을 누른 경우
            if(template){
                // 추천 템플릿만 있으므로 이 중 선택된 요소 가져옴
                const checkedList = recommend.filter(
                    (item)=>{
                        return item.get("checked") === true;
                    }
                );
                // 아무 템플릿도 선택하지 않은 경우
                if(checkedList.size === 0 ){
                    // 에러 처리 함수 호출
                    ViewActions.error("한 개의 템플릿을 선택해주세요.");
                    return;
                }
                // 선택한 템플릿 데이터 서버에 전송
                await ViewActions.submit(userInfo.token, checkedList);
                // 페이지 이동
                history.push(`/editor/${userInfo.id}/${checkedList.toJS()[0].name}/`);
                return;
            }
            // 처음 완료버튼을 누른 경우
            else{
                // 최근 사용자 작업 템플릿 중 선택된 템플릿 가져옴
                const userCheckList = user.filter(
                    (item)=>{
                        return item.get("checked") === true;
                    }
                );
                // 추천 템플릿 중 선택된 템플릿 가져옴
                const recommendCheckList = recommend.filter(
                    (item)=>{
                        return item.get("checked") === true;
                    }
                );
                // 모든 템플릿 중 선탹된 템플릿 가져옴
                const checkedList = view.filter(
                    (item)=>{
                        return item.get("checked") === true;
                    }
                );
                // 위 3 배열을 합쳐 하나의 배열로 만듬
                const resultList = fromJS(checkedList
                    .concat(userCheckList,recommendCheckList)
                    .toJS()
                    // 중복 요소 제거
                    .reduce((acc, data) => {
                        const found = acc.find((a)=>a.name ===data.name);
                        if(!found)
                            acc.push(data);
                        return acc;
                    },[]));
                // 아무것도 선택하지 않은 경우
                if(resultList.size === 0 ){
                    // 에러 처리 함수 호출
                    ViewActions.error("한 개 이상의 템플릿을 선택해주세요.");
                    return;
                }
                // 서버에 선택한 데이터를 기반으로 템플릿 요청
                await ViewActions.setTemplates(userInfo.token, resultList);
                return;
            }
        }
        // 서버에서 데이터 처리 중 에러 발생시 처리
        catch(e){
            // 에러 처리 함수 호출
            this.handleNotInit();
        }
        //console.log(checkedList.toJS());

    }
    /* 체크된 템플릿 체크 해제 함수 */
    handleCancelCheck = () => {
        const {ViewActions} = this.props;
        ViewActions.cancelChecked();
    }
    /* 비밀번호 변경 처리 결과 모달 확인 버튼 onClick 함수 */
    handleCloseMessage = () => {
        const {ViewActions, history} = this.props;
        ViewActions.closeMessage();
        
    }
    /* 초기화중 문제가 생긴 경우 실행 함수 */
    handleNotInit = () => {
        const {ViewActions} = this.props;
        ViewActions.error("서버와 연결에 문제가 발생했습니다.");
        
    }
    /* 모달 close 함수 */
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
    /* 컴포넌트 실행 후 호출 함수 */
    async componentDidMount(){
        // 초기화
        this.initialize();
        // css 설정
        let view = document.getElementById("view");
        view.className = "view-noOverflow";
        
    }
    /* 이전에 중단한 작업이 있을 경우 실행 함수 */
    handleContinue = () => {
        const {history} = this.props;
        // 저장 데이터와 로그인 데이터가 있을 경우
        if(localStorage.getItem("saveInfo") && localStorage.getItem("userInfo")){
            // 로컬저장소에서 로그인 데이터, 편집 데이터를 가져옴
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const saveInfo = JSON.parse(localStorage.getItem("saveInfo"));
            // 편집 페이지로 이동
            history.push(`/editor/${userInfo.id}/${saveInfo.folder}/`);
        }
        
    }
    /* 이전에 중단한 작업을 삭제하는 경우 실행 함수 */
    handleDeleteHtml = () => {
        const {ViewActions, token, history} = this.props;
        // 서버에 작업한 데이터 삭제 요청
        ViewActions.deleteHtml(token);
        // 로컬저장소 저장 데이터 삭제
        localStorage.removeItem("saveInfo");
        //메인 페이지 이동
        history.push("/");
    }
    /* 컴포넌트 제거 함수 */
    componentWillUnmount(){
        const {ViewActions} = this.props;
        // 변수값 초기화
        ViewActions.unmount();
        // css 제거
        let view = document.getElementById("view");
        view.className = "";
    }
    /* 실제 화면에 렌더링 해주는 함수 */
    render(){
        const {view, post, error, user, loading, logged, loginId, history, message, title, content, setTemplate, update, continueMsg, continueTitle, continueContent, recommend, template} = this.props; 
        const {
            handleCancelCheck,
            handleContinue,
            handleDeleteHtml,
            handleCheck,
            handleSubmit,
            handleLogout,
            handleCloseMessage,
            handleUserCheck,
            handleRecommendCheck,
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
                                            recommend={recommend}
                                            view={view}
                                            user={user}
                                            onTemplate={template}
                                            onCheck={handleCheck}
                                            onUserCheck={handleUserCheck}
                                            onRecommendCheck={handleRecommendCheck}
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
        recommend: state.view.get("recommend"),
        user:state.view.get("user")

    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        ViewActions: bindActionCreators(viewActions, dispatch),
        SignActions: bindActionCreators(signActions, dispatch)
    })  
)(withRouter(SelectViewListContainer));