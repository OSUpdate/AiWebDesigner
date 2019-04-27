import React, {Component} from "react";
import styles from "./css/agency.css";
import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

/* Css 편집기 패널 데이터 컴포넌트 */
class CssPanelItem extends Component{

    render() {
        let id = 0;
        
        const {name, onClick, toggle, index} = this.props;
        return (
            <li role="presentation" >
                <a href="#" className={toggle? styles.clicked_btn:""} onClick={(e) => onClick(e, index)}>
                    <FontAwesomeIcon icon={faCode} style={styles.panel_icon}/><h4>{name}</h4>
                </a>
            </li>
        );
    }
}

export default CssPanelItem;

