import { handleActions, createAction } from "redux-actions";
import { List, Map, fromJS } from "immutable";
import axios from "axios";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";
import ErrorInput from "../components/ErrorInput";

const SIGNUP = "sign/SIGNUP";
const SIGNIN = "sign/SIGNIN";

const CHECK_LOGIN = "sign/CHECK_LOGIN";
const TEMP_LOGIN = "sign/TEMP_LOGIN";

const LOGOUT = "sign/LOGOUT";

const CHANGE_LOGIN_ID = "sign/LOGIN_ID";
const CHANGE_LOGIN_PASSWORD = "sign/LOGIN_PASSWORD";

const INPUT_ID = "sign/INPUT_ID";
const INPUT_PASSWORD = "sign/INPUT_PASSWORD";
const INPUT_CHECK = "sign/INPUT_CHECK";
const INPUT_EMAIL = "sign/INPUT_EMAIL";

const CHANGE_ID= "sign/CHANGE_ID";
const CHANGE_PASSWORD = "sign/CHANGE_PASSWORD";
const CHANGE_CHECK = "sign/CHANGE_CHECK";
const CHANGE_EMAIL = "sign/CHANGE_EMAIL";

const OPEN_MODAL = "sign/OPENMODAL";
const CLOSE_MODAL = "sign/CLOSEMODAL";

const ISSIGNUP = "sign/ISSIGNUP";
const ISSIGNIN = "sign/ISSIGNIN";

const CLOSE_MESSAGE = "sign/CLOSE_MESSAGE";

const ERROR = "sign/ERROR";

const CLEAR = "sign/CLEAR";

export const signUp = createAction(SIGNUP, api.signUp);
export const signIn = createAction(SIGNIN, api.signIn);

export const checkLogin = createAction(CHECK_LOGIN, api.checkLogin);
export const tempLogin = createAction(TEMP_LOGIN);

export const logout = createAction(LOGOUT, api.logout);

export const changeLoginId = createAction(CHANGE_LOGIN_ID);
export const changeLoginPassword = createAction(CHANGE_LOGIN_PASSWORD);

export const inputId = createAction(INPUT_ID);
export const inputPassword = createAction(INPUT_PASSWORD);
export const inputCheck = createAction(INPUT_CHECK);
export const inputEmail = createAction(INPUT_EMAIL);

export const changeId = createAction(CHANGE_ID);
export const changePassword = createAction(CHANGE_PASSWORD);
export const changeCheck = createAction(CHANGE_CHECK);
export const changeEmail = createAction(CHANGE_EMAIL);

export const openModal = createAction(OPEN_MODAL);
export const closeModal = createAction(CLOSE_MODAL);

export const isSignUp = createAction(ISSIGNUP);
export const isSignIn = createAction(ISSIGNIN);

export const closeMessage = createAction(CLOSE_MESSAGE);

export const error = createAction(ERROR);

