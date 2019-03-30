import * as types from "../actions/ActionTypes";

const initialState = {
    info: [
        {
            error: "",
            value: ""
        },
        {
            error: "",
            value: ""
        },
        {
            error: "",
            value: ""
        },
        {
            error: "",
            value: ""
        }
    ]
};
const valid = (index, info, regexr) => {
    let text = "";
    switch(index){
    case 0:

        if(!regexr(/^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/,info[index].value))
            text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
        break;
    case 1:

        if(!regexr(/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/,info[index].value))
            text = "영문, 숫자 조합으로 6자 이상 입력해주세요";
        break;
    case 2:
        if(info[2].value !== info[1].value)
            text = "바말번호가 다릅니다";
        break;
    case 3:

        if(!regexr(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/,info[index].value))
            text = "이메일 형식에 맞춰 입력해주세요";
        break;
    }
    return text;

};
const check = (password, check) => password === check;
function signUp(state = initialState, action){
    const { info } = state;
    switch(action.type){
    
    case types.KEYUP:{
        let text = valid(action.index, info, 
            (reg, data) => reg.test(data));
        return {
            info:[
                ...info.slice(0,action.index),
                {
                    ...info[action.index],
                    error: text

                },
                ...info.slice(action.index+1, info.length)
            ]
        };
    }
    
    case types.CHANGE:{

        return {
            info:[
                ...info.slice(0,action.index),
                {
                    ...info[action.index],
                    value: action.value

                },
                ...info.slice(action.index+1, info.length)
            ]

        };
    }
    /*
    case types.SIGNUP:{
        return{
            ...info
        };
    }
    */
    default:
        return state;
    }
}
export default signUp;