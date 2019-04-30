import React from "react";
import SignIn from "./SignIn";
import styles from "./style.css";
import {Link} from "react-router-dom";
import { List, Map } from "immutable";
import CssPanelItem from "./CssPanelItem";
/* Css 편집기 패널 데이터 리스트 컴포넌트 */
const CssPanelList = ({css, onClick}) => {
    const cssPanelList = css.map(
        (item, index) => {
            // 데이터 추출
            const { name, toggle } = item.toJS();
            return(
                <CssPanelItem
                    key={index}
                    id={index}
                    index={index}
                    name={name}
                    onClick={onClick}
                    toggle={toggle}
                />
            );
        }
    );
    return (
        <React.Fragment>
            {cssPanelList}

        </React.Fragment>
    );

};
export default CssPanelList;