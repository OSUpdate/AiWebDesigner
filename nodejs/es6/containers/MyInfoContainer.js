import React, {Component} from "react";

import { connect } from "react-redux";
import {bindActionCreators} from "redux";
import {withRouter} from "react-router-dom";
import Modal from "react-modal";
import * as postActions from "../modules/post";
import * as signActions from "../modules/sign";
import * as changeActions from "../modules/change";

import Loading from "../components/Loading";
import MyInfoTemplate from "../components/MyInfoTemplate";
import styles from "../components/css/agency.css";
import cx from "classnames";
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
/* 회원정보 UI 컴포넌트*/
class MyInfoContainer extends Component {
    /* 초기 로그인 여부 체크 함수*/
    initialize = async () => {
        const {SignActions, ChangeActions, token} = this.props;
        if(localStorage.getItem("userInfo")){
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            SignActions.tempLogin(userInfo);
            try{
                await ChangeActions.getChart(userInfo.token);
            }
            catch(e){
                if(token === "")
                    localStorage.removeItem("userInfo");
                ChangeActions.error("서버와 연결에 문제가 발생했습니다.");
            }
            return;
        }
        try{
            await SignActions.checkLogin();
            if(token !== ""){
                await ChangeActions.getChart(token);
            }
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
            console.log(e);
        }
    }
    /* 비밀번호 변경 입력시 상태 업데이트 onChange 함수 */
    handlePwInput = (e) => {
        const {ChangeActions} = this.props;
        switch(e.target.name){
        case "current":
            ChangeActions.inputCurrent(e.target.value);
            break;
        case "password":
            ChangeActions.inputPassword(e.target.value);
            break;
        case "check":
            ChangeActions.inputCheck(e.target.value);
            break;
        }
    }
    /* 비밀번호 변경 onKeyUp 함수 */
    handlePwChange = (e) => {
        const {ChangeActions} = this.props;
        switch(e.target.name){
        case "password":
            ChangeActions.changePassword(e.target.value);
            break;
        case "check":
            ChangeActions.changeCheck(e.target.value);
            break;
        }
    }
    /* 비밀번호 변경 이벤트 핸들러 */
    handleChangePw = async () => {
        const {ChangeActions, change, token} = this.props;
        
        try{
            await ChangeActions.changeUser(
                change.getIn([1,"value"]), 
                change.getIn([2,"value"]),
                token,
                change.getIn([0,"value"])    
            );
        }
        catch(e){
            console.log(e);
        }
    }
    /* 비밀번호 변경 모달 open 함수 */
    handleOpenModal = () => {
        const {ChangeActions} = this.props;
        ChangeActions.openModal();
    }
    /* 비밀번호 변경 모달 close 함수 */
    handleCloseModal = () => {
        const {ChangeActions} = this.props;
        ChangeActions.closeModal();
    }
    /* 비밀번호 변경 처리 결과 모달 확인 버튼 onClick 함수 */
    handleCloseMessage = () => {
        const {ChangeActions} = this.props;
        ChangeActions.closeMessage();
    }
    /* 컴포넌트 로드 후 scroll 방지 css 추가*/
    componentDidMount(){
        const {ChangeActions} = this.props;

        this.initialize();
        let view = document.getElementById("view");
        view.className = "view-noOverflow";
    }
    /* 로그인되어 있지 않을 경우 메시지 모달 확인 버튼 onClick 함수 */
    handleCloseNotSignIn = () => {
        const {ChangeActions, history} = this.props;
        ChangeActions.closeMessage();
        history.push("/");
    }
    /* 로그인되어 있지 않을 경우 실행되는 함수 */
    handleNotSignIn = () => {
        const {ChangeActions} = this.props;
        ChangeActions.error("로그인이 필요한 서비스입니다.");
    }
    /* 컴포넌트 제거 될 때 scroll 방지 css 제거 */
    componentWillUnmount(){
        let view = document.getElementById("view");
        view.className = "";
    }
    /* 상태 업데이트가 일어난 후 실행되는 API */
    /*
    shouldComponentUpdate(nextProps, nextState) {
        
        if(nextProps.change.getIn([1,"value"]) !== this.props.change.getIn([1,"value"]))
            return true;
        if(nextProps.change.getIn([2,"value"]) !== this.props.change.getIn([2,"value"]))
            return true;
        if(nextProps.change.getIn([0,"value"]) !== this.props.change.getIn([0,"value"]))
            return true;
        if(nextProps.forgotToggle !== this.props.forgotToggle || 
            nextProps.modal !== this.props.modal || 
            nextProps.message !== this.props.message)
            return true;
        
        return false;
    }
    */
    /* 실제 화면에 렌더링 해주는 함수 */
    render(){
        const {post, error, loading, logged, loginId, change, modal, message, title, content, labels, data} = this.props; 
        const {
            handleLogout,
            handlePwChange,
            handlePwInput,
            handleOpenModal,
            handleCloseModal,
            handleChangePw,
            handleCloseMessage,
            handleCloseNotSignIn
        } = this;
        /*
        const data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };
        */

        const chart = data.toJS();
        return (
            <React.Fragment>
                {logged?
                    loading? 
                        <Loading/>
                        :
                        <React.Fragment>
                            <MyInfoTemplate
                                loginId={loginId}
                                logged={logged}
                                onLogout={handleLogout}
                                data={chart}
                                change={change}
                                onPwInput={handlePwInput}
                                onPwChange={handlePwChange}
                                openModal={handleOpenModal}
                                closeModal={handleCloseModal}
                                modalIsOpen={modal}
                                onChangeUser={handleChangePw}
                                
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
        post: state.post.get("data"),
        loading: state.pender.pending["change/GET_CHART"],
        error: state.pender.failure["change/GET_CHART"],
        change: state.change.get("change"),
        modal: state.change.get("modal"),
        message: state.change.getIn(["message","modal"]),
        title: state.change.getIn(["message","title"]),
        content: state.change.getIn(["message","content"]),
        loginId: state.sign.get("loginId"),
        logged: state.sign.get("logged"),
        token: state.sign.get("token"),
        data: state.change.get("data"),

    }),
    (dispatch) => ({
        PostActions: bindActionCreators(postActions, dispatch),
        ChangeActions: bindActionCreators(changeActions, dispatch),
        SignActions: bindActionCreators(signActions, dispatch)
    })  
)(withRouter(MyInfoContainer));