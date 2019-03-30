import React from "react";
import ErrorInput from "./ErrorInput";
import styles from "./style.css";
import { List, Map } from "immutable";

const ChangePwList = ({changePw, onChange, onKeyUp, onChangeUser}) => {
    const ErrorInputList = changePw.map(
        (item, index) => {
            const { id, value, type, title, error, check } = item.toJS();
            return(
                <ErrorInput
                    key={index}
                    id={id}
                    type={type}
                    title={title}
                    value={value}
                    onChange={onChange}
                    onKeyUp={onKeyUp}
                    error={error}
                    check={check}
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
            {ErrorInputList}
            <div className={styles.signup}>
                <input type="submit" onClick={onChangeUser} value="확인"></input>
            </div>
        </React.Fragment>

    );

};
ChangePwList.defaultProps = {
    findId:List([
        Map({
            id:"email",
            type: "email",
            title:"이메일",
            value:"",
        })
    ]),
    findPw:List([
        Map({
            id:"id",
            type: "text",
            title:"아이디",
            value:"",
        }),
        Map({
            id:"email",
            type: "email",
            title:"이메일",
            value:"",
        })
    ]),
    changePw:List([
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
        })
    ]),
    toggle:false,
    modalIsOpen:false
};

export default ChangePwList;