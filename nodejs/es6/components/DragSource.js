import React, {Component} from "react";
import ReactDOM from "react-dom";
import { DragSource } from "react-dnd";
import PropTypes from "prop-types";
import $ from "jquery";
/* Drag 컴포넌트 */
class Source extends Component { 
    render(){
        const { item, connectDragSource, isDragging, content} = this.props;
        return (

            <div
                style={{ 
                    opacity: isDragging ? 0.25 : 1,
                
                }}
                ref={element=>{
                    this.element=ReactDOM.findDOMNode(element);
                    connectDragSource(ReactDOM.findDOMNode(element));}}
                
            >
                {item}
            </div>
            
        );
    }
}
// Drag 이벤트시 콜백 함수들 정의
const source = {
    // Drag 시작하는 경우 처리 함수
    beginDrag(props, monitor, component) {
        return {component};
    },
    // Drag중인 경우 처리 함수
    canDrag(props,monitor){
        return true;
    },
    // Drag 끝난 경우
    endDrag(props, monitor, component) {

        if (!monitor.didDrop()) {
            // Drop 가능 객체 테두리 제거
            $(".hover-target--1ncVr").removeClass("hover-target--1ncVr");
            return;
        }
        return ReactDOM.findDOMNode(component);

    },
};
// Drag 이벤트 발생 시 함수 연결
const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
});
// 기본 타입 정의
Source.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
};
// Drag 이벤트와 Drop 이벤트 연결
export default DragSource("item", source, collect)(Source);