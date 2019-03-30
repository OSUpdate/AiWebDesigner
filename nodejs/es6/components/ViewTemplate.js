import React from "react";
import styles from "./css/agency.css";
import cx from "classnames";
import Header from "./common/Header";
const ViewTemplate = ({children,title,subtitle, loginId, update}) => {
    return (
        <React.Fragment>
            <div className={cx(styles.col_lg_12, styles.text_center, styles.margin_0)}>
                <h2 className={styles.section_heading}>{title}</h2>
                <h3 className={styles.select_subtitle}>{subtitle}</h3>
            </div>
            <div id={styles.portfolio} className={styles.padding}>
            
                <div className={styles.container}>
                    <div className={styles.row}>
                        {children}
                    </div>
                    {update?
                        <div className={styles.center}>
                            <div className={styles.loader}>
                                <div className={styles.loader__bar}></div>
                                <div className={styles.loader__bar}></div>
                                <div className={styles.loader__bar}></div>
                                <div className={styles.loader__bar}></div>
                                <div className={styles.loader__bar}></div>
                                <div className={styles.loader__ball}></div>
                            </div>
                        </div>
                        :
                        ""}
                </div>
            </div>
        </React.Fragment>
    );
};
export default ViewTemplate;