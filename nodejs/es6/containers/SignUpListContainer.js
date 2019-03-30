import React, {Component} from "react";

import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import Modal from "react-modal";
import {Link} from "react-router-dom";

import * as signActions from "../modules/sign";
import * as postActions from "../modules/post";

import SignUpList from "../components/SignUpList";
import SignInList from "../components/SignInList";
import styles from "../components/style.css";
import messageModal from"../components/css/agency.css";
import Loading from "../components/Loading";
import bcrypt from "bcryptjs";

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
        zIndex              :"10021"
    }
};

const signupStyles = {
    content : {
        top                   : "50%",
        left                  : "50%",
        right                 : "auto",
        bottom                : "auto",
        marginRight           : "-50%",
        transform             : "translate(-50%, -50%)",
        boxShadow             : "1px 1px 15px 1px #aaaaaa",
        overflow: "none",
        width                 : "100%",
        maxWidth              : "400px",
        margin                : "4em auto",

    },
    overlay : {
        zIndex              :"10020"
    }
};

const signinStyles = {
    content : {
        top                   : "50%",
        left                  : "50%",
        right                 : "auto",
        bottom                : "auto",
        marginRight           : "-50%",
        transform             : "translate(-50%, -50%)",
        overflow: "none",
        boxShadow             : "1px 1px 15px 1px #aaaaaa",
        width                 : "100%",
        maxWidth              : "400px",
        margin                : "4em auto",
        
    },
    overlay : {
        zIndex              :"10020"
    }
};
Modal.setAppElement("#root");

