import React from "react";
import CssItem from "./CssItem";
import { List, Map } from "immutable";

const CssList = ({css, onChange, onClick}) => {
    const cssList = css.map(
        (css, index)=> {
            const { name, data, toggle } = css.toJS();
            return (
                <CssItem
                    id={index} 
                    key={index}
                    index={index}
                    name={name}
                    code={data}
                    toggle={toggle}
                    onChange={onChange}
                    onClick={onClick}
                />
            );
        }
    );
    return (
        <React.Fragment>
            {cssList}
        </React.Fragment>
    );
};
export default CssList;