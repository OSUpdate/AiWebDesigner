import React from "react";
import Find from "./Find";
import styles from "./style.css";
import ChangePwTemplate from "./ChangePwTemplate";
import CertifiedTemplate from "./CertifiedTemplate";
import { List, Map } from "immutable";

const FindPwList = ({certified, onCertifiedUser, findPw, onChange, onCertified, changeIsOpen, certifiedIsOpen, changePw, changOpenModal, changeCloseModal, certifiedOpenModel, certifiedCloseModal, onPwInput, onPwChange, onChangeUser, onFindPw}) => {
    const FindPwList = findPw.map(
        (item, index) => {
            const { id, value, type, title } = item.toJS();
            return(
                <Find
                    key={index}
                    id={id}
                    type={type}
                    title={title}
                    value={value}
                    onChange={onChange}
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
            {FindPwList}
            <div className={styles.signup}>
                <input type="submit" onClick={onFindPw} value="확인"></input>
            </div>
            <ChangePwTemplate
                changePw={changePw}
                closeModal={changeCloseModal}
                modalIsOpen={changeIsOpen}
                onChange={onPwInput}
                onPwChange={onPwChange}
                onChangeUser={onChangeUser}
            />
            <CertifiedTemplate
                certified={certified}
                onChange={onCertified}
                closeModal={certifiedCloseModal}
                modalIsOpen={certifiedIsOpen}
                onCertifiedUser={onCertifiedUser}
            /> 
        </React.Fragment>

    );

};
FindPwList.defaultProps = {
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

export default FindPwList;