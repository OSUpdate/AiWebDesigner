import { handleActions, createAction } from "redux-actions";
import { List, Map } from "immutable";
import axios from "axios";
import { pender, applyPenders} from "redux-pender";

function getPostAPI(postId){
    return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
}
//redux-pender 이용시 코드
const GET_POST = "GET_POST";
/*
const GET_POST_PENDING = "GET_POST_PENDING";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_FAILURE = "GET_POST_FAILURE";

const getPostPending = createAction(GET_POST_PENDING);
const getPostSuccess = createAction(GET_POST_SUCCESS);
const getPostFailure = createAction(GET_POST_FAILURE);
*/

export const getPost = createAction(GET_POST, getPostAPI); 
/*
redux-promise-middleware 이용시 코드
export const getPost = (postId) => ({
    type: GET_POST,
    payload: getPostAPI(postId)
});

redux-thunk 이용시 코드
export const getPost = (postId) => dispatch => {
    dispatch => {
        dispatch({type: GET_POST_PENDING});

        return getPostAPI(postId).then((response) => {
        // 요청이 성공일 경우 응답 내용 payload로 설정해 전달
            // 추후 프로미스에서 response에 접근 가능
            dispatch({
                type: GET_POST_SUCCESS,
                payload: response
            });
        }).catch(error =>{
        // 오류 발생시 오류 내용을 payload로 설정해 전달
            dispatch({
                type: GET_POST_FAILURE,
                payload: error
            });
        });

    };
    */
const initialState = Map({
    /*
    redux-thunk,
    redux-promise-middleware 이용 코드

    pending: false,
    error: false,
    */
    data: Map({
        title: "",
        body: ""
    })
});
const reducer = handleActions({
    //다른 일반 액션들을 관리
}, initialState);
export default applyPenders(reducer, [
    {
        type: GET_POST,
        onSuccess: (state, action) => {
            const {title, body} = action.payload.data;
            const item = Map({
                title:title,
                body:body
            });
            return state.set("data",item);
        }
    }
]);
/* 
export default handleActions({
    ...pender({
        type: GET_POST,

        onSuccess: (state, action) => {
            const {title, body} = action.payload.data;
            const item = Map({
                title:title,
                body:body
            });
            return state.set("data",item);
        }
        
        실패했을 경우 실행할 코드
        onFailure: (state, action) => {

        }
        요청했을 경우 실행할 코드
        onPending: (state, action) => {

        }
        생략했을 경우 state를 그대로 반환함
        
    })
*/
/*
    redux-thunk,
    redux-promise-middleware 이용 코드
    
    [GET_POST_PENDING]: (state, action) =>{
        return state.set("pending",true)
            .set("error",false);
    },
    [GET_POST_SUCCESS]: (state, action) =>{
        const {title, body} = action.payload.data;
        const item = Map({
            title:title,
            body:body
        });
        return state.set("pending",false)
            .set("data",item);
    },
    [GET_POST_FAILURE]: (state, aaction) =>{
        return state.set("pending",false)
            .set("error", true);
    }
    
}, initialState);
*/