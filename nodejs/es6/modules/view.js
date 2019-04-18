import { List, Map, fromJS} from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

const INIT = "view/INIT";

const TOGGLE = "view/TOGGLE";
const INSERT = "view/INSERT";
const CLOSE_MESSAGE = "view/CLOSE_MESSAGE";
const CANCEL_CHECKED = "view/CANCEL_CHECKED";

const SET_TEMPLATE = "view/SET_TEMPLATE";
const SUBMIT = "view/SUBMIT";

const UNMOUNT = "view/UNMOUNT";
const ERROR = "view/ERROR";

const UPDATE = "view/UPDATE";
const UPDATE_TEMPLATE = "view/UPDATE_TEMPLATE";

const DELETE_HTML = "view/DELETE_HTML";

export const init = createAction(INIT, api.getView);

export const toggle = createAction(TOGGLE, id => id);
export const insert = createAction(INSERT, src => src);
export const closeMessage = createAction(CLOSE_MESSAGE);

export const update = createAction(UPDATE);
export const updateTemplate = createAction(UPDATE_TEMPLATE,api.update);

export const setTemplates = createAction(SET_TEMPLATE, api.setTemplate);
export const submit = createAction(SUBMIT, api.setHTML);
export const cancelChecked = createAction(CANCEL_CHECKED);

export const unmount = createAction(UNMOUNT);
export const error = createAction(ERROR);

export const deleteHtml = createAction(DELETE_HTML, api.deleteHtml);

const initialState = Map({
    user:List(),
    view:List(),
    recommend: List(),
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    continue:Map({
        title: "",
        content: "",
        modal: false
    }),
    page:0,
    template: false,
    update:false,
    end:false
});
const reducer = handleActions({
    [UPDATE]: (state, payload) => {
        return state.set("update",true);
    },
    [CANCEL_CHECKED]: (state, action) => {
        const { payload: value } = action;
        const index = state.get("view").map((item,index)=>{
            if(item.get("checked") === true)
                return item.set("checked", false);
            return item;
        });
        return state.set("view",index);
        
    },
    [ERROR]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);
    },
    [UNMOUNT]: (state, action) => {
        return state.set("template",false);
    },
    [TOGGLE]: (state, {payload: id}) => {
        const index = state.get("view").findIndex(item => item.get("id") === id);
        return state.updateIn(["view",index,"checked"], check => !check);
    },
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    }
}, initialState);
export default applyPenders(reducer,[
    {
        type: INIT,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const over = response.continue;
            const source = response.src;
            const templates = fromJS(response.templates);
            const recommend = response.recommend;
            const filename = response.name;
            const result = response.result;
            const user = response.user;
            if(over){
                return state.setIn(["continue", "modal"], true)
                    .setIn(["continue", "title"],"Continue")
                    .setIn(["continue", "content"],"이전에 중단된 작업을 계속 하시겠습니까?");
            }
            const test = templates.map((item, index) => {
                return Map({
                    id: index,
                    checked: false,
                    name:filename[index],
                    body: item,
                    src:source[index]
                });
            });
            const recommendTemplate = recommend.map((item) => {
                return Map(item);
            });
            const userTemplate = user.map((item)=>{
                return Map(item);
            });
            if(result){
                return state.set("view",test)
                    .set("recommend", recommendTemplate)
                    .set("user",userTemplate);
            }
            
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
        type: SET_TEMPLATE,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const source = response.src;
            const filename = response.name;
            const templates = fromJS(response.templates);
            const result = response.result;
            const test = templates.map((item, index) => {
                return Map({
                    id: index,
                    checked: false,
                    body: item,
                    name: filename[index],
                    src:source[index]
                });
            }
            );
            if(result){
                return state.set("view", test)
                    .set("template", true);
            }
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
        type: DELETE_HTML,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result){
                return state.setIn(["continue", "modal"], false)
                    .setIn(["continue", "title"],"")
                    .setIn(["continue", "content"],"");
            }
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
        type: SUBMIT,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result && state.get("template")){
                return state.set("template",false);
            }
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
        type: UPDATE_TEMPLATE,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const source = response.src;
            const templates = fromJS(response.templates);
            const lastIndex = state.get("view").size;
            const filename = response.name;
            const page = response.page;
            const result = response.result;
            
            if(result){
                const test = templates.map((item, index) => {
                    return Map({
                        id: lastIndex+index,
                        checked: false,
                        name:filename[index],
                        body: item,
                        src:source[index]
                    });
                });
                let preList = state.get("view");
                const newList = preList.concat(test);
                return state.set("view",newList)
                    .set("page",page)
                    .set("update", false);
            }
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"로그인이 필요한 서비스입니다.");
            }
            else if(status === 401 && post.Response.response.result){
                return state.set("update",false)
                    .set("end",true);
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    }
]);
