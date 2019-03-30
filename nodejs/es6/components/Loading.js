import React from "react";
import styles from "./css/agency.css";
import cx from "classnames";

const Loading = () => {
    return (
        <div className={cx(styles.full, styles.bg_loading)}>
            
            <h4>loading</h4><br/>
            <div className={styles.loader}>
                <div className={styles.loader__bar}></div>
                <div className={styles.loader__bar}></div>
                <div className={styles.loader__bar}></div>
                <div className={styles.loader__bar}></div>
                <div className={styles.loader__bar}></div>
                <div className={styles.loader__ball}></div>
            </div>
        </div>
    );
};

export default Loading;