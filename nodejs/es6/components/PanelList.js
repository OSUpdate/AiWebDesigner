import React from "react";
import PanelItem from "./PanelItem";
import { List, Map } from "immutable";

const PanelList = ({panel}) => {
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