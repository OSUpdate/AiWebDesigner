import { handleActions, createAction } from "redux-actions";
import { List, Map, fromJS } from "immutable";
import axios from "axios";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";
import ErrorInput from "../components/ErrorInput";

// 회원가입 요청
const SIGNUP = "sign/SIGNUP";

// 로그인 요청
const SIGNIN = "sign/SIGNIN";

// 로그인 여부 확인 요청
const CHECK_LOGIN = "sign/CHECK_LOGIN";

// 임시 로그인
const TEMP_LOGIN = "sign/TEMP_LOGIN";

// 로그아웃 요청
const LOGOUT = "sign/LOGOUT";

// 로그인 input onChange 이벤트
const CHANGE_LOGIN_ID = "sign/LOGIN_ID";
const CHANGE_LOGIN_PASSWORD = "sign/LOGIN_PASSWORD";

// 회원가입 input onChange 이벤트
const INPUT_ID = "sign/INPUT_ID";
const INPUT_PASSWORD = "sign/INPUT_PASSWORD";
const INPUT_CHECK = "sign/INPUT_CHECK";
const INPUT_EMAIL = "sign/INPUT_EMAIL";

// 회원가입 input onKeyUp 이벤트
const CHANGE_ID= "sign/CHANGE_ID";
const CHANGE_PASSWORD = "sign/CHANGE_PASSWORD";
const CHANGE_CHECK = "sign/CHANGE_CHECK";
const CHANGE_EMAIL = "sign/CHANGE_EMAIL";

// 회원가입, 로그인 모달 open
const OPEN_MODAL = "sign/OPENMODAL";

// 회원가입, 로그인 모달 close
const CLOSE_MODAL = "sign/CLOSEMODAL";

// 회원가입, 로그인 모달에서 로그인인지 회원가입인지 구분
const ISSIGNUP = "sign/ISSIGNUP";
const ISSIGNIN = "sign/ISSIGNIN";

// 메시지 모달 close
const CLOSE_MESSAGE = "sign/CLOSE_MESSAGE";

// 에러 메시지 모달 open
const ERROR = "sign/ERROR";

// input 클리어
const CLEAR = "sign/CLEAR";

// 회원가입 요청
export const signUp = createAction(SIGNUP, api.signUp);

// 로그인 요청
export const signIn = createAction(SIGNIN, api.signIn);

// 로그인 여부 확인 요청
export const checkLogin = createAction(CHECK_LOGIN, api.checkLogin);

// 임시로그인 함수
export const tempLogin = createAction(TEMP_LOGIN);

// 로그아웃 요청
export const logout = createAction(LOGOUT, api.logout);

// 로그인 input onChange 이벤트 함수
export const changeLoginId = createAction(CHANGE_LOGIN_ID);
export const changeLoginPassword = createAction(CHANGE_LOGIN_PASSWORD);

// 회원가입 input onChange 이벤트 함수
export const inputId = createAction(INPUT_ID);
export const inputPassword = createAction(INPUT_PASSWORD);
export const inputCheck = createAction(INPUT_CHECK);
export const inputEmail = createAction(INPUT_EMAIL);

// 회원가입 Input onKeyUp 이벤트 함수
export const changeId = createAction(CHANGE_ID);
export const changePassword = createAction(CHANGE_PASSWORD);
export const changeCheck = createAction(CHANGE_CHECK);
export const changeEmail = createAction(CHANGE_EMAIL);

// 로그인, 회원가입 모달 open 함수
export const openModal = createAction(OPEN_MODAL);

// 로그인, 회원가입 모달 close 함수
export const closeModal = createAction(CLOSE_MODAL);

// 로그인, 회원가입 모달 회원가입 활성화 함수
export const isSignUp = createAction(ISSIGNUP);

// 로그인, 회원가입 모달 로그인 활성화 함수
export const isSignIn = createAction(ISSIGNIN);

// 메시지 모달 close 함수
export const closeMessage = createAction(CLOSE_MESSAGE);

