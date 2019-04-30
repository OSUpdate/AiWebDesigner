import React from "react";

// 비동기 컴포넌트 라우팅 클래스
export default function asyncComponent(getComponent){
    return class AsyncComponent extends React.Component{
        static Component = null;
        state = { Component: AsyncComponent.Component };
        // 생성자
        constructor(props){
            super(props);
            if(AsyncComponent.Component) return;
            // 컴포넌트 할당
            getComponent().then(({default: Component}) => {
                AsyncComponent.Component = Component;
                // 내부적으로 컴포넌트 저장
                this.setState({Component});
            });
        }
        // 경로에 따라 요청받은 컴포넌트 호출
        render() {
            const {Component} = this.state;
            if(Component){
                return (<Component {...this.props} />);
            }
            return null;
        }
    };
}