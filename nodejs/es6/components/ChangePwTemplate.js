import React, {Component}from "react";
import ChangePwList from "./ChangePwList";
import Modal from "react-modal";

// 모달창 스타일
const changePwStyles = {
    content : {
        top                   : "50%",
        left                  : "50%",
        right                 : "auto",
        bottom                : "auto",
        marginRight           : "-50%",
        transform             : "translate(-50%, -50%)",
        boxShadow             : "1px 1px 15px 1px #aaaaaa",
        width                 : "100%",
        maxWidth              : "400px",
        margin                : "4em auto",
        transition            : "all .5s ease",
        
    },
    overlay : {
    }
};
Modal.setAppElement("#root");

/* 비밀번호 변경 UI 컴포넌트 */
class ChangePwTemplate extends Component {
    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = "#f00";
    }
    render(){
        const {modalIsOpen, changePw, onChange, onPwChange, closeModal, onChangeUser} = this.props;
        const {
            afterOpenModal
        } = this;
        return (
            <React.Fragment>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    style={changePwStyles}
                    contentLabel="modal"
                    closeTimeoutMS={400}
                >   <div className="reset-header">
                        <h4>비밀번호 재설정</h4>
                        <button onClick={closeModal} className="close-btn">&times;</button>
                    </div>
                    <ChangePwList
                        changePw={changePw}
                        onChange={onChange}
                        onKeyUp={onPwChange}
                        onChangeUser={onChangeUser}
                    />
                    
                </Modal>
            </React.Fragment>
        );
    }
}
export default ChangePwTemplate;