// 에러 메시지 모달 open 함수
export const error = createAction(ERROR);

// input 데이터 초기화 함수
export const clear = createAction(CLEAR);

// 함수들 구현
const initialState = Map({
    // 회원가입 데이터
    signUp:List([
        Map({
            id:"id",
            type: "text",
            title:"아이디",
            value:"",
            error:"",
            check:false
        }),
        Map({
            id:"password",
            type: "password",
            title:"비밀번호",
            value:"",
            error:"",
            check:false
        }),
        Map({
            id:"check",
            type: "password",
            title:"비밀번호 확인",
            value:"",
            error:"",
            check:false
        }),
        Map({
            id:"email",
            type: "email",
            title:"이메일",
            value:"",
            error:"",
            check:false
        })
    ]),
    // 로그인 데이터
    signIn:List([
        Map({
            id:"id",
            type: "text",
            title:"아이디",
            value:"",
        }),
        Map({
            id:"password",
            type: "password",
            title:"비밀번호",
            value:"",
        })
    ]),
    // 메시지 모달 데이터
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    // 로그인, 회원가입 모달 데이터
    toggle:false,
    // 로그인, 회원가입 모달 open 여부
    modalIsOpen:false,
    // 로그인 여부
    logged: false,
    // 로그인 아이디
    loginId:"",
    // 로그인 토큰
    token:""
});
// 0번이 아이디 
// 1번이 패스워드
// 2번이 패스워드 체크
// 3번이 이메일 

