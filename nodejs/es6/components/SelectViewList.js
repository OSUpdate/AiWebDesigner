import React from "react";
import SelectView from "./SelectViewItem";
import styles from "./css/agency.css";
import { List, Map } from "immutable";
import cx from "classnames";
/* 템플릿 데이터 리스트 컴포넌트 */
const SelectViewList = ({view, onCheck, recommend, user, onTemplate, onUserCheck, onRecommendCheck}) => {
    const titleStyle = {
        margin:"10px 15px 24px 15px",
        fontSize:"20px",
        fontFmaily:"Helvetica Neue, Helvetica, Arial, sans-serif"
    };
    let recommendList = [];
    let userList = [];
    let viewList = [];
    // 추천 템플릿 데이터로 컴포넌트 배열 생성
    recommendList = recommend.map(
        (item) => {
            // 데이터 추출
            const { id, checked, src, body, name } = item.toJS();
            return(
                <SelectView
                    key={id}
                    id={id}
                    checked={checked}
                    src={src}
                    name={name}
                    body={body}
                    onCheck={onRecommendCheck}
                />
            );
        }
    );
    if(!onTemplate) {
        // 최근 작업한 템플릿 데이터로 컴포넌트 배열 생성
        userList = user.map(
            (item) => {
                // 데이터 추출
                const { id, checked, src, body, name } = item.toJS();
                return(
                    <SelectView
                        key={id}
                        id={id}
                        checked={checked}
                        name={name}
                        src={src}
                        body={body}
                        onCheck={onUserCheck}
                    />
                );
            }
        );
    
        // 모든 템플릿 데이터로 컴포넌트 배열 생성
        viewList = view.map(
            (item) => {
                // 데이터 추출
                const { id, checked, src, body, name } = item.toJS();
                return(
                    <SelectView
                        key={id}
                        id={id}
                        checked={checked}
                        name={name}
                        src={src}
                        body={body}
                        onCheck={onCheck}
                    />
                );
            }
        );
    }
    return (
        <React.Fragment>
            
                
            <div className={cx(styles.col_md_12, styles.col_sm_12, styles.portfolio_item, styles.under_line)}>
                <h3 style={titleStyle}>추천 디자인</h3>
                {recommendList}
            </div>
            {!onTemplate ?
                <React.Fragment>
                    <div className={cx(styles.col_md_12, styles.col_sm_12, styles.portfolio_item, styles.under_line)}>            
                        <h3 style={titleStyle}>최근 선택한 디자인</h3>
                        {userList}
                    </div>
                
                    <div className={cx(styles.col_md_12, styles.col_sm_12, styles.portfolio_item, styles.under_line)}>
                        <h3 style={titleStyle}>모든 디자인</h3>
                        {viewList}
                    </div>
                </React.Fragment>
                :""}
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