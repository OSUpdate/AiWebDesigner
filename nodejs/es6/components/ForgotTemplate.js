import React from "react";
import FindIdList from "./FindIdList";
import FindPwList from "./FindPwList";
import styles from "./style.css";
import {Link} from "react-router-dom";

/* 아이디/비밀번호 찾기 UI 컴포넌트 */
const ForgotTemplate = ({
    onCertifiedUser,
    certified,
    onCertified,
    certifiedIsOpen,
    changeIsOpen,
    forgotToggle,
    changePw, 
    findPw, 
    findId, 
    onIdToggle,
    onPwToggle, 
    onFindIdInput,
    onFindPwInput,
    onPwInput,
    changOpenModal,
    changeCloseModal,
    certifiedOpenModel,
    certifiedCloseModal,
    onChangeUser,
    onPwChange,
    onFindId,
    onFindPw
}) => {
    return(
        <React.Fragment>
            <section className="editor">
        
                <div className="info-view-content space">
            
                    <div className="info-view-frame h-100">
                        <div className="info-view">
                            <div className="container">
                                <div className="info-view-header">
                                    <Link to="/"><h1>AWS</h1></Link>
                                </div>
                                <div className="row info-row">
                                    <div className="col-md-5 col-sm-3 info-item col-centered">
                                        <div className="info-card">
                                            <div className="info-card-header">
                                                <ul>
                                                    <li className={styles.toggle}>
                                                        <button className={forgotToggle?["space " ,styles.test].join(""):"space"} onClick={onIdToggle}><h4>아이디 찾기</h4></button>
                                                    </li>
                                                    
                                                    <li className={styles.toggle}>
                                                        <button className={forgotToggle?"space":["space " ,styles.test].join("")} onClick={onPwToggle}><h4>비밀번호 찾기</h4></button>
                                                    </li>
                                                </ul>
                                                
                                            </div>
                                            {forgotToggle?
                                                <div className="info-card-content">
                                                    <FindIdList
                                                        findId={findId}
                                                        onChange={onFindIdInput}
                                                        onFindId={onFindId}

                                                    />
                                                </div>
                                                :
                                                <div className="info-card-content">
                                                    <FindPwList
                                                        onCertifiedUser={onCertifiedUser}
                                                        certified={certified}
                                                        changOpenModal={changOpenModal}
                                                        changeCloseModal={changeCloseModal}
                                                        certifiedOpenModel={certifiedOpenModel}
                                                        certifiedCloseModal={certifiedCloseModal}
                                                        findPw={findPw}
                                                        onChange={onFindPwInput}
                                                        changePw={changePw}
                                                        onPwInput={onPwInput}
                                                        onPwChange={onPwChange}
                                                        changeIsOpen={changeIsOpen}
                                                        certifiedIsOpen={certifiedIsOpen}
                                                        onChangeUser={onChangeUser}
                                                        onFindPw={onFindPw}
                                                        onCertified={onCertified}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};
export default ForgotTemplate;