/* 회원가입 및 로그인 UI 컴포넌트 */
class SignUpListContainer extends Component {
    /* 초기 로그인 여부 체크 함수 */
    initialize = async () => {
        const {SignActions} = this.props;
        if(localStorage.getItem("userInfo")){
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            SignActions.tempLogin(userInfo);
            try{
                await SignActions.checkLogin();
            }
            catch(e){
                localStorage.removeItem("userInfo");
            }
            return;
        }
    }
    /* 회원가입 모달 open 함수 */
    signUpOpenModal = () => {
        const {SignActions} = this.props;
        SignActions.openModal();
        SignActions.isSignUp();
    }
    /* 로그인 모달 open 함수 */
    signInOpenModal = () => {
        const {SignActions} = this.props;
        SignActions.openModal();
        SignActions.isSignIn();
    }
    /* 모달 open 후 처리 함수 */
    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = "#f00";
    }
    /* 모달 close 함수 */
    closeModal = () => {
        const {SignActions} = this.props;
        SignActions.closeModal();
    }
    handleLogoutFail = () => {
        const {SignActions} = this.props;
        SignActions.error("로그아웃에 실패했습니다.");
    }
    handleSignUpFail = () => {
        const {SignActions} = this.props;
        SignActions.clear();
    }
    handleSignInFail = () => {
        const {SignActions} = this.props;
        SignActions.error("아이디 혹은 비밀번호를 확인해주세요.");
    }
    /* 로그아웃 버튼 onClick 함수 */
    handleLogout = async () => {
        const {SignActions} = this.props;
        try{
            await SignActions.logout();
            localStorage.removeItem("userInfo");
        }
        catch(e){
            this.handleLogoutFail();
        }
    }
    /* 회원가입 버튼 onClick 함수 */
    handleSignUp = async () => {
        const {SignActions, signUp} = this.props;
        const checkedList = signUp.filter(
            (item)=>{
                return item.get("checked") === true;
            }
        );
        const valueList = signUp.filter(
            (item)=>{
                return item.get("value") === "";
            }
        );
        if((checkedList.size > 0)|| valueList.size > 0)
            return;
        
        try{
            await SignActions.signUp(
                signUp.getIn([0,"value"]),
                signUp.getIn([1,"value"]),
                signUp.getIn([2,"value"]),
                signUp.getIn([3,"value"])
            );
        }
        catch(e){
            this.handleSignUpFail();
        }
    }
    /* 로그인 버튼 onClick 함수 */
    handleSignIn = async () => {
        const {SignActions, signIn} = this.props;
        try{
            await SignActions.signIn(
                signIn.getIn([0,"value"]),
                signIn.getIn([1,"value"])
            );
        }
        catch(e){
            this.handleSignInFail();
        }
    }
    /* 회원가입 입력시 상태 업데이트 onChange 함수 */
    handleSignUpInput = (e) => {
        const {SignActions} = this.props;
        switch(e.target.name){
        case "id":
            SignActions.inputId(e.target.value);
            break;
        case "password":
            SignActions.inputPassword(e.target.value);
            break;
        case "check":
            SignActions.inputCheck(e.target.value);
            break;
        case "email":
            SignActions.inputEmail(e.target.value);
            break;
        }
    }
    /* 회원가입 입력시 입력값 검증 onKeyUp 함수 */
    handleSignUpChange = (e) => {
        const {SignActions} = this.props;
        switch(e.target.name){
        case "id":
            SignActions.changeId(e.target.value);
            break;
        case "password":
            SignActions.changePassword(e.target.value);
            break;
        case "check":
            SignActions.changeCheck(e.target.value);
            break;
        case "email":
            SignActions.changeEmail(e.target.value);
            break;
        }
    }
    /* 로그인 입력시 상태 업데이트 onChange 함수 */
    handleSignInChange = (e) => {
        const {SignActions} = this.props;
        switch(e.target.name){
        case "id":
            SignActions.changeLoginId(e.target.value);
            break;
        case "password":
            SignActions.changeLoginPassword(e.target.value);
            break;
        }
    }
    /* 모달 open 상태에서 회원가입 onClick 함수 */
    handleSignUpToggle = () => {
        const {SignActions} = this.props;
        SignActions.isSignUp();
    }
    /* 모달 open 상태에서 로그인 onClick 함수 */
    handleSignInToggle = () => {
        const {SignActions} = this.props;
        SignActions.isSignIn();
    }
    handleCloseError = () => {
        const {SignActions} = this.props;
        SignActions.closeMessage();
    }
    /* 컴포넌트 로드가 끝난 후 실행되는 API */
    componentDidMount(){
        this.initialize();
    }
    /* 상태 변화가 일어나면 업데이트 여부 결정하는 API */
    /*
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.modalIsOpen !== this.props.modalIsOpen || nextProps.toggle !== this.props.toggle)
            return true;
        if(nextProps.signUp.getIn([3,"value"]) !== this.props.signUp.getIn([3,"value"]))
            return true;
        if(nextProps.signUp.getIn([2,"value"]) !== this.props.signUp.getIn([2,"value"]))
            return true;
        if(nextProps.signUp.getIn([1,"value"]) !== this.props.signUp.getIn([1,"value"]))
            return true;
        if(nextProps.signUp.getIn([0,"value"]) !== this.props.signUp.getIn([0,"value"]))
            return true;
        if(nextProps.signIn.getIn([0,"value"]) !== this.props.signIn.getIn([0,"value"]))
            return true;
        if(nextProps.signIn.getIn([1,"value"]) !== this.props.signIn.getIn([1,"value"]))
            return true;
        return false;
    }
    */
    /* 상태 업데이트가 일어난 후 실행되는 API */
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.logged !== this.props.logged && this.props.logged) {
            // logged가 true가 되면 localStorage에 값을 저장합니다. 
            localStorage.setItem(
                "userInfo",
                JSON.stringify({
                    id: this.props.loginId,
                    token: this.props.token
                })
            );
            if(document.documentElement.scrollTop >= 100){
                document.getElementById("uid").style.color = "white";
                return;
            }
        }
        if (prevProps.logged !== this.props.logged && !this.props.logged && document.documentElement.scrollTop >= 100)
            document.getElementById("usign").style.color = "white";
    }
    /* 실제 화면에 렌더링 해주는 함수 */
    render(){
        const {signUp, signIn, modalIsOpen, toggle, logged, loginId, signInLoading, signUpLoading, message, title, content} = this.props;
        const {
            handleSignUpToggle,
            handleSignInToggle,
            closeModal,
            signUpOpenModal,
            signInOpenModal,
            afterOpenModal,
            handleSignIn,
            handleSignUpInput,
            handleSignUpChange,
            handleSignInChange,
            handleLogout,
            handleCloseError,
            handleSignUp
        } = this;
	    return (
            <React.Fragment>
                {logged?
                    <React.Fragment>
                        <li>
                            <Link to="/info" id="uid">{loginId} 님</Link>
                        </li>
                        <li>
                            <a onClick={handleLogout}>로그아웃</a>
                        </li>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <li>
                            <a onClick={signUpOpenModal} id="usign">회원가입</a>
                        
                            <Modal
                                isOpen={modalIsOpen}
                                onAfterOpen={afterOpenModal}
                                onRequestClose={closeModal}
                                style={toggle ? signupStyles : signinStyles }
                                contentLabel="modal"
                                closeTimeoutMS={400}
                            >   <div className={styles.toggle}>
                                    <button className={toggle?styles.test:""} onClick={handleSignUpToggle} >회원가입</button>
                                    <p>|</p>
                                    <button className={toggle?"":styles.test} onClick={handleSignInToggle}>로그인</button>
                                    
                                </div>
                                {toggle ? 
                                    <div className={styles.signup}>
                                        <SignUpList
                                            onClick={handleSignUp}
                                            signUp={signUp}
                                            onChange={handleSignUpInput}
                                            onKeyUp={handleSignUpChange}

                                        /> 
                                    </div>
                                    : 
                                    <div className={styles.signup}>
                                        <SignInList
                                            signIn={signIn}
                                            onClick={handleSignIn}
                                            onChange={handleSignInChange}
                                        />
                                    </div>
                                }
                    
                            </Modal>
                            <Modal 
                                isOpen={message}
                                style={messageStyles}
                                onRequestClose={handleCloseError}
                                contentLabel="modal"
                                closeTimeoutMS={400}
                            >
                                <div className={messageModal.message}>
                                    <div className={messageModal.message_header}>
                                        <h3>{title}</h3>
                                        
                                    </div>
                                    <div className={messageModal.message_content}>
                                        <h4>{content}</h4>
                                    </div>
                                </div>
                                <div className={messageModal.option}>
                                    <button onClick={handleCloseError}>확인</button>
                                </div>
                            </Modal>
                            {(signInLoading||signUpLoading)?
                                <Loading/>
                                :
                                ""
                            }
                        </li>
                        <li>
                            <a onClick={signInOpenModal}>로그인</a>
                        </li>
                    </React.Fragment>
                }
            </React.Fragment>
	    );
    }
}
/* 상태 관리 라이브러리 Redux와 연동하는 부분 */
export default connect(
    (state) => ({
        signInLoading: state.pender.pending["sign/SIGNIN"],
        signUpLoading: state.pender.pending["sign/SIGNUP"],
        signUp: state.sign.get("signUp"),
        signIn: state.sign.get("signIn"),
        toggle: state.sign.get("toggle"),
        token: state.sign.get("token"),
        modalIsOpen: state.sign.get("modalIsOpen"),
        signInError: state.sign.get("signInError"),
        signUpError: state.sign.get("signUpError"),
        logged: state.sign.get("logged"),
        registered: state.sign.get("registered"),
        loginId: state.sign.get("loginId"),
        message: state.sign.getIn(["message","modal"]),
        title: state.sign.getIn(["message","title"]),
        content: state.sign.getIn(["message","content"]),
    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        SignActions: bindActionCreators(signActions, dispatch)
    })  
)(SignUpListContainer);