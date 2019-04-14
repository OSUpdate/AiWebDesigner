import React, {Component} from "react";
import styles from "./css/agency.css";
import cx from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
class CssPanelItem extends Component{

    render() {
        let id = 0;
        
        const {name, onClick, toggle} = this.props;
        return (
            <li role="presentation" >
                <a href="#" className={toggle? styles.clicked_btn:""} onClick={(e) => onClick(e)}>
                    <FontAwesomeIcon icon={faCode} style={styles.panel_icon}/><h4>{name}</h4>
                </a>
            </li>
        );
    }
}

export default CssPanelItem;

