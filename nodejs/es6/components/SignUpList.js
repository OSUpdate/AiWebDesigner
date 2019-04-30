import React from "react";
import ErrorInput from "./ErrorInput";
import styles from "./style.css";
import { List, Map } from "immutable";
/* input 컴포넌트 리스트 */
const SignUpList = ({signUp, onChange, onKeyUp, onClick}) => {
    const SignUpList = signUp.map(
        (item, index) => {
            // 데이터 추출
            const { id, checked, value, error, type, title } = item.toJS();
            return(
                <ErrorInput
                    key={index}
                    id={id}
                    type={type}
                    title={title}
                    checked={checked}
                    error={error}
                    value={value}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                />
            );
        }
    );
    /*
    const infoList = info.map(
        (item, i) => (
            <SignUp
                key={i}
                title={title[i]}
                index={i}
                name={names[i]}
                type={types[i]}
                {...item}
                onChange={onChange}
                onKeyUp={onKeyUp}
                //onSignup={onSignup}
            />


        )
    );
    */
    return (
        <React.Fragment>
            {SignUpList}
            <input type="submit" value="회원가입" onClick={onClick}/>
        </React.Fragment>
    );

};
SignUpList.defaultProps = {
    signUp:List([
        Map({
            id:"id",
            type: "text",
            title:"아이디",
            value:"",
            error: "",
            checked: false
        }),
        Map({
            id:"password",
            type: "password",
            title:"비밀번호",
            value:"",
            error:"",
            checked: false,
        }),
        Map({
            id:"check",
            type: "password",
            title:"비밀번호 확인",
            value:"",
            error:"",
            checked: false,
        }),
        Map({
            id:"email",
            type: "email",
            title:"이메일",
            value:"",
            error:"",
            checked: false,
        })
    ]),
    signIn:List([
        Map({
            id:"id",
            type: "text",
            title:"아이디",
            value:"",
        }),
        Map({
            id:"password",
            type: "password",
            title:"비밀번호",
            value:"",
        })
    ]),
    toggle:false,
    modalIsOpen:false
};

export default SignUpList;