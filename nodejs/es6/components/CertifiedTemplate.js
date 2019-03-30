import React, {Component}from "react";
import Modal from "react-modal";
import styles from "./style.css";
const certifiedStyles = {
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
class CertifiedTemplate extends Component {
    
    afterOpenModal = () => {
        // references are now sync'd and can be accessed.
        //this.subtitle.style.color = "#f00";
    }
    render(){
        const {modalIsOpen, changePw, onChange, onPwChange, closeModal, onCertifiedUser, certified} = this.props;
        const {text, value} = certified.toJS();
        const {
            afterOpenModal
        } = this;
        return (
            <React.Fragment>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    style={certifiedStyles}
                    contentLabel="modal"
                    closeTimeoutMS={400}
                >   <div className="reset-header">
                        <h4>이메일 인증</h4>
                        <button onClick={closeModal} className="close-btn">&times;</button>
                    </div>
                    <div className={styles.item}>
                        <p className={styles.email}>{text}</p>
                        <input type="text"  onChange={onChange} value={value} />
                        <a>인증코드 재전송</a>
                    </div>
                    <div className={styles.signup}>
                        <input type="submit" onClick={onCertifiedUser} value="인증받기"></input>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
export default CertifiedTemplate;