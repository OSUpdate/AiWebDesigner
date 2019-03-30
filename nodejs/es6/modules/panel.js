import { List, Map, fromJS } from "immutable";
import { handleActions, createAction} from "redux-actions";
import * as api from "../lib/api";
import { pender, applyPenders} from "redux-pender";

const TOGGLE = "panel/TOGGLE";
const INSERT = "panel/INSERT";
const INIT = "panel/INIT";
const MENU_TOGGLE = "panel/MENU_TOGGLE";

export const menuToggle = createAction(MENU_TOGGLE);
export const init = createAction(INIT, api.getPanel);
export const toggle = createAction(TOGGLE, id => id);
export const insert = createAction(INSERT, content => content);

let id = 0;
const initialState = Map({
    panel:List(),
    menuToggle:true
});
const reducer = handleActions({
    
    [MENU_TOGGLE]: (state,action) => {
        return state.update("menuToggle", check => !check);

    },
    [TOGGLE]: (state, {payload: id}) => {
        const closeIndex = state.get("panel").findIndex(item => item.get("checked") === true);
        
        const index = state.get("panel").findIndex(item => item.get("id") === id);
        if(closeIndex >= 0 && closeIndex !== index){
            return state.updateIn(["panel",index,"checked"], check => !check)
                .updateIn(["panel",closeIndex,"checked"], check => !check);
        }
        return state.updateIn(["panel",index,"checked"], check => !check);

    },
    [INSERT]: (state, { payload: content }) => {
        const item = Map({
            id: id++,
            content:content,
            checked: false
            
        });
        return state.update("panel",panel => panel.push(item));
    }
}, initialState);

export default applyPenders(reducer, [
    {
        type: INIT,
        onSuccess: (state, action) => {
            const {data: post} = action.payload;
            const response = post.Response.response;
            const buttons = response.button;
            const images = response.image;
            const result = response.result;
            if(result){
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
        onError: (state, action) => {
            return state.set("error", true)
                .setIn(["signIn",1,"value"], "");
        }
    }
]);