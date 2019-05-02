import { List, Map, fromJS} from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

// 초기화
const INIT = "view/INIT";

// 로딩 설정
const LOADING = "view/LOADING";

// 모든 템플릿 toggle
const TOGGLE = "view/TOGGLE";

// 추천 템플릿 toggle
const RECOMMEND_TOGGLE = "view/RECOMMEND_TOGGLE";

// 최근 작업 템플릿 toggle 
const USER_TOGGLE = "view/USER_TOGGLE";

// 메시지 모달 close
const CLOSE_MESSAGE = "view/CLOSE_MESSAGE";

// 체크 해제
const CANCEL_CHECKED = "view/CANCEL_CHECKED";

// 사용자 선택을 기반으로 템플릿을 받아옴
const SET_TEMPLATE = "view/SET_TEMPLATE";
// 최종적으로 1개의 템플릿 선택
const SUBMIT = "view/SUBMIT";

// 컴포넌트 제거시 초기화
const UNMOUNT = "view/UNMOUNT";

// 에러 메시지 모달 open
const ERROR = "view/ERROR";

// 페이징 처리위한 설정
const UPDATE = "view/UPDATE";

// 페이지에 맞는 템플릿을 받아옴
const UPDATE_TEMPLATE = "view/UPDATE_TEMPLATE";

// 저장되어 있는 템플릿 삭제 요청
const DELETE_HTML = "view/DELETE_HTML";

// 초기화 함수
export const init = createAction(INIT, api.getView);

// 로딩 설정 
export const loading = createAction(LOADING);

// 모든 템플릿 toggle 함수
export const toggle = createAction(TOGGLE, id => id);

// 최근 작업한 템플릿 toggle 함수
export const userToggle = createAction(USER_TOGGLE, id => id);

// 추천 템플릿 toggle 함수
export const recommendToggle = createAction(RECOMMEND_TOGGLE, id => id);

// 메시지 모달 close 함수
export const closeMessage = createAction(CLOSE_MESSAGE);

// 페이징 설정 함수
export const update = createAction(UPDATE);

// 페이지 템플릿 데이터 요청 함수
export const updateTemplate = createAction(UPDATE_TEMPLATE,api.update);

// 선택한 템플릿 전송 함수
export const setTemplates = createAction(SET_TEMPLATE, api.setTemplate);

// 서버에서 추천 템플릿을 받아오는 함수
export const submit = createAction(SUBMIT, api.setHTML);

// 체크된 요소 전부 체크해제 함수
export const cancelChecked = createAction(CANCEL_CHECKED);

// 컴포넌트 제거시 초기화 함수
export const unmount = createAction(UNMOUNT);

// 에러 메시지 모달 open 함수
export const error = createAction(ERROR);

// 이전에 작업한 내역 삭제 함수
export const deleteHtml = createAction(DELETE_HTML, api.deleteHtml);

