import React, {Component} from "react";
import Modal from "react-modal";
import styles from "./css/agency.css";
import cx from "classnames";
import {withRouter} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck} from "@fortawesome/free-solid-svg-icons";

// html 모달 스타일
const viewStyles = {
    content : {
        top                   : "50%",
        left                  : "50%",
        right                 : "auto",
        bottom                : "auto",
        marginRight           : "-50%",
        transform             : "translate(-50%, -50%)",
        boxShadow             : "1px 1px 15px 1px #aaaaaa",
        width                 : "100%",
        margin                : "4em auto",
        transition            : "all .5s ease",
        height                : "500px"
        
    },
    overlay : {
    }
};
Modal.setAppElement("#root");
/* 템플릿 (이미지, html 모달) 데이터 컴포넌트 */
class SelectViewItem extends Component { 
    // 상태 변수 선언
    state = {
        modalIsOpen: false,
        load: false
    }
    // html 모달 open 함수
    openModal = (e) => {
        const { history, name} = this.props;
        // 해당 페이지에서 이미지, css 데이터를 받아옴
        history.push(`/select/${name}/`);
        e.stopPropagation();
        // 모달 open
        this.setState({modalIsOpen: true});
    }
    /* html 모달 close 후 처리 함수 */
    afterOpenModal = () => {
    }
    /* html 모달 close 함수 */
    closeModal = () => {
        const { history } = this.props;
        // 모달 close
        this.setState({modalIsOpen: false});
        // 읽어들인 css, image 데이터 삭제
        history.push("/select");
    }
    /* 마우스 over 이벤트 함수 */
    mouseEnter = () => {
        this.setState({mouseOver: true});
    }
    /* 템플릿 onClick 함수 */
    itemCheck = () => {
        const {onCheck} = this.props;
        // 해당 템플릿 선택 함수 호출
        onCheck();
        this.setState({checked : !this.state.checked});
    }

    render(){
        
        const {id,src, body, checked, onCheck, name} = this.props;
        const { modalIsOpen, load} = this.state;
        const {
            openModal,
            closeModal,
            afterOpenModal,
            mouseEnter,
            itemCheck,
        } = this;

        return (
            <div className={cx(styles.col_md_4, styles.col_sm_4, styles.portfolio_item)} >
                <a onClick={(e) => onCheck(e, id)} className={styles.portfolio_link}>
                    <div className={checked ? cx(styles.portfolio_hover, styles.checked) : styles.portfolio_hover}>
                        <div className={styles.portfolio_hover_content}>
                            <i className={checked ? "fa fa-check fa-3x "+ cx(styles.checked, styles.fadeInLeft, styles.animated) : "fa fa-check fa-3x " + cx(styles.no_check, styles.fadeOutRight, styles.animated)}></i>
                            <i onClick={openModal} className={styles.fa_plus}><FontAwesomeIcon icon={faPlus} size="3x"/></i>
                        </div>
                    </div>
                    <img id="test" ref={element => this.test=element} className="img-responsive" src={src} />
                    
                </a>
                
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={() => closeModal()}
                    style={viewStyles}
                    contentLabel="modal"
                    closeTimeoutMS={400}
                        
                    shouldCloseOnOverlayClick={true}
                >      
                    
                    <div id="capture" className={styles.capture + " capture"} ref={element => this.capture=element} dangerouslySetInnerHTML={{ __html: body}}></div>

                </Modal>
                
            </div>
            
        );
    }
}
/*
SelectViewItem.propTypes = {
    src: PropTypes.string,
    onCheck: PropTypes.func,
    onView: PropTypes.func
    //onSignup: PropTypes.func
};

SelectViewItem.defaultProps = {
    src: "",
    onView: () => console.warn("onView not defined"),
    onCheck: () => console.warn("onCheck not defined")
    //onSignup: () => console.warn("onSignup not defined")
};
*/
export default withRouter(SelectViewItem);