import React from "react";
import SelectView from "./SelectViewItem";
import { List, Map } from "immutable";

const SelectViewList = ({view, onCheck}) => {
    
    const viewList = view.map(
        (item) => {
            const { id, checked, src, body } = item.toJS();
            return(
                <SelectView
                    key={id}
                    id={id}
                    checked={checked}
                    src={src}
                    body={body}
                    onCheck={onCheck}
                />
            );
        }
    );
    return (
        <React.Fragment> 
            {viewList}
        </React.Fragment>

       
    );

};

/*
SignUpList.propTypes = {
    info: PropTypes.arrayOf(PropTypes.shape({error: PropTypes.string, data: PropTypes.string})),
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    onSignup: PropTypes.func
};
*/
SelectViewList.defaultProps = {
    view: List([
        Map({
            id: 0,
            src: "",
            checked: false
        }),
        Map({
            id: 1,
            src: "",
            checked: false
        })
    ])
};

export default SelectViewList;