import React from "react";
import classNames from "classnames";
import styles from "./style.css";

const ErrorInput = ({value, id, type, onChange, title, check, error, onKeyUp}) => {
    return (
        <div className={classNames(styles.item, error ? styles.red : "")}>
            <input className={error ? styles.test : ""} type={type} name={id} value={value} onChange={onChange} onKeyUp={onKeyUp} placeholder={title}/>
            <p className={styles.error} >{error}</p>
        </div>
    );
};

export default ErrorInput;