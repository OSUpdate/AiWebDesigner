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

// 상태 관리에 필요한 변수들 선언
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
    // 아이디/ 비밀번호 찾기 toggle
    toggle:false,
    // 비밀번호 변경 모달 toggle
    changeModal:false,
    // 이메일 인증 모달 toggle
    certifiedModal:false,
    // 로그인 token 데이터
    token:""
});
// 함수들 구현
const reducer = handleActions({
    // 이메일 모달 open 함수
    [CERTIFIED_OPEN_MODAL]: (state, action) => {
        return state.set("certifiedModal", true);
    },
    // 이메일 모달 close 함수
    [CERTIFIED_CLOSE_MODAL]: (state, action) => {
        return state.set("certifiedModal", false);
    },
    // 비밀번호 변경 모달 open 함수
    [CHANGE_OPEN_MODAL]: (state, action) => {
        return state.set("changeModal", true);
    },
    // 비밀번호 변경 모달 close 함수
    [CHANGE_CLOSE_MODAL]: (state, action) => {
        return state.set("changeModal", false);
    },
    // 메시지 모달 close 함수
    [CLOSE_MESSAGE]: (state, action) => {
        return state.setIn(["message", "modal"], false);
    },
    // 아이디 찾기 toggle 함수
    [ISFINDID]: (state, action) => {
        return state.set("toggle", true);
    },
    // 비밀번호 찾기 toggle 함수
    [ISFINDPW]: (state, action) => {
        return state.set("toggle", false);
    },
    // 아이디 찾기 이메일 input 함수
    [INPUT_ID_EMAIL]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["findId", "value"],value);
    },
    // 비밀번호 찾기 이메일 input 함수
    [INPUT_PW_EMAIL]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["findPw", 1, "value"],value);
    },
    // 비밀번호 찾기 아이디 input 함수
    [INPUT_PW_ID]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["findPw", 0, "value"],value);
    },
    // 이메일 인증 input 함수
    [INPUT_CERTIFIED]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["certified","value"],value);
    },
    // 비밀번호 input 함수
    [INPUT_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 0, "value"],value);
    },
    // 비밀번호 확인 input 함수
    [INPUT_PASSWORD_CHECK]: (state, action) => {
        const { payload: value } = action;
        return state.setIn(["change", 1, "value"],value);
    },
    // 비밀번호 변경 비밀번호 input 검증 함수
    [CHANGE_PASSWORD]: (state, action) => {
        const { payload: value } = action;
        // 정규식으로 비밀번호 검증
        if(!(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(value))){
            if(value === ""){
                return state.setIn(["change", 0, "error"],"")
                    .setIn(["change", 0,"checked"],false);
            }
            // 규칙을 벗어났을 경우 에러 메시지 출력
            const text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
            return state.setIn(["change", 0, "error"],text)
                .setIn(["change", 0,"checked"],true);
        }
        return state.setIn(["change", 0,"error"], "")
            .setIn(["change", 0,"checked"],false);
    },
    // 비밀번호 변경 비밀번호 확인 input 검증 함수
    [CHANGE_PASSWORD_CHECK]: (state, action) => {
        const { payload: value } = action;
        // 비밀번호 input과 동일한 값인지 체크
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
// 비동기 통신 함수
export default applyPenders(reducer, [
    {
        // 서버에 아이디 찾기 요청
        type: FIND_ID,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {

            return state.setIn(["message","modal"],true)
                .setIn(["message","title"],"아이디 찾기")
                .setIn(["message","content"],"입력하신 이메일로 아이디를 전송했습니다")
                .setIn(["findId","value"], "");
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                // 메시지 모달 open, 메시지 모달 내용 설정
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["findId","value"], "")
                    .setIn(["message","content"],"아이디 찾기에 실패했습니다.");
            }
            // 통신에 문제 발생시 에러 처리
            else{
                // 메시지 모달 open, 메시지 모달 내용 설정
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],"서버와 연결에 문제가 발생했습니다.")
                    .setIn(["findId","value"], "");
            }
        }
    },
    {
        // 서버에 비밀번호 찾기 요청
        type: FIND_PASSWORD,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const token = post.Response.token;
            const result = response.result;
            // 이메일 인증 모달 open, 내용 설정
            if(result)
                return state.set("token", token)
                    .set("certifiedModal", true)
                    .setIn(["certified","text"], "등록된 이메일로 인증코드를 전송했습니다")
                    .setIn(["findPw",0,"value"], "")
                    .setIn(["findPw",1,"value"], "");
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                return state.setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["findPw",0,"value"], "")
                    .setIn(["findPw",1,"value"], "");
            }
            // 통신에 문제 발생시 에러 처리
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
        // 비밀번호 변경 요청
        type: CHANGE_USER,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            // 변경에 성공했을 경우 모달 내 input 값 초기화, 모달 창 close
            if(result)
                return state.set("changeModal", false)
                    .setIn(["change",0,"value"], "")
                    .setIn(["change",1,"value"], "")
                    .setIn(["message","modal"],true)
                    .setIn(["message","title"],"비밀번호 변경")
                    .setIn(["message","content"],"비밀번호 변경에 성공했습니다.");
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                return state.set("changeModal", false)
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["change",0,"value"], "")
                    .setIn(["change",1,"value"], "");
            }
            // 통신에 문제 발생시 에러 처리
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
        // 이메일 인증 요청
        type: CERTIFIED_USER,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const result = response.result;
            // 이메일 모달 close, 값 초기화 비밀번호 변경 모달 open
            if(result)
                return state.set("certifiedModal", false)
                    .set("changeModal", true)
                    .setIn(["certified",0,"value"], "");
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            const {data: post, status: status} = action.payload.response;
            // 값에 이상이 있는 경우 에러 처리
            if(status === 401 && !post.Response.response.result){
                return state
                    .setIn(["message", "modal"], true)
                    .setIn(["message", "title"],"Error")
                    .setIn(["message", "content"],post.Response.response.error)
                    .setIn(["certified",0,"value"], "");
            }
            // 통신에 문제 발생시 에러 처리
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