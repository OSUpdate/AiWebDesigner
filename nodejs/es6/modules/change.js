import { List, Map, fromJS } from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

const GET_CHART = "change/GET_CHART";

const OPEN_MODAL = "change/OPEN_MODAL";
const CLOSE_MODAL = "change/CLOSE_MODAL";
const CLOSE_MESSAGE = "change/CLOSE_MESSAGE";

const NOT_SIGNIN = "change/NOT_SIGNIN";

const INPUT_CURRENT = "change/INPUT_CURRENT";
const INPUT_PASSWORD = "change/INPUT_PASSWORD";
const INPUT_CHECK = "change/INPUT_CHECK";

const CHANGE_PASSWORD = "change/CHANGE_PASSWORD";
const CHANGE_CHECK = "change/CHANGE_CHECK";

const CHANGE_USER = "change/CHANGE_USER";

const ERROR = "change/ERROR";

export const getChart = createAction(GET_CHART, api.getChart);

export const openModal = createAction(OPEN_MODAL);
export const closeModal = createAction(CLOSE_MODAL);
export const closeMessage = createAction(CLOSE_MESSAGE);

export const inputCurrent = createAction(INPUT_CURRENT);
export const inputPassword = createAction(INPUT_PASSWORD);
export const inputCheck = createAction(INPUT_CHECK);

export const changePassword = createAction(CHANGE_PASSWORD);
export const changeCheck = createAction(CHANGE_CHECK);

export const changeUser = createAction(CHANGE_USER, api.change);

export const notSignIn = createAction(NOT_SIGNIN);

export const error = createAction(ERROR);
const initialState = Map({
    change:List([
        Map({
            id:"current",
            type: "password",
            title:"현재 비밀번호",
            value:""
        }),
        Map({
            id:"password",
            type: "password",
            title:"새로운 비밀번호",
            value:"",
            error:"",
            check:false
        }),
        Map({
            id:"check",
            type: "password",
            title:"새로운 비밀번호 확인",
            value:"",
            error:"",
            check:false
        })
    ]),
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    data:Map(),
    modal:false
});
const reducer = handleActions({
    
    [OPEN_MODAL]: (state, action) => {
        return state.set("modal", true);

    },
    [CLOSE_MODAL]: (state, action) => {
        return state.set("modal", false);
    },
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message","modal"], false);
    },
    [INPUT_CURRENT]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 0, "value"],value);
    },
    [INPUT_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 1, "value"],value);
    },
    [INPUT_CHECK]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 2, "value"],value);
    },
    [CHANGE_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        if(!(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(value))){
            if(value === ""){
                return state.setIn(["change", 1, "error"],"")
                    .setIn(["change", 1,"checked"],false);
            }
            const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
            return state.setIn(["change", 1, "error"],text)
                .setIn(["change", 1,"checked"],true);
        }
        return state.setIn(["change", 1,"error"], "")
            .setIn(["change", 1,"checked"],false);
    },
    [CHANGE_CHECK]: (state, action) => {
        const { payload: value } = action;
        if(value !== state.getIn(["change", 1, "value"])){
            if(value === ""){
                return state.setIn(["change", 2, "error"],"")
                    .setIn(["change", 2,"checked"],false);
            }
            const text = "비밀번호가 다릅니다";
            return state.setIn(["change", 2, "error"],text)
                .setIn(["change", 2,"checked"],true);
        }
        return state.setIn(["change", 2,"error"], "")
            .setIn(["change", 2,"checked"],false);
    },
    [ERROR]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);
    },
}, initialState);

export default applyPenders(reducer, [
    {
        type: CHANGE_USER,
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result){
                return state.set("modal", false)
                    .setIn(["message","modal"],true)
                    .setIn(["message","title"],"비밀번호 변경")
                    .setIn(["message","content"],"비밀번호 변경에 성공했습니다.")
                    .setIn(["change",0,"value"],"")
                    .setIn(["change",1,"value"],"")
                    .setIn(["change",2,"value"],"")
                    .setIn(["change",1,"error"],"")
                    .setIn(["change",2,"error"],"");
            }
        },
        onError: (state,action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.set("modal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["change",0,"value"],"")
                    .setIn(["change",1,"value"],"")
                    .setIn(["change",2,"value"],"")
                    .setIn(["change",1,"error"],"")
                    .setIn(["change",2,"error"],"");
            }
            else{
                return state.set("modal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["change",0,"value"],"")
                    .setIn(["change",1,"value"],"")
                    .setIn(["change",2,"value"],"")
                    .setIn(["change",1,"error"],"")
                    .setIn(["change",2,"error"],"");
            }
        }
    },
    {
        type: GET_CHART,
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            console.log(result);
            if(result){
                const charts = fromJS(response.charts);

                console.log(charts.toJS());
                return state.set("data", charts);
            }
        },
        onError: (state,action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.set("modal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"로그인이 필요한 서비스입니다.");
            }
            else{
                return state.set("modal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    }
]);