// 함수들 구현
const reducer = handleActions({
    // input 초기화 함수
    [CLEAR]: (state, action) => {
        const { payload: value } = action;
        // input 데이터 초기화
        return state.setIn(["signUp",0,"checked"], false)
            .setIn(["signUp",1,"checked"], false)
            .setIn(["signUp",2,"checked"], false)
            .setIn(["signUp",3,"checked"], false)
            .setIn(["signUp",0,"error"], "")
            .setIn(["signUp",1,"error"], "")
            .setIn(["signUp",2,"error"], "")
            .setIn(["signUp",3,"error"], "")
            .setIn(["signUp",0,"value"], "")
            .setIn(["signUp",1,"value"], "")
            .setIn(["signUp",2,"value"], "")
            .setIn(["signUp",3,"value"], "");
    },
    // 에러 메시지 모달 open 함수
    [ERROR]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);
    },
    // 메시지 모달 close 함수
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    },
    // 로그인 아이디 onChange 이벤트 함수
    [CHANGE_LOGIN_ID]:(state,action) => {
        const { payload: value } = action;
        return state.setIn(["signIn", 0, "value"],value);
    },
    // 로그인 비밀번호 onChange 이벤트 함수
    [CHANGE_LOGIN_PASSWORD]:(state,action) => {
        const { payload: value } = action;
        return state.setIn(["signIn", 1, "value"],value);
    },
    // 회원가입 아이디 onChange 이벤트 함수
    [INPUT_ID]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 0, "value"],value);
    },
    // 회원가입 비밀번호 onChange 이벤트 함수
    [INPUT_PASSWORD]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 1, "value"],value);
    },
    // 회원가입 비밀번호 확인 onChange 이밴트 함수
    [INPUT_CHECK]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 2, "value"],value);
    },
    // 회원가입 이메일 onChange 이벤트 함수
    [INPUT_EMAIL]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 3, "value"],value);
    },
    // 회원가입 아이디 onKeyUp 이벤트 함수
    [CHANGE_ID]: (state, action) => {
        const { payload: value } = action;
        // 정규식으로 아이디 검증
        if(!(/^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/.test(value))){
            // 아이디가 비어있을 경우 에러 메시지 표시안함
            if(value === ""){
                return state.setIn(["signUp", 0, "error"],"")
                    .setIn(["signUp", 0,"checked"],false);
            }
            // 에러 메시지 표시
            const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
            return state.setIn(["signUp", 0, "error"],text)
                .setIn(["signUp", 0,"checked"],true);
        }
        return state.setIn(["signUp", 0,"error"], "")
            .setIn(["signUp", 0,"checked"],false);
    },
    // 회원가입 비밀번호 onKeyUp 이벤트 함수
    [CHANGE_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        // 비밀번호 확인에만 데이터가 있고 데이터가 동일한 경우 에러 메시지 표시 안함
        if( "" !== state.getIn(["signUp", 2, "value"]) && value === state.getIn(["signUp", 2, "value"])){
            return state.setIn(["signUp", 2,"error"], "")
                .setIn(["signUp", 2,"checked"],false);
        }
        // 비밀번호 확인에 데이터가 있고 비밀번호에 입력한 값이랑 다를 경우 메시지 표시
        else if("" !== state.getIn(["signUp", 2, "value"]) && value !== state.getIn(["signUp", 2, "value"])){
            const text = "비밀번호가 다릅니다";
            return state.setIn(["signUp", 2, "error"],text)
                .setIn(["signUp", 2,"checked"],true);
        }
        else{
            // 정규식으로 비밀번호 검증
            if(!(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(value))){
                // 비밀번호가 비어있을 경우 에러 메시지 표시 안함
                if(value === ""){
                    return state.setIn(["signUp", 1, "error"],"")
                        .setIn(["signUp", 1,"checked"],false);
                }
                // 에러 메시지 표시
                const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
                return state.setIn(["signUp", 1, "error"],text)
                    .setIn(["signUp", 1,"checked"],true);
            }
            // 정규식에 맞는 경우 에러 메시지 표시 안함
            return state.setIn(["signUp", 1,"error"], "")
                .setIn(["signUp", 1,"checked"],false);
        }
        
    },
    // 회원가입 비밀번호 확인 onKeyUp 이벤트 함수
    [CHANGE_CHECK]: (state, action) => {
        const { payload: value } = action;
        // 비밀번호와 값 비교
        if(value !== state.getIn(["signUp", 1, "value"])){
            if(value === ""){
                // 비어있을 경우 메시지 표시 안함
                return state.setIn(["signUp", 2, "error"],"")
                    .setIn(["signUp", 2,"checked"],false);
            }
            // 에러 메시지 표시
            const text = "비밀번호가 다릅니다";
            return state.setIn(["signUp", 2, "error"],text)
                .setIn(["signUp", 2,"checked"],true);
        }
        // 동일한 경우 에러 메시지 표시 안함
        return state.setIn(["signUp", 2,"error"], "")
            .setIn(["signUp", 2,"checked"],false);
    },
    // 회원가입 이메일 onKeyUp 이벤트 함수
    [CHANGE_EMAIL]: (state, action) => {
        const { payload: value } = action;
        // 정규식으로 이메일 검증
        if(!(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(value))){
            // 비어있을 경우 에러 메시지 표시 안함
            if(value === ""){
                return state.setIn(["signUp", 3, "error"],"")
                    .setIn(["signUp", 3,"checked"],false);
            }
            // 에러메시지 표시
            const text = "이메일 형식에 맞춰 입력해주세요";
            return state.setIn(["signUp", 3, "error"],text)
                .setIn(["signUp", 3,"checked"],true);
        }
        // 정규식에 맞는 경우 에러 메시지 표시 안함
        return state.setIn(["signUp", 3,"error"], "")
            .setIn(["signUp", 3,"checked"],false);
    },
    // 로그인, 회원가입 모달 로그인 onClick 이벤트 함수
    [ISSIGNIN]: (state, action) => {
        return state.set("toggle", false);
    },
    // 로그인, 회원가입 모달 회원가입 onClick 이벤트 함수
    [ISSIGNUP]: (state, action) => {
        return state.set("toggle", true);
    },
    // 로그인, 회원가입 모달 open 함수
    [OPEN_MODAL]: (state, action) => {
        return state.set("modalIsOpen",true);
    },
    // 로그인, 회원가입 모달 close 함수
    [CLOSE_MODAL]: (state, action) => {
        return state.set("modalIsOpen",false);
    },
    // 임시 로그인 함수
    [TEMP_LOGIN]: (state, action) => {
        const { payload: info} = action;
        // 로컬 데이터로 임시 로그인
        return state.set("logged", true)
            .set("loginId",info.id)
            .set("token",info.token);
    }
}, initialState);
// 비동기 통신 함수
export default applyPenders(reducer, [
    {
        // 로그인 요청
        type: SIGNIN,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const token = post.Response.token;
            const result = response.result;
            if(result){
                // 로그인 설정 및 입력 데이터 초기화
                return state.set("logged", true)
                    .set("loginId",response.id)
                    .set("modalIsOpen",false)
                    .set("token",token)
                    .setIn(["signIn",0,"value"], "")
                    .setIn(["signIn",1,"value"], "");
            }
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                // 에러 메시지 모달 open
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["signIn",0,"value"], "")
                    .setIn(["signIn",1,"value"], "");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open 및 데이터 초기화
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["signIn",0,"value"], "")
                    .setIn(["signIn",1,"value"], "");
            }
        }
    },
    {
        // 회원가입 요청
        type: SIGNUP,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const token = post.Response.token;
            const result = response.result;
            if(result){
                // 로그인 설정 및 입력 데이터 초기화
                return state.set("logged", true)
                    .set("loginId",response.id)
                    .set("modalIsOpen",false)
                    .set("token",token)
                    .setIn(["signUp",0,"checked"], false)
                    .setIn(["signUp",1,"checked"], false)
                    .setIn(["signUp",2,"checked"], false)
                    .setIn(["signUp",3,"checked"], false)
                    .setIn(["signUp",0,"error"], "")
                    .setIn(["signUp",1,"error"], "")
                    .setIn(["signUp",2,"error"], "")
                    .setIn(["signUp",3,"error"], "")
                    .setIn(["signUp",0,"value"], "")
                    .setIn(["signUp",1,"value"], "")
                    .setIn(["signUp",2,"value"], "")
                    .setIn(["signUp",3,"value"], "");
            }
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                // 에러 메시지 모달 open 및 입력 데이터 초기화
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["signUp",0,"checked"], false)
                    .setIn(["signUp",1,"checked"], false)
                    .setIn(["signUp",2,"checked"], false)
                    .setIn(["signUp",3,"checked"], false)
                    .setIn(["signUp",0,"error"], "")
                    .setIn(["signUp",1,"error"], "")
                    .setIn(["signUp",2,"error"], "")
                    .setIn(["signUp",3,"error"], "")
                    .setIn(["signUp",0,"value"], "")
                    .setIn(["signUp",1,"value"], "")
                    .setIn(["signUp",2,"value"], "")
                    .setIn(["signUp",3,"value"], "");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open 및 입력 데이터 초기화
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["signUp",0,"checked"], false)
                    .setIn(["signUp",1,"checked"], false)
                    .setIn(["signUp",2,"checked"], false)
                    .setIn(["signUp",3,"checked"], false)
                    .setIn(["signUp",0,"error"], "")
                    .setIn(["signUp",1,"error"], "")
                    .setIn(["signUp",2,"error"], "")
                    .setIn(["signUp",3,"error"], "")
                    .setIn(["signUp",0,"value"], "")
                    .setIn(["signUp",1,"value"], "")
                    .setIn(["signUp",2,"value"], "")
                    .setIn(["signUp",3,"value"], "");
            }

        }
    },
    {
        // 로그인 체크 요청
        type: CHECK_LOGIN,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result){
                // 로그인 설정
                return state.set("logged", true)
                    .set("loginId",response.id)
                    .set("token",response.token);
            }
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state,action) => {
            return state.set("logged", false)
                .set("loginId","")
                .set("token","");
        }
    },
    {
        // 로그아웃 요청
        type: LOGOUT,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result){
                // 로그인 해제 설정
                return state.set("logged", false)
                    .set("loginId","");
            }
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state,action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"로그아웃에 실패했습니다.");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }

        }
    }
]);