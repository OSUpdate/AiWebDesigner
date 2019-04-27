import React, {Component} from "react";
import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import * as postActions from "../modules/post";
import * as forgotActions from "../modules/forgot";
import ForgotTemplate from "../components/ForgotTemplate";
import Modal from "react-modal";
import Loading from "../components/Loading";
import styles from "../components/css/agency.css";

// 모달 창 스타일 설정
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
/* 아이디 찾기, 비밀번호 찾기 UI 컴포넌트 */
class ForgotContainer extends Component {
    /* 컴포넌트 로드 후 로그인 되어있을 경우 홈 화면으로 이동 */
    componentDidMount(){
        const {history} = this.props;
        // 로그인이 되어있지 않으면 메인 페이지로 이동
        if(localStorage.getItem("userInfo")){
            // 메인 페이지로 이동
            history.push("/");
            return;
        }
    }
    /* 아이디 찾기 버튼 onClick 함수 */
    handleForgotIsFindId = () => {
        const {ForgotActions} = this.props;
        // 아이디 찾기 화면으로 변경
        ForgotActions.isFindId();
    }
    /* 비밀번호 찾기 버튼 onClick 함수 */
    handleForgotIsFindPw = () => {
        const {ForgotActions} = this.props;
        // 비밀번호 찾기 화면으로 변경
        ForgotActions.isFindPw();
    }
    /* 아이디 찾기 이메일 입력 onChange 함수 */
    handleFindIdInput = (e) => {
        const {ForgotActions} = this.props;
        // input 태그 value 변경 함수 호출
        ForgotActions.inputIdEmail(e.target.value);
    }
    /* 비밀번호 찾기 입력 onChange 함수 */
    handleFindPwInput = (e) => {
        const {ForgotActions} = this.props;
        switch(e.target.name){
        // 이벤트가 발생한 input 태그가 id인 경우
        case "id":
            // input 태그 value 변경 함수 호출
            ForgotActions.inputPwId(e.target.value);
            break;
        // 이벤트가 발생한 input 태그가 email인 경우
        case "email":
            // input 태그 value 변경 함수 호출
            ForgotActions.inputPwEmail(e.target.value);
            break;
        }
    }
    /* 비밀번호 변경 인증코드 onChange 함수 */
    handleCertifiedInput = (e) => {
        const {ForgotActions} = this.props;
        // input 태그 value 변경 함수 호출
        ForgotActions.inputCertified(e.target.value);

    }
    /* 비밀번호 변경 onChange 함수 */
    handlePwInput = (e) => {
        const {ForgotActions} = this.props;
        switch(e.target.name){
        // 이벤트가 발생한 input 태그가 password인 경우
        case "password":
            // input 태그 value 변경 함수 호출
            ForgotActions.inputPassword(e.target.value);
            break;
        // 이벤트가 발생한 input 태그가 check인 경우
        case "check":
            // input 태그 value 변경 함수 호출
            ForgotActions.inputPwCheck(e.target.value);
            break;
        }
    }
    /* 비밀번호 변경 onKeyUp 함수 */
    handlePwChange = (e) => {
        const {ForgotActions} = this.props;
        switch(e.target.name){
        // 이벤트가 발생한 input 태그가 password인 경우
        case "password":
            // input 태그 value 변경 함수 호출
            ForgotActions.changePassword(e.target.value);
            break;
        // 이벤트가 발생한 input 태그가 check인 경우
        case "check":
            // input 태그 value 변경 함수 호출
            ForgotActions.changePwCheck(e.target.value);
            break;
        }
    }
    /* 아이디 찾기 확인 버튼 onClick 함수 */
    handleFindId = async () => {
        const {ForgotActions, findId} = this.props;
        try{
            // 서버에 아이디 찾기 요청
            await ForgotActions.findId(findId.getIn(["value"]));
        }
        catch(e){
            console.log(e);
        }
    }
    /* 비밀번호 찾기 확인 버튼 onClick 함수 */
    handleFindPw = async () => {
        const {ForgotActions, findPw} = this.props;
        try{
            // 서버에 비밀번호 찾기 요청
            await ForgotActions.findPassword(findPw.getIn([0,"value"]), findPw.getIn([1,"value"]));
        }
        catch(e){
            console.log(e);
        }
    }
    /* 비밀번호가 존재할 경우 변경 모달 open 함수 */
    handleChangeOpenModal = () => {
        const {ForgotActions} = this.props;
        // 비밀번호 변경 모달 open
        ForgotActions.changeOpenModal();
    }
    /* 비밀번호가 존재할 경우 변경 모달 close 함수 */
    handleChangeCloseModal = () => {
        const {ForgotActions} = this.props;
        // 비밀번호 변경 모달 close
        ForgotActions.changeCloseModal();
    }
    /* 이메일 인증 모달 open 함수 */
    handleCertifiedOpenModal = () => {
        const {ForgotActions} = this.props;
        // 이메일 인증 모달 open
        ForgotActions.certifiedOpenModal();
    }
    /* 이메일 인증 모달 close 함수 */
    handleCertifiedCloseModal = () => {
        const {ForgotActions} = this.props;
        // 이메일 인증 모달 close
        ForgotActions.certifiedCloseModal();
    }
    /* 성공, 실패시 메시지 모달 close 함수 */
    handleCloseMessage = () => {
        const {ForgotActions} = this.props;
        // 메시지 모달 close
        ForgotActions.closeMessage();
    }
    /* 이메일 인증 요청 함수 */
    handleCertifiedUser = async () => {
        const {ForgotActions, certified, token} = this.props;
        try{
            // 서버에 이메일 인증 요청
            await ForgotActions.certifiedUser(
                certified.get("value"),
                token
            );
        }
        // 이메일 인증 중 에러 발생시 처리
        catch(e){
            console.log(e);
        }
    }
    /* 비밀번호가 존재할 경우 변경 확인 onClick 함수 */
    handleChange = async () => {
        const {ForgotActions, changePw, token} = this.props;
        try{
            // 서버에 비밀번호 변경 요청
            await ForgotActions.changeUser(
                changePw.getIn([0,"value"]),
                changePw.getIn([1,"value"]),
                token
            );
        }
        // 비밀번호 변경 중 에러 발생시 처리
        catch(e){
            console.log(e);
        }
    }
    /* 상태 업데이트가 일어난 후 실행되는 API */
    /*
    shouldComponentUpdate(nextProps, nextState) {
        
        if(nextProps.changePw.getIn([1,"value"]) !== this.props.changePw.getIn([1,"value"]))
            return true;
        if(nextProps.changePw.getIn([0,"value"]) !== this.props.changePw.getIn([0,"value"]))
            return true;
        if(nextProps.findId.get("value") !== this.props.findId.get("value"))
            return true;
        if(nextProps.findPw.getIn([0,"value"]) !== this.props.findPw.getIn([0,"value"]))
            return true;
        if(nextProps.findPw.getIn([1,"value"]) !== this.props.findPw.getIn([1,"value"]))
            return true;
        if(nextProps.forgotToggle !== this.props.forgotToggle || 
            nextProps.modalIsOpen !== this.props.modalIsOpen || 
            nextProps.message !== this.props.message)
            return true;
        
        return false;
    }
    */
    /* 실제 화면에 렌더링 해주는 함수 */
    render(){
        const {post, error, loading, logged, forgotToggle, changePw, findPw, findId, changeIsOpen, message, title, content, certifiedIsOpen, certified} = this.props;
        const {
            handleForgotIsFindId,
            handleForgotIsFindPw,
            handleFindIdInput,
            handleFindPwInput,
            handlePwInput,
            handlePwChange,
            handleChangeOpenModal,
            handleChangeCloseModal,
            handleCertifiedOpenModal,
            handleCertifiedCloseModal,
            handleFindId,
            handleFindPw,
            handleCloseMessage,
            handleChange,
            handleCertifiedInput,
            handleCertifiedUser
        } = this;
        return (

            <div className="index non-scroll">
                <ForgotTemplate
                    changeIsOpen={changeIsOpen}
                    certified={certified}
                    certifiedIsOpen={certifiedIsOpen}
                    forgotToggle={forgotToggle}
                    onIdToggle={handleForgotIsFindId}
                    onPwToggle={handleForgotIsFindPw}
                    changePw={changePw}
                    findPw={findPw}
                    findId={findId}
                    onFindIdInput={handleFindIdInput}
                    onFindPwInput={handleFindPwInput}
                    onPwInput={handlePwInput}
                    onPwChange={handlePwChange}
                    onFindId={handleFindId}
                    onFindPw={handleFindPw}
                    changOpenModal={handleChangeOpenModal}
                    certifiedOpenModel={handleCertifiedOpenModal}
                    certifiedCloseModal={handleCertifiedCloseModal}
                    changeCloseModal={handleChangeCloseModal}
                    onChangeUser={handleChange}
                    onCertified={handleCertifiedInput}
                    onCertifiedUser={handleCertifiedUser}
                />   
                <Modal 
                    isOpen={message}
                    style={messageStyles}
                    onRequestClose={handleCloseMessage}
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
                        <button onClick={handleCloseMessage}>확인</button>
                    </div>
                </Modal>
            </div>

        );
    }
}
/* 상태 관리 라이브러리 Redux와 연동하는 부분 */
export default connect(
    (state) => ({
        findId: state.forgot.get("findId"),
        findPw: state.forgot.get("findPw"),
        changePw: state.forgot.get("change"),
        forgotToggle: state.forgot.get("toggle"),
        changeIsOpen: state.forgot.get("changeModal"),
        certifiedIsOpen: state.forgot.get("certifiedModal"),
        certified: state.forgot.get("certified"),
        message: state.forgot.getIn(["message","modal"]),
        title: state.forgot.getIn(["message","title"]),
        content: state.forgot.getIn(["message","content"]),
        post: state.post.get("data"),
        loading: state.pender.pending["GET_POST"],
        error: state.pender.failure["GET_POST"],
        token: state.forgot.get("token")

    }),
    (dispatch) => ({
        ForgotActions: bindActionCreators(forgotActions, dispatch),
        PostActions: bindActionCreators(postActions, dispatch)
    })  
)(withRouter(ForgotContainer));