// 상태 관리에 필요한 변수들 선언
const initialState = Map({
    // 최근 작업한 템플릿 데이터
    user:List(),
    // 모든 템플릿 데이터
    view:List(),
    // 추천 템플릿 데이터
    recommend: List(),
    // 메시지 모달 데이터
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    // 이전에 작업한 내역이 있을 경우
    continue:Map({
        title: "",
        content: "",
        modal: false
    }),
    // 페이지 번호
    page:0,
    // 한번 선택했는지 여부
    template: false,
    // 페이징 처리 여부
    update:false,
    // 현재 페이지가 마지막인지 체크
    end:false,
    // 페이지 로딩중인지 체크
    loading: true,
    // 차트 데이터 
    chart: List()
});
// 함수들 구현
const reducer = handleActions({
    // 페이징 처리 설정 함수
    [UPDATE]: (state, payload) => {
        return state.set("update",true);
    },
    [LOADING]: (state,payload) => {
        return state.set("loading",true);
    },
    // 체크 해제 함수
    [CANCEL_CHECKED]: (state, action) => {
        const { payload: value } = action;
        // 모든 템플릿 중 체크된 요소 체크 해제
        const index = state.get("view").map((item,index)=>{
            if(item.get("checked") === true)
                return item.set("checked", false);
            return item;
        });
        // 추천 템플릿 중 체크된 요소 체크 해제
        const recommendIndex = state.get("recommend").map((item,index)=>{
            if(item.get("checked") === true)
                return item.set("checked", false);
            return item;
        });
        // 최근 작업한 템플릿 중 체크된 요소 체크 해제
        const userIndex = state.get("user").map((item,index)=>{
            if(item.get("checked") === true)
                return item.set("checked", false);
            return item;
        });
        // 결과 반영
        return state.set("view",index)
            .set("recommend", recommendIndex)
            .set("user", userIndex);
        
    },
    // 에러 메시지 모달 open 함수
    [ERROR]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);
    },
    // 컴포넌트 제거시 초기화 함수
    [UNMOUNT]: (state, action) => {
        return state.set("template",false);
    },
    // 모든 템플릿 클릭시 toggle 함수
    [TOGGLE]: (state, {payload: id}) => {
        const index = state.get("view").findIndex(item => item.get("id") === id);
        return state.updateIn(["view",index,"checked"], check => !check);
    },
    // 추천 템플릿 클릭시 toggle 함수
    [RECOMMEND_TOGGLE]: (state, {payload: id}) => {
        const index = state.get("recommend").findIndex(item => item.get("id") === id);
        return state.updateIn(["recommend",index,"checked"], check => !check);
    },
    // 최근 작업한 템플릿 클릭시 toggle 함수
    [USER_TOGGLE]: (state, {payload: id}) => {
        const index = state.get("user").findIndex(item => item.get("id") === id);
        return state.updateIn(["user",index,"checked"], check => !check);
    },
    // 메시지 모달 close 함수
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    }
}, initialState);
// 비동기 통신 함수
export default applyPenders(reducer,[
    {
        // 서버에 초기화 요청
        type: INIT,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const over = response.continue;
            const source = response.src;
            const templates = fromJS(response.templates);
            const recommend = response.recommend;
            const numb = response.numb;
            const filename = response.name;
            const result = response.result;
            const user = response.user;
            // 이전에 작업한 내역이 있을 경우
            if(over){
                return state.setIn(["continue", "modal"], true)
                    .setIn(["continue", "title"],"Continue")
                    .setIn(["continue", "content"],"이전에 중단된 작업을 계속 하시겠습니까?");
            }
            // 모든 템플릿 데이터 리스트 생성
            const test = templates.map((item, index) => {
                return Map({
                    id: index,
                    checked: false,
                    name:filename[index],
                    body: item,
                    src:source[index]
                });
            });
            // 추천 템플릿 데이터 리스트 생성
            const recommendTemplate = recommend.map((item) => {
                return Map(item);
            });
            // 최근 작업한 템플릿 데이터 리스트 생성
            const userTemplate = user.map((item)=>{
                return Map(item);
            });
            // 데이터 할당
            if(result){
                return state.set("view",test)
                    .set("recommend", recommendTemplate)
                    .set("user",userTemplate)
                    .set("loading",false)
                    .set("chart", fromJS(numb));
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
        // 선택한 템플릿을 가지고 ai 추천 템플릿을 요청
        type: SET_TEMPLATE,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const source = response.src;
            const filename = response.name;
            const templates = fromJS(response.templates);
            const result = response.result;
            // ai 서버에서 받아온 추천 템플릿 데이터 리스트 생성
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
                return state.set("recommend", test)
                    .set("loading", false)
                    .set("chart", fromJS(response.numb))
                    .set("template", true);
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
        // 이전에 작업한 내역이 있을 경우 요청
        type: DELETE_HTML,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            // 메시지 모달 open
            if(result){
                return state.setIn(["continue", "modal"], false)
                    .setIn(["continue", "title"],"")
                    .setIn(["continue", "content"],"");
            }
        },
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
        // 하나의 템플릿을 선택한 경우 서버에 요청
        type: SUBMIT,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result && state.get("template")){
                return state.set("template",false);
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
        // 페이지에 맞는 템플릿 데이터 요청
        type: UPDATE_TEMPLATE,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const source = response.src;
            const templates = fromJS(response.templates);
            const lastIndex = state.get("view").size;
            const filename = response.name;
            const page = response.page;
            const result = response.result;
            // 페이지에 맞는 템플릿 데이터 리스트 생성
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
                // 기존 리스트에 추가로 넣어줌
                let preList = state.get("view");
                const newList = preList.concat(test);
                return state.set("view",newList)
                    .set("page",page)
                    .set("update", false);
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
                    .setIn(["message", "content"],"로그인이 필요한 서비스입니다.");
            }
            // 더이상 페이지가 없는 경우
            else if(status === 401 && post.Response.response.result){
                // 페이지 업데이트 이벤트 방지
                return state.set("update",false)
                    .set("end",true);
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
