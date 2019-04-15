import { List, Map, fromJS } from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";


const CHANGE = "editor/CHANGE";
const INIT = "editor/INIT";
const TOGGLE = "editor/TOGGLE";
const SAVE = "editor/SAVE";

const CLOSE_STATUS = "editor/CLOSE_STATUS";
const CLOSE_MESSAGE = "editor/CLOSE_MESSAGE";

const UNMOUNT = "editor/UNMOUNT";
const ERROR = "editor/ERROR";

const SUBMIT = "editor/SUBMIT";

const DOWNLOAD = "editor/DOWNLOAD";
const CSS_TOGGLE = "editor/CSS_TOGGLE";
const CSS_CHANGE = "editor/CSS_CHANGE";
export const toggle = createAction(TOGGLE);
export const init = createAction(INIT, api.getEditor);
export const change = createAction(CHANGE, content => content);
export const save = createAction(SAVE, api.save);
export const cssChange = createAction(CSS_CHANGE, data => data);
export const closeStatus = createAction(CLOSE_STATUS);
export const closeMessage = createAction(CLOSE_MESSAGE);

export const unmount = createAction(UNMOUNT);
export const error = createAction(ERROR);

export const submit = createAction(SUBMIT, api.endEdit);

export const download = createAction(DOWNLOAD, api.getZip);
export const cssToggle = createAction(CSS_TOGGLE, id => id);
let id = 0;
const initialState = Map({
    editor:Map({
        content:"",
        name:""
    }),
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    status: Map({
        content: "",
        error: false
    }),
    css:List(),
    cssPanel:List(),
    cssToggle:false,
    statusToggle:false,
    toggle:false
});
const reducer = handleActions({
    [ERROR]: (state,action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);

    },
    [TOGGLE]: (state,action) => {
        return state.update("toggle", check => !check);

    },
    [UNMOUNT]: (state,action) => {
        return state.setIn(["editor","content"], "")
            .set("toggle",false)
            .setIn(["message", "modal"], false)
            .setIn(["message", "title"],"")
            .setIn(["message", "content"],"");

    },
    [CSS_TOGGLE]:(state, {payload: id}) => {
        const index = state.get("css").findIndex(item => item.get("id") === id);
        const closeIndex = state.get("css").findIndex(item => item.get("toggle") === true);
        if(closeIndex >= 0 && closeIndex !== index){
            return state.updateIn(["css",index,"toggle"], check => !check)
                .updateIn(["css",closeIndex,"toggle"], check => !check);
        }
        return state.updateIn(["css",index,"toggle"], check => !check)
            .update("cssToggle", check => !check);

    },
    [CSS_CHANGE]:(state, {payload: data}) => {
        
        if(typeof data[1] === "number"){
            return state.setIn(["css",data[1],"data"],data[0]);
        }
        return state;

    },
    [CHANGE]: (state, { payload: content }) => {
        return state.setIn(["editor","content"], content);
    },
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    },
    [CLOSE_STATUS]: (state, action) => {
        return state.set("statusToggle",false);
    }
}, initialState);

export default applyPenders(reducer, [
    {
        type: INIT,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            const template = response.template;
            const name = response.name;
            const data = response.css;
            const css = data.map((item, index) => {
                return Map({
                    id:index,
                    name:item.name,
                    data:item.data,
                    toggle:false
                });
            });
            const cssPanel = data.map((item, index) => {
                return Map({
                    id:index,
                    name:item.name,
                });
            });
            if(result)
                return state.setIn(["editor","content"], template)
                    .setIn(["editor","name"], name)
                    .set("css",css)
                    .set("cssPanel", cssPanel);
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"로그인이 필요한 서비스입니다.");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    },
    {
        type: SAVE,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;

            if(result)
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], false)
                    .setIn(["status", "content"],"저장에 성공했습니다.");
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], true)
                    .setIn(["status", "content"],"저장에 실패했습니다.");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    },
    {
        type: SUBMIT,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;

            if(result)
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], false)
                    .setIn(["status", "content"],"저장에 성공했습니다.");
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], true)
                    .setIn(["status", "content"],"저장에 실패했습니다.");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    },
    {
        type: DOWNLOAD,
        onSuccess: (state, action) => {
            return state.set("statusToggle",true)
                .setIn(["status", "error"], false)
                .setIn(["status", "content"],"다운로드 성공.");
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 ){
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], true)
                    .setIn(["status", "content"],"다운로드 실패");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    }
]);