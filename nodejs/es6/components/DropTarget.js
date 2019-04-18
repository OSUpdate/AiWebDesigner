import React, {Component} from "react";
import ReactDOM from "react-dom";
import { DropTarget } from "react-dnd";
import styles from "./css/agency.css";
import $ from "jquery";
//{ReactHtmlParser(children)}



const parserOptions = {
    replace: ({ attribs, children }) => {
        if (!attribs) return;
   
        if (attribs.type === "text/javascript" || attribs.type === "meta") {
            console.log(attribs.type);
            return;
        }
    }
};
class Target extends Component{ 

    onDrop = (e) => {
        const {item, onChange, canDrop} = this.props;
        const insertItem = ReactDOM.findDOMNode(item.component);
        console.log(e.target === this.element);
        insertItem.style.opacity = 1;
        if(e.target === this.element){
            this.element.insertAdjacentHTML("beforeend",insertItem.outerHTML);
            $(e.target).removeClass("hover-target--1ncVr");
            onChange(this.element.innerHTML);
            return;
        }
        
        const className = e.target.className;
        const id = e.target.id;
        const innerHtml = e.target.innerHTML;
        const tagName = e.target.tagName;
        const tags = this.element.getElementsByTagName(tagName);
        //console.log(ReactDOM.findDOMNode(item.component), "test");

        Array.prototype.forEach.call(tags, 
            (item)=>{
                /*
                console.log(item.outerHTML, e.target.outerHTML);
                console.log(item.parentNode.innerHTML);
                console.log(innerHtml);
                console.log(e.target.parentNode.innerHTML);
                console.log(e.target.innerHTML === item.innerHTML);
                console.log(item.parentNode.innerHTML === innerHtml);
                */
                if(item.outerHTML === e.target.outerHTML && canDrop){

                    item.insertAdjacentHTML("beforeend",insertItem.outerHTML);
                }
            }
        );
        $(e.target).removeClass("hover-target--1ncVr");
        onChange(this.element.innerHTML);
        //console.log(this.element.inj);
        /*
        if(this.element.getElementsByClassName(className).length !== 0 ){
            console.log("test");
        } 
        */
        //const findItem = this.element.getElementsByClassName(e.target.className).append(ReactDOM.findDOMNode(item.component));
        //console.log(this.state.children);
    }

    onDragEnter = (e, isHover) => {
        const {isOverCurrent, canDrop} = this.props;
        if(canDrop && isOverCurrent){
            $(e.target).addClass("hover-target--1ncVr");
        }
    }
    onDragLeave = (e) => {
        console.log(e,"leave");
        const {isOverCurrent, canDrop} = this.props;
        if(canDrop && isOverCurrent){
            $(e.target).removeClass("hover-target--1ncVr");
        }
    }
    onDragOver = (e, isHover) => {
        e.preventDefault();
        /*
        let insertIndex = null;
        const {item, isOverCurrent, canDrop} = this.props;
        const insertItem = ReactDOM.findDOMNode(item.component);
        const tagName = e.target.tagName;
        const tags = this.element.getElementsByTagName(tagName);
        console.log(isOverCurrent);
        Array.prototype.forEach.call(tags, 
            (item)=>{
                //console.log(item);
                if(item.outerHTML === e.target.outerHTML && canDrop && isHover){
                    isOverCurrent?item.style.backgroundColor = "blue" : item.style.backgroundColor = "white";
                    //insertIndex =item.insertAdjacentHTML("afterend",insertItem.outerHTML);
                    isHover = false;
                }
            }
        );
        */
        //console.log(e.target);
    }
    componentDidMount() {
        this.setState({
            children: this.element
        });
    }
    render(){
        const { connectDropTarget, hovered, children, isOverCurrent, item, canDrop } = this.props;
        //const temp = Parser(children);
        //const test = temp.map((item)=>console.log(item));
        //console.log(temp.props);
        //console.log(isOverCurrent);
        //const html = children.replace(/.capture/g,".target");
        let isHover = true;
        const {onDrop, onDragOver,onDragEnter,onDragLeave} = this;
        return connectDropTarget(
            
            <div
            
                className={styles.target + " target"}
                ref={element => {this.element = element;}}
                onDrop={(e)=>onDrop(e,item)}
                onDragEnter={(e)=>onDragEnter(e,isHover)}
                onDragOver={(e)=>onDragOver(e,isHover)}
                onDragLeave={(e)=>onDragLeave(e)}
                dangerouslySetInnerHTML={{ __html: children}}
            >

            </div>
        );
        
    }

    
}
const target = {
    drop(props, monitor, component) {
        //console.log(ReactDOM.findDOMNode(monitor.getItem()));
        //console.log(monitor.getItem().component);
        //const node = ReactDOM.findDOMNode(component);
        //const findItem = node.getElementsByClassName(component.state.target.className)[0].appendChild(monitor.getItem());
        //console.log(node.getElementsByClassName(component.state.target.className));
        //console.log(ReactDOM.findDOMNode(monitor.getItem()));
        return props;
    },
    hover(props, monitor, component) {
        const {id: draggedId, parent, items} = monitor.getItem();
        //console.log(ReactDOM.findDOMNode(component));
        const isJustOverThisOne = monitor.isOver({ shallow: true });
        //console.log(isJustOverThisOne);
        if (!monitor.isOver({shallow: true})) return;
    
        //const descendantNode = props.find(props.parent, items);
        //if (descendantNode) return;
        //if (parent == props.parent || draggedId == props.parent) return;
    
        //props.move(draggedId, props.id, props.parent);
    }
};
const collect = (connect,  monitor) => ({
    connectDropTarget: connect.dropTarget(),
    hovered: monitor.isOver(),
    item:monitor.getItem(),
    canDrop: monitor.canDrop(),
    isOverCurrent: monitor.isOver({ shallow: true }),
});

export default DropTarget("item", target, collect)(Target);