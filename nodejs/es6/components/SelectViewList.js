import React from "react";
import SelectView from "./SelectViewItem";
import styles from "./css/agency.css";
import { List, Map } from "immutable";
import cx from "classnames";

const SelectViewList = ({view, onCheck, recommend, user, onTemplate}) => {
    const titleStyle = {
        margin:"10px 15px 24px 15px",
        fontSize:"20px",
        fontFmaily:"Helvetica Neue, Helvetica, Arial, sans-serif"
    };
    let recommendList = [];
    let userList = [];
    if(!onTemplate) {
        recommendList = recommend.map(
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
        userList = user.map(
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
    }
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
            {!onTemplate ?
                <React.Fragment>
                    <div className={cx(styles.col_md_12, styles.col_sm_12, styles.portfolio_item, styles.under_line)}>
                        <h3 style={titleStyle}>추천 디자인</h3>
                        {recommendList}
                    </div>
                    <div className={cx(styles.col_md_12, styles.col_sm_12, styles.portfolio_item, styles.under_line)}>            
                        <h3 style={titleStyle}>최근 선택한 디자인</h3>
                        {userList}
                    </div>
                </React.Fragment>
                :""}
            <div className={cx(styles.col_md_12, styles.col_sm_12, styles.portfolio_item, styles.under_line)}>
                <h3 style={titleStyle}>모든 디자인</h3>
                {viewList}
            </div>
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
            body: "",
            checked: false
        }),
    ])
};

export default SelectViewList;