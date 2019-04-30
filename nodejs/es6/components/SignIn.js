import React from "react";
import styles from "./style.css";

/* input 컴포넌트 */
const SignIn = ({value, id, type, onChange, title}) => {
    return (
        <div className={styles.item}>
            <input type={type} name={id} value={value} onChange={onChange} placeholder={title}/>
        </div>
    );
};

export default SignIn;