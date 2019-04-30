import { List, Map, fromJS } from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

// 차트 데이터 요청
const GET_CHART = "change/GET_CHART";

// 모달 open
const OPEN_MODAL = "change/OPEN_MODAL";

// 모달 close 
const CLOSE_MODAL = "change/CLOSE_MODAL";

// 메시지 모달 close
const CLOSE_MESSAGE = "change/CLOSE_MESSAGE";

// 현재 비밀번호 input onChange 이벤트
const INPUT_CURRENT = "change/INPUT_CURRENT";

// 비밀번호 input onChange 이벤트
const INPUT_PASSWORD = "change/INPUT_PASSWORD";

// 비밀번호 확인 input onChange 이벤트
const INPUT_CHECK = "change/INPUT_CHECK";

// 변경할 비밀번호 input onKeyUp 이벤트
const CHANGE_PASSWORD = "change/CHANGE_PASSWORD";

// 변경할 비밀번호 확인 input onKeyUp 이벤트
const CHANGE_CHECK = "change/CHANGE_CHECK";

// 비밀번호 변경 요청
const CHANGE_USER = "change/CHANGE_USER";

// 에러 메시지 모달 open
const ERROR = "change/ERROR";

// 차트 데이터 요청 함수
export const getChart = createAction(GET_CHART, api.getChart);

// 모달 open 함수
export const openModal = createAction(OPEN_MODAL);

// 모달 close 함수
export const closeModal = createAction(CLOSE_MODAL);

// 메시지 모달 close 함수
export const closeMessage = createAction(CLOSE_MESSAGE);

// 현재 비밀번호 input onChange 이벤트 함수 
export const inputCurrent = createAction(INPUT_CURRENT);

// 변경할 비밀번호 input onChange 이벤트 함수
export const inputPassword = createAction(INPUT_PASSWORD);

// 변경할 비밀번호 확인 input onChange 이벤트 함수
export const inputCheck = createAction(INPUT_CHECK);

// 변경할 비밀번호 input onKeyUp 이벤트 함수
export const changePassword = createAction(CHANGE_PASSWORD);

// 변경할 비밀번호 확인 input onKeyUp 이벤트 함수
export const changeCheck = createAction(CHANGE_CHECK);

// 비밀번호 변경 요청 함수
export const changeUser = createAction(CHANGE_USER, api.change);

// 에러 메시지 모달 open
export const error = createAction(ERROR);

// 상태 관리에 필요한 변수들 선언
const initialState = Map({
    // 비밀번호 변경 데이터
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
    // 메시지 모달 데이터
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    // 차트 데이터
    data:Map(),
    // 모달 toggle
    modal:false
});
// 함수들 구현
const reducer = handleActions({
    // 모달 open 함수
    [OPEN_MODAL]: (state, action) => {
        return state.set("modal", true);

    },
    // 모달 close 함수
    [CLOSE_MODAL]: (state, action) => {
        return state.set("modal", false);
    },
    // 메시지 모달 close 함수
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message","modal"], false);
    },
    // 현재 비밀번호 input onChange 이벤트 함수
    [INPUT_CURRENT]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 0, "value"],value);
    },
    // 변경 비밀번호 input onChange 이벤트 함수
    [INPUT_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 1, "value"],value);
    },
    // 변경 비밀번호 확인 input onChange 이벤트 함수
    [INPUT_CHECK]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 2, "value"],value);
    },
    // 변경 비밀번호 onKeyUp 이벤트 함수
    [CHANGE_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        // 정규식으로 비밀번호 검증
        if(!(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(value))){
            // 비어있을 경우 에러 메시지 표시 안함
            if(value === ""){
                return state.setIn(["change", 1, "error"],"")
                    .setIn(["change", 1,"checked"],false);
            }
            // 에러 메시지 표시
            const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
            return state.setIn(["change", 1, "error"],text)
                .setIn(["change", 1,"checked"],true);
        }
        // 정규식에 걸리지 않는 경우 에러 메시지 표시 안함
        return state.setIn(["change", 1,"error"], "")
            .setIn(["change", 1,"checked"],false);
    },
    // 변경 비밀번호 확인 onKeyUp 함수
    [CHANGE_CHECK]: (state, action) => {
        const { payload: value } = action;
        // 변경 비밀번호와 값 비교
        if(value !== state.getIn(["change", 1, "value"])){
            // 비어있을 경우 에러 메시지 표시 안함
            if(value === ""){
                return state.setIn(["change", 2, "error"],"")
                    .setIn(["change", 2,"checked"],false);
            }
            // 에러 메시지 표시
            const text = "비밀번호가 다릅니다";
            return state.setIn(["change", 2, "error"],text)
                .setIn(["change", 2,"checked"],true);
        }
        // 정규식에 걸리지 않는 경우 에러 메시지 표시 안함
        return state.setIn(["change", 2,"error"], "")
            .setIn(["change", 2,"checked"],false);
    },
    // 에러 메시지 모달 open 함수
    [ERROR]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["message", "modal"], true)
            .setIn(["message", "title"],"Error")
            .setIn(["message", "content"],value);
    },
}, initialState);
// 비동기 통신 함수
export default applyPenders(reducer, [
    {
        // 비밀번호 변경 요청
        type: CHANGE_USER,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            // 비밀번호 변경에 성공할 경우 input 초기화
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
        // 에러가 발생한 경우 실행 함수
        onError: (state,action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                // 에러 메시지 모달 open 및 값 초기화
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
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open 및 값 초기화
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
        // 서버에 차트 데이터 요청
        type: GET_CHART,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) =>{
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            // 차트 데이터 설정
            if(result){
                const charts = fromJS(response.charts);
                return state.set("data", charts);
            }
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state,action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                // 에러 메시지 모달 open
                return state.set("modal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"로그인이 필요한 서비스입니다.");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 에러 메시지 모달 open
                return state.set("modal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.");
            }
        }
    }
]);