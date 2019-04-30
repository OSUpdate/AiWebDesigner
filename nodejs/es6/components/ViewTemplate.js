import React from "react";
import styles from "./css/agency.css";
import cx from "classnames";
import Header from "./common/Header";
import {Radar, defaults} from "react-chartjs-2";
// 차트 폰트 설정
defaults.global.defaultFontFamily = "Helvetica Neue";
/* 로딩 컴포넌트 */
const ViewTemplate = ({children,title,subtitle, loginId, update, data}) => {
    // 차트 옵션 설정
    const options = {
        scale: {
            pointLabels: {
                fontSize: 15,
            }
        },
        legend: {
            labels: {
                fontColor: "#222",
                fontSize: 20
            },
            
        },
        elements:{
            backgroundColor: "#222"
        },
        // 크기 변경 허용
        responsive: true,
        maintainAspectRatio: true,
    };
    return (
        <React.Fragment>
            <div className={cx(styles.col_lg_12, styles.text_center, styles.margin_0, styles.top_margin)}>
                <h2 className={styles.section_heading}>{title}</h2>
                <h3 className={styles.select_subtitle}>{subtitle}</h3>
            </div>
            <div className={styles.chart_container}>
                <Radar data={data} options={options}/>
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