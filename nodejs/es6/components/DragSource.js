import React, {Component} from "react";
import ReactDOM from "react-dom";
import { DragSource } from "react-dnd";
import PropTypes from "prop-types";
import $ from "jquery";

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
const source = {
    beginDrag(props, monitor, component) {
        console.log(component);
        return {component};
    },
    canDrag(props,monitor){
        return true;
    },
    endDrag(props, monitor, component) {
        console.log(ReactDOM.findDOMNode(component), "enddrag");
        if (!monitor.didDrop()) {
            $(".hover-target--1ncVr").removeClass("hover-target--1ncVr");
            return;
        }
        return ReactDOM.findDOMNode(component);

    },
};
const collect = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
});
  
Source.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
};
export default DragSource("item", source, collect)(Source);