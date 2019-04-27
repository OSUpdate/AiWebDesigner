import { List, Map } from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

// 아이디 찾기 화면 설정
const ISFINDID = "forgot/ISFINDID";
// 비밀번호 찾기 화면 설정
const ISFINDPW = "forgot/ISFINDPW";

// 비밀번호 변경 모달 open
const CHANGE_OPEN_MODAL = "forgot/CHANGE_OPEN_MODAL";

// 비밀번호 변경 모달 close
const CHANGE_CLOSE_MODAL = "forgot/CHANGE_CLOSE_MODAL";

// 메시지 모달 close
const CLOSE_MESSAGE = "forgot/CLOSE_MESSAGE";

// 이메일 인증 모달 open
const CERTIFIED_OPEN_MODAL = "forgot/CERTIFIED_OPEN_MODAL";

// 이메일 인증 모달 close
const CERTIFIED_CLOSE_MODAL = "forgot/CERTIFIED_CLOSE_MODAL";

// 아이디 찾기 요청
const FIND_ID = "forgot/FIND_ID";

// 비밀번호 찾기 요청
const FIND_PASSWORD = "forgot/FIND_PASSWORD";

// 비밀번호 변경 요청
const CHANGE_USER = "forgot/CHANGE_USER";

// 이메일 인증 요청
const CERTIFIED_USER = "forgot/CERTIFIED_USER";

// input 태그 onchange 이벤트  
const INPUT_ID_EMAIL = "forgot/INPUT_ID_EMAIL";
const INPUT_PW_EMAIL = "forgot/INPUT_PW_EMAIL";
const INPUT_PW_ID = "forgot/INPUT_PW_ID";

const INPUT_CERTIFIED = "forgot/INPUT_CERTIFIED";
const INPUT_PASSWORD = "forgot/INPUT_PASSWORD";
const INPUT_PASSWORD_CHECK = "forgot/INPUT_PASSWORD_CHECK";

// input 태그 onkeyup 이벤트
const CHANGE_PASSWORD = "forgot/CHANGE_PASSWORD";
const CHANGE_PASSWORD_CHECK = "forgot/CHANGE_PASSWORD_CHECK";

// 아이디 찾기 화면 설정 함수
export const isFindId = createAction(ISFINDID);

// 비밀번호 찾기 화면 설정 함수
export const isFindPw = createAction(ISFINDPW);

// 이메일 인증 모달 open 함수
export const certifiedOpenModal = createAction(CERTIFIED_OPEN_MODAL);

// 이메일 인증 모달 close 함수
export const certifiedCloseModal = createAction(CERTIFIED_CLOSE_MODAL);

// 비밀번호 변경 모달 close 함수
export const changeCloseModal = createAction(CHANGE_CLOSE_MODAL);

// 비밀번호 변경 모달 open 함수
export const changeOpenModal = createAction(CHANGE_OPEN_MODAL);

// 메시지 모달 close 함수
export const closeMessage = createAction(CLOSE_MESSAGE);

// 아이디 찾기 요청 함수
export const findId = createAction(FIND_ID, api.findId);

// 비밀번호 찾기 요청 함수
export const findPassword = createAction(FIND_PASSWORD, api.findPw);

// 비밀번호 변경 요청 함수
export const changeUser = createAction(CHANGE_USER, api.change);

// 이메일 인증 요청 함수
export const certifiedUser = createAction(CERTIFIED_USER, api.certified);

// input 태그 onchange 이벤트 함수
export const inputIdEmail = createAction(INPUT_ID_EMAIL);
export const inputPwEmail = createAction(INPUT_PW_EMAIL);
export const inputPwId = createAction(INPUT_PW_ID);

export const inputCertified = createAction(INPUT_CERTIFIED);
export const inputPassword = createAction(INPUT_PASSWORD);
export const inputPwCheck = createAction(INPUT_PASSWORD_CHECK);

// input 태그 onkeyup 이벤트 함수
export const changePassword= createAction(CHANGE_PASSWORD);
export const changePwCheck = createAction(CHANGE_PASSWORD_CHECK);

