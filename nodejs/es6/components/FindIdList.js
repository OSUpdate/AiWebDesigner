import React from "react";
import Find from "./Find";
import styles from "./style.css";
import { List, Map } from "immutable";

const FindIdList = ({findId, onChange, onFindId}) => {

    const id = findId.get("id");
    const value = findId.get("value");
    const type = findId.get("type");
    const title = findId.get("title");
    
    return (
        <React.Fragment>
            <Find
                id={id}
                type={type}
                title={title}
                value={value}
                onChange={onChange}
            />
            <div className={styles.signup}>
                <input type="submit" onClick={onFindId} value="확인"></input>
            </div>
        </React.Fragment>

    );

};
FindIdList.defaultProps = {
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

export default FindIdList;