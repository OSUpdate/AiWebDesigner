import React from "react";
import PanelItem from "./PanelItem";
import { List, Map } from "immutable";
/* 패널 데이터 리스트 컴포넌트 */
const PanelList = ({panel}) => {
    // 버튼, 이미지 패널 컴포넌트 배열 생성
    const panelList = panel.map(
        (panel, index)=> {
            const {id, content,checked} = panel.toJS();
            return (
                <PanelItem
                    id={id} 
                    key={id}
                    header="테스트중"
                    content={content}
                    checked={checked}
                />
            );
        }
    );
    return (
        <React.Fragment>
            {panelList}
        </React.Fragment>
    );
};

/* 패널 데이터 리스트 디폴트 값 */
PanelList.defaultProps = {
    panel: List([
        Map({
            id: 0,
            content: "<button>test</button>",
            checked: false
        }),
        Map({
            id: 1,
            content: "<button>test1</button><button>test2</button>",
            checked: false
        })
    ]),
    menuToogle: true
};
export default PanelList;