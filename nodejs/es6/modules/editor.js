import { List, Map, fromJS } from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

// html 편집기 onChange 이벤트
const CHANGE = "editor/CHANGE";

// 초기화
const INIT = "editor/INIT";

// 패널창 toggle 이벤트
const TOGGLE = "editor/TOGGLE";

// 저장버튼 onClick 이벤트
const SAVE = "editor/SAVE";

// 저장 성공, 실패 모달 close
const CLOSE_STATUS = "editor/CLOSE_STATUS";

// 메시지 모달 close
const CLOSE_MESSAGE = "editor/CLOSE_MESSAGE";

// 컴포넌트 제거시 데이터 초기화
const UNMOUNT = "editor/UNMOUNT";

// 에러 메시지 모달 open
const ERROR = "editor/ERROR";

// 편집기 완료 버튼 누를 경우 호출 액션
const SUBMIT = "editor/SUBMIT";

// 압축 파일 다운로드 수행
const DOWNLOAD = "editor/DOWNLOAD";

// css 패널 toggle 이벤트
const CSS_TOGGLE = "editor/CSS_TOGGLE";

// css 편집기 onChange 이벤트
const CSS_CHANGE = "editor/CSS_CHANGE";

// 패널창 toggle 함수
export const toggle = createAction(TOGGLE);

// 초기화 함수
export const init = createAction(INIT, api.getEditor);

// html 편집기 onChange 이벤트 함수
export const change = createAction(CHANGE, content => content);

// 저장 버튼 onClick 이벤트 함수
export const save = createAction(SAVE, api.save);

// css 편집이 onChange 이벤트 함수
export const cssChange = createAction(CSS_CHANGE, data => data);

// 저장 성공, 실패 모달 close 함수
export const closeStatus = createAction(CLOSE_STATUS);

// 메시지 모달 close 함수
export const closeMessage = createAction(CLOSE_MESSAGE);

// 컴포넌트 제거시 데이터 초기화 함수
export const unmount = createAction(UNMOUNT);

// 에러 메시지 모달 open 함수
export const error = createAction(ERROR);

// 완료 버튼 onClick 이벤트 함수
export const submit = createAction(SUBMIT, api.endEdit);

// 압축 파일 다운로드 요청 함수
export const download = createAction(DOWNLOAD, api.getZip);

// css 편집기 toggle 함수
export const cssToggle = createAction(CSS_TOGGLE, id => id);

// 상태 관리에 필요한 변수들 선언
const initialState = Map({
    // html 코드 데이터 
    editor:Map({
        content:"",
        name:""
    }),
    // 메시지 모달 데이터
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    // 저장 성공, 실패 모달 데이터
    status: Map({
        content: "",
        error: false
    }),
    // css 코드 데이터
    css:List(),
    // css 파일이름 데이터
    cssPanel:List(),
    // css 편집기 toggle
    cssToggle:false,
    // 저장 여부 모달 toggle
    statusToggle:false,
    // html 코드 편집기 toggle
    toggle:false
});
// 함수들 구현
const reducer = handleActions({
    // 에러 메시지 모달 open 함수
    [ERROR]: (state,action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);

    },
    // html 코드 편집기 toggle 함수
    [TOGGLE]: (state,action) => {
        return state.update("toggle", check => !check);

    },
    // 컴포넌트 제거시 초기화 함수
    [UNMOUNT]: (state,action) => {
        return state.setIn(["editor","content"], "")
            .set("toggle",false)
            .setIn(["message", "modal"], false)
            .setIn(["message", "title"],"")
            .setIn(["message", "content"],"");

    },
    // css 코드 편집기 toggle 함수
    [CSS_TOGGLE]:(state, {payload: id}) => {
        // 클릭이 일어난 css 편집기를 찾음
        const index = state.get("css").findIndex(item => item.get("id") === id);
        // 현재 열려있는 코드 편집기를 찾음
        const closeIndex = state.get("css").findIndex(item => item.get("toggle") === true);
        // 열려진 코드 편집기가 있을 경우
        if(closeIndex >= 0 && closeIndex !== index){
            // 열려진 코드 편집기를 닫고 호출이 일어난 편집기 open 
            return state.updateIn(["css",index,"toggle"], check => !check)
                .updateIn(["css",closeIndex,"toggle"], check => !check);
        }
        // 호출이 일어난 코드 편집기 open 혹은 close
        return state.updateIn(["css",index,"toggle"], check => !check)
            .update("cssToggle", check => !check);

    },
    // css 코드 편집기 onChange 함수
    [CSS_CHANGE]:(state, {payload: data}) => {
        // 코드 편집기 변경 데이터 반영
        if(typeof data[1] === "number"){
            return state.setIn(["css",data[1],"data"],data[0]);
        }
        return state;

    },
    // html 코드 편집기 onChange 함수
    [CHANGE]: (state, { payload: content }) => {
        // 코드 편집기 변경 데이터 반영
        return state.setIn(["editor","content"], content);
    },
    // 메시지 모달 close 함수
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    },
    // 저장 성공, 실패 모달 close 함수
    [CLOSE_STATUS]: (state, action) => {
        return state.set("statusToggle",false);
    }
}, initialState);
// 비동기 통신 함수
export default applyPenders(reducer, [
    {
        // 서버에 초기화 요청
        type: INIT,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            const template = response.template;
            const name = response.name;
            const data = response.css;
            // css 코드 데이터 리스트 생성
            const css = data.map((item, index) => {
                return Map({
                    id:index,
                    name:item.name,
                    data:item.data,
                    toggle:false
                });
            });
            // css 파일 이름 데이터 리스트 생성
            const cssPanel = data.map((item, index) => {
                return Map({
                    id:index,
                    name:item.name,
                });
            });
            // 상태 변수들 초기화
            if(result)
                return state.setIn(["editor","content"], template)
                    .setIn(["editor","name"], name)
                    .set("css",css)
                    .set("cssPanel", cssPanel);
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                // 에러 메시지 모달 open
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"로그인이 필요한 서비스입니다.");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    },
    {
        // 서버에 저장 요청
        type: SAVE,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            // 저장 성공, 실패 모달 open
            if(result)
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], false)
                    .setIn(["status", "content"],"저장에 성공했습니다.");
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], true)
                    .setIn(["status", "content"],"저장에 실패했습니다.");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    },
    {
        // 서버에 편집 완료 요청
        type: SUBMIT,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            // 저장 성공, 실패 모달 open
            if(result)
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], false)
                    .setIn(["status", "content"],"저장에 성공했습니다.");
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                // 저장 성공, 실패 모달 open
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], true)
                    .setIn(["status", "content"],"저장에 실패했습니다.");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    },
    {
        type: DOWNLOAD,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            return state.set("statusToggle",true)
                .setIn(["status", "error"], false)
                .setIn(["status", "content"],"다운로드 성공.");
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 ){
                // 저장 성공, 실패 모달 open
                return state.set("statusToggle",true)
                    .setIn(["status", "error"], true)
                    .setIn(["status", "content"],"다운로드 실패");
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