export const clear = createAction(CLEAR);
const initialState = Map({

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
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    toggle:false,
    modalIsOpen:false,
    logged: false,
    loginId:"",
    token:""
});
// 0번이 아이디 
// 1번이 패스워드
// 2번이 패스워드 체크
// 3번이 이메일 
const reducer = handleActions({
    [CLEAR]: (state, action) => {
        const { payload: value } = action;
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
    [ERROR]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);
    },
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    },
    [CHANGE_LOGIN_ID]:(state,action) => {
        const { payload: value } = action;
        return state.setIn(["signIn", 0, "value"],value);
    },
    [CHANGE_LOGIN_PASSWORD]:(state,action) => {
        const { payload: value } = action;
        return state.setIn(["signIn", 1, "value"],value);
    },
    [INPUT_ID]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 0, "value"],value);
    },
    [INPUT_PASSWORD]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 1, "value"],value);
    },
    [INPUT_CHECK]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 2, "value"],value);
    },
    [INPUT_EMAIL]: (state, action ) =>{
        const { payload: value } = action;
        return state.setIn(["signUp", 3, "value"],value);
    },
    [CHANGE_ID]: (state, action) => {
        const { payload: value } = action;
        if(!(/^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/.test(value))){
            if(value === ""){
                return state.setIn(["signUp", 0, "error"],"")
                    .setIn(["signUp", 0,"checked"],false);
            }
            const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
            return state.setIn(["signUp", 0, "error"],text)
                .setIn(["signUp", 0,"checked"],true);
        }
        return state.setIn(["signUp", 0,"error"], "")
            .setIn(["signUp", 0,"checked"],false);
    },
    [CHANGE_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        if( "" !== state.getIn(["signUp", 2, "value"]) && value === state.getIn(["signUp", 2, "value"])){
            return state.setIn(["signUp", 2,"error"], "")
                .setIn(["signUp", 2,"checked"],false);
        }
        else if("" !== state.getIn(["signUp", 2, "value"]) && value !== state.getIn(["signUp", 2, "value"])){
            const text = "비밀번호가 다릅니다";
            return state.setIn(["signUp", 2, "error"],text)
                .setIn(["signUp", 2,"checked"],true);
        }
        else{
            if(!(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(value))){
                if(value === ""){
                    return state.setIn(["signUp", 1, "error"],"")
                        .setIn(["signUp", 1,"checked"],false);
                }
                const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
                return state.setIn(["signUp", 1, "error"],text)
                    .setIn(["signUp", 1,"checked"],true);
            }
            return state.setIn(["signUp", 1,"error"], "")
                .setIn(["signUp", 1,"checked"],false);
        }
        
    },
    [CHANGE_CHECK]: (state, action) => {
        const { payload: value } = action;
        if(value !== state.getIn(["signUp", 1, "value"])){
            if(value === ""){
                return state.setIn(["signUp", 2, "error"],"")
                    .setIn(["signUp", 2,"checked"],false);
            }
            const text = "비밀번호가 다릅니다";
            return state.setIn(["signUp", 2, "error"],text)
                .setIn(["signUp", 2,"checked"],true);
        }
        return state.setIn(["signUp", 2,"error"], "")
            .setIn(["signUp", 2,"checked"],false);
    },
    [CHANGE_EMAIL]: (state, action) => {
        const { payload: value } = action;
        if(!(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(value))){
            if(value === ""){
                return state.setIn(["signUp", 3, "error"],"")
                    .setIn(["signUp", 3,"checked"],false);
            }
            const text = "이메일 형식에 맞춰 입력해주세요";
            return state.setIn(["signUp", 3, "error"],text)
                .setIn(["signUp", 3,"checked"],true);
        }
        return state.setIn(["signUp", 3,"error"], "")
            .setIn(["signUp", 3,"checked"],false);
    },
    [ISSIGNIN]: (state, action) => {
        return state.set("toggle", false);
    },
    [ISSIGNUP]: (state, action) => {
        return state.set("toggle", true);
    },
    [OPEN_MODAL]: (state, action) => {
        return state.set("modalIsOpen",true);
    },
    [CLOSE_MODAL]: (state, action) => {
        return state.set("modalIsOpen",false);
    },
    [TEMP_LOGIN]: (state, action) => {
        const { payload: info} = action;
        return state.set("logged", true)
            .set("loginId",info.id)
            .set("token",info.token);
    }
}, initialState);

export default applyPenders(reducer, [
    {
        type: SIGNIN,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const token = post.Response.token;
            const result = response.result;
            if(result){
                return state.set("logged", true)
                    .set("loginId",response.id)
                    .set("modalIsOpen",false)
                    .set("token",token)
                    .setIn(["signIn",0,"value"], "")
                    .setIn(["signIn",1,"value"], "");
            }
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["signIn",0,"value"], "")
                    .setIn(["signIn",1,"value"], "");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["signIn",0,"value"], "")
                    .setIn(["signIn",1,"value"], "");
            }
        }
    },
    {
        type: SIGNUP,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const token = post.Response.token;
            const result = response.result;
            if(result){
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
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
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
            else{
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
        type: CHECK_LOGIN,
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result){
                return state.set("logged", true)
                    .set("loginId",response.id)
                    .set("token",response.token);
            }
        },
        onError: (state,action) => {
            return state.set("logged", false)
                .set("loginId","")
                .set("token","");
        }
    },
    {
        type: LOGOUT,
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result){
                return state.set("logged", false)
                    .set("loginId","");
            }
        },
        onError: (state,action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"로그아웃에 실패했습니다.");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }

        }
    }
]);