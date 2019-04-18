import React from "react";
import SignIn from "./SignIn";
import styles from "./style.css";
import {Link} from "react-router-dom";
import { List, Map } from "immutable";
import CssPanelItem from "./CssPanelItem";
import DropTarget from "./DropTarget";

const DropTargetTemplate = ({css, children, onChange}) => {
    let cssNames = [];
    const cssList = css.map(
        (item) => {
            const { name, data } = item.toJS();
            cssNames.push(name);
            return data;
        }
    );

    return (
        <React.Fragment>
            <style dangerouslySetInnerHTML={{ __html: cssList.join(" ")}}>

            </style>
            <DropTarget
                children={children}
                onChange={onChange}
            ></DropTarget>

        </React.Fragment>
    );

};
export default DropTargetTemplate;