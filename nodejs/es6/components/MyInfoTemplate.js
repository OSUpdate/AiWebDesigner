import React from "react";
import {Line} from "react-chartjs-2";

import Header from "./common/Header";
import Footer from "../components/common/Footer";

import ChangePwTemplate from "./ChangePwTemplate";

const MyInfoTemplate = ({
    loginId, 
    data, 
    logged, 
    onLogout,    
    change,
    onPwInput,
    openModal,
    closeModal,
    modalIsOpen,
    onPwChange,
    onChangeUser}) => {
    const right = {
        textAlign:right
    };
    return(
        <React.Fragment>
            <Header 
                loginId={loginId}
                logged={logged}
                onLogout={onLogout}
            />
            <section className="editor">
        
                <div className="info-view-content">
            
                    <div className="info-view-frame">
                        <div className="info-view">
                            <div className="container">
                                <div className="row info-row">
                                    <div className="col-md-7 col-sm-6 info-item col-centered">
                                        <div className="info-card">
                                            <div className="info-card-header">
                                                <h1>test</h1>
                                            </div>
                                            <div className="info-card-content">
                                                <Line data={data} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7 col-sm-6 info-item col-centered">
                                        <div className="info-card">
                                            <div className="info-card-header">
                                                <h1>test</h1>
                                            </div>
                                            <div className="info-card-content">
                                                <Line data={data} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-7 col-sm-6 info-item col-centered">
                                        <div className="info-card">
                                            <div className="info-card-header">
                                                <h1>프로필</h1>
                                            </div>
                                            <div className="info-card-content">
                                                <h3>{loginId} 님</h3>
                                            </div>
                                            <div className="info-card-content right" 
                                            >
                                                <a onClick={openModal}><h4>비밀번호 변경</h4></a>
                                                <ChangePwTemplate
                                                    changePw={change}
                                                    closeModal={closeModal}
                                                    modalIsOpen={modalIsOpen}
                                                    onChange={onPwInput}
                                                    onPwChange={onPwChange}
                                                    onChangeUser={onChangeUser}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                
                    </div>
                    <Footer/>
                </div>
            </section>
        </React.Fragment>
    );
};
export default MyInfoTemplate;