// 상태 관리에 필요한 변수들 정의
const initialState = Map({
    // 아이디 찾기 input 태그 데이터
    findId:Map({
        id:"email",
        type: "email",
        title:"이메일",
        value:""
    }),
    // 비밀번호 찾기 input 태그 데이터
    findPw:List([
        Map({
            id:"id",
            type: "text",
            title:"아이디",
            value:""
        }),
        Map({
            id:"email",
            type: "email",
            title:"이메일",
            value:""
        })
    ]),
    // 비밀번호 변경 input 태그 데이터
    change:List([
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
        })
    ]),
    // 성공, 에러 메시지 데이터
    message:Map({
        title: "",
        content: "",
        modal: false
    }),
    // 이메일 인증 input 태그 데이터
    certified:Map({
        value:"",
        text:""
    }),
    toggle:false,
    changeModal:false,
    certifiedModal:false,
    token:""
});
const reducer = handleActions({
    [CERTIFIED_OPEN_MODAL]: (state, action) => {
        return state.set("certifiedModal", true);
    },
    [CERTIFIED_CLOSE_MODAL]: (state, action) => {
        return state.set("certifiedModal", false);
    },
    [CHANGE_OPEN_MODAL]: (state, action) => {
        return state.set("changeModal", true);
    },
    [CHANGE_CLOSE_MODAL]: (state, action) => {
        return state.set("changeModal", false);
    },
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    },
    [ISFINDID]: (state, action) => {
        return state.set("toggle", true);
    },
    [ISFINDPW]: (state, action) => {
        return state.set("toggle", false);
    },
    [INPUT_ID_EMAIL]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["findId", "value"],value);
    },
    [INPUT_PW_EMAIL]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["findPw", 1, "value"],value);
    },
    [INPUT_PW_ID]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["findPw", 0, "value"],value);
    },
    [INPUT_CERTIFIED]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["certified","value"],value);
    },
    [INPUT_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 0, "value"],value);
    },
    [INPUT_PASSWORD_CHECK]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 1, "value"],value);
    },
    [CHANGE_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        if(!(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(value))){
            if(value === ""){
                return state.setIn(["change", 0, "error"],"")
                    .setIn(["change", 0,"checked"],false);
            }
            const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
            return state.setIn(["change", 0, "error"],text)
                .setIn(["change", 0,"checked"],true);
        }
        return state.setIn(["change", 0,"error"], "")
            .setIn(["change", 0,"checked"],false);
    },
    [CHANGE_PASSWORD_CHECK]: (state, action) => {
        const { payload: value } = action;
        if(value !== state.getIn(["change", 0, "value"])){
            if(value === ""){
                return state.setIn(["change", 1, "error"],"")
                    .setIn(["change", 1,"checked"],false);
            }
            const text = "비밀번호가 다릅니다";
            return state.setIn(["change", 1, "error"],text)
                .setIn(["change", 1,"checked"],true);
        }
        return state.setIn(["change", 1,"error"], "")
            .setIn(["change", 1,"checked"],false);
    },

}, initialState);

export default applyPenders(reducer, [
    {
        type: FIND_ID,
        onSuccess: (state, action) => {

            return state.setIn(["message","modal"],true)
                .setIn(["message","title"],"아이디 찾기")
                .setIn(["message","content"],"입력하신 이메일로 아이디를 전송했습니다")
                .setIn(["findId","value"], "");
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["findId","value"], "")
                    .setIn(["message","content"],"아이디 찾기에 실패했습니다.");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["findId","value"], "");
            }
        }
    },
    {
        type: FIND_PASSWORD,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const token = post.Response.token;
            const result = response.result;
            if(result)
                return state.set("token", token)
                    .set("certifiedModal", true)
                    .setIn(["certified","text"], "등록된 이메일로 인증코드를 전송했습니다")
                    .setIn(["findPw",0,"value"], "")
                    .setIn(["findPw",1,"value"], "");
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["findPw",0,"value"], "")
                    .setIn(["findPw",1,"value"], "");
            }
            else{
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["findPw",0,"value"], "")
                    .setIn(["findPw",1,"value"], "");
            }

        }
    },
    {
        type: CHANGE_USER,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result)
                return state.set("changeModal", false)
                    .setIn(["change",0,"value"], "")
                    .setIn(["change",1,"value"], "")
                    .setIn(["message","modal"],true)
                    .setIn(["message","title"],"비밀번호 변경")
                    .setIn(["message","content"],"비밀번호 변경에 성공했습니다.");
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state.set("changeModal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["change",0,"value"], "")
                    .setIn(["change",1,"value"], "");
            }
            else{
                return state.set("changeModal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["change",0,"value"], "")
                    .setIn(["change",1,"value"], "");
            }
        }
    },
    {
        type: CERTIFIED_USER,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            if(result)
                return state.set("certifiedModal", false)
                    .set("changeModal", true)
                    .setIn(["certified",0,"value"], "");
        },
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            if(status === 401 && !post.Response.response.result){
                return state
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["certified",0,"value"], "");
            }
            else{
                return state.set("modal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["certified",0,"value"], "");
            }
        }
    }
]);