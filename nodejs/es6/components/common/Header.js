import React from "react";
import { Link } from "react-router-dom";
import styles from "../css/agency.css";
import cx from "classnames";

/* Herder UI 컴포넌트 */
const Header = ({loginId, logged, onLogout}) => {
    return (
        <nav id="mainNav" className={cx(styles.navbar, styles.navbar_default, styles.navbar_custom, styles.navbar_absolute, styles.navbar_editor)}>
            <div className={cx(styles.container, styles.navbar_editor_container)}>
                <div className={"page-scroll "+styles.navbar_header}>
                    <a href="/" className={styles.navbar_brand+ " page-scroll"}>AWS</a>
                </div>

                <div className={cx(styles.collapse, styles.navbar_collapse)} id="bs-example-navbar-collapse-1">
                    <ul className={cx(styles.nav, styles.navbar_nav, styles.navbar_right)}>
                        <li className="hidden">
                            <a className="#page-top"></a>
                        </li>
                        <li>
                            <Link to="/info" className="page-scroll" >{loginId} 님</Link>
                        </li>
                        <li>
                            <a onClick={onLogout}>로그아웃</a>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
};
export default Header;