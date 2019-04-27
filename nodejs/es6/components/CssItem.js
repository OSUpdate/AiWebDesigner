import React, {Component} from "react";
import styles from "./css/agency.css";
import cx from "classnames";
import CssCodeEditor from "./CssCodeEditor";

/* Css 편집기 데이터 리스트 컴포넌트 */
class CssItem extends Component{
    render() {
        const {name, code, onChange, toggle, onClick, index} = this.props;
        return (
            <React.Fragment>
                {toggle?
                    <React.Fragment>   
                        <div className={toggle? styles.code_header : cx(styles.code_header, styles.h_0)}>
                            <div className={cx(styles.container, styles.bg_black)}>
                                <div className={styles.code_header_title}>
                                    <p>{name}코드 편집기</p>
                                </div>
                                <div>
                                    <ul className={styles.code_header_btn}>
                                        <li>
                                            <a onClick={(e) => onClick(e)} className={styles.close_btn}>&times;</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                                
                        <div className={toggle? cx(styles.container_editor_area, styles.h_30):cx(styles.container_editor_area)}>
                            <CssCodeEditor
                                code={code}
                                onChange={onChange}
                                index={index}
                            />
                        </div>
                    </React.Fragment>   
                    :""}
            </React.Fragment>     
        );
    }
}

export default CssItem;

