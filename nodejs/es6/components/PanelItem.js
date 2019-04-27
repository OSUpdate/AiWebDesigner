import React, {Component} from "react";
import styles from "./css/agency.css";
import DragSource from "./DragSource";
import Parser from "html-react-parser";
import cx from "classnames";

/* 패널 (버튼, 이미지 패널) 데이터 컴포넌트 */
class PanelItem extends Component{
    /*
    <Sortable
                        dangerouslySetInnerHTML={{ __html: content}}
                        options={{
                            animation: 150,
                            sort: false,
                            group: {
                                name: "clone1",
                                pull: "clone",
                                put: false
                            },
                            onEnd: (evt) => {
                                console.log(evt.target);
                            },
                            onRemove: (evt) => {
                                console.log(evt.target);
                            }
                        }}
                        
                        
                    >
                    </Sortable>
    const handleClick = (e) => {
        console.log(e.target);
    };
    dangerouslySetInnerHTML={{ __html: content }}
    <DragSource
                        content={content}
                        color={"red"}
                    >
                    </DragSource>
    */

    render() {
        let id = 0;
        
        const {header,content, checked} = this.props;
        // 패널에 DragSource 컴포넌트 리스트 생성
        const items = content.map(
            (item,index) =>{
                return(
                    <DragSource key={index} item={Parser(item)} handleDrop={(e)=>console.log(e)}>
                    </DragSource>
                );
            }
        );
        return (
            <div className={checked ? cx(styles.panel_container, styles.slideInLeft, styles.animated):cx(styles.panel_container, styles.slideOutLeft, styles.animated)}>
                <div className={styles.panel_header}>
                    {header}
                </div>
                
                <div className={styles.panel_content} >
                    {items}
                </div>
                <div className={styles.panel_footer}>
                </div>
            </div>
        );
    }
}

export default PanelItem;

