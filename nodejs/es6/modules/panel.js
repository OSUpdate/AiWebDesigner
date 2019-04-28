import { List, Map, fromJS } from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

// 패널 버튼, 이미지 toggle 
const TOGGLE = "panel/TOGGLE";

// 패널 메뉴 추가
const INSERT = "panel/INSERT";

// 패널 초가화
const INIT = "panel/INIT";

// 패널 toggle
const MENU_TOGGLE = "panel/MENU_TOGGLE";

// 패널 toggle 함수
export const menuToggle = createAction(MENU_TOGGLE);

// 패널 초기화 함수
export const init = createAction(INIT, api.getPanel);

// 패널 버튼, 이미지 toggle 함수
export const toggle = createAction(TOGGLE, id => id);

// 패널 메뉴 추가 함수
export const insert = createAction(INSERT, content => content);

// 패널 번호
let id = 0;

// 상태 관리에 필요한 변수들 선언
const initialState = Map({
    // 패널 아이템 리스트
    panel:List(),
    // css 파일 리스트
    cssPanel:List(),
    // 패널 toggle
    menuToggle:true
});
// 함수들 구현
const reducer = handleActions({
    // 패널 toggle 함수
    [MENU_TOGGLE]: (state,action) => {
        return state.update("menuToggle", check => !check);

    },
    // 패널 버튼, 이미지 toggle 함수
    [TOGGLE]: (state, {payload: id}) => {
        // 이전에 열려진 패널이 있는지 확인
        const closeIndex = state.get("panel").findIndex(item => item.get("checked") === true);
        // 클릭이 일어난 패널 찾음
        const index = state.get("panel").findIndex(item => item.get("id") === id);
        // 열려진 패널을 닫고 클릭이 일어난 패널을 열음
        if(closeIndex >= 0 && closeIndex !== index){
            return state.updateIn(["panel",index,"checked"], check => !check)
                .updateIn(["panel",closeIndex,"checked"], check => !check);
        }
        // 클릭이 일어난 패널 open
        return state.updateIn(["panel",index,"checked"], check => !check);

    },
    // 패널 아이템 추가 함수
    [INSERT]: (state, { payload: content }) => {
        const item = Map({
            id: id++,
            content:content,
            checked: false
            
        });
        return state.update("panel",panel => panel.push(item));
    }
}, initialState);
// 비동기 통신 함수
export default applyPenders(reducer, [
    {
        // 초기화 함수
        type: INIT,
        // 통신이 성공일 경우 싱행 함수
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const buttons = response.button;
            const images = response.image;
            const result = response.result;
            // 패널 아이템 추가
            if(result){
                // 버튼, 이미지 메뉴 추가
                const tempList = List([
                    Map({
                        id: 0,
                        content:buttons,
                        checked: false
                    }),
                    Map({
                        id: 1,
                        content:images,
                        checked: false
                    })
                ]);
                return state.set("panel", tempList);
            }
        },
        // 에러가 발생한 경우 실행 함수
        onError: (state, action) => {
            return state.set("error", true)
                .setIn(["signIn",1,"value"], "");
        }
    }
]);