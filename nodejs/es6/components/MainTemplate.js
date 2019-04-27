import React, {Component} from "react";
import { Link } from "react-router-dom";
import Sign from "../containers/signUpApp";
import Footer from "../components/common/Footer";
import * as $ from "jquery";

/* 메인화면 UI 컴포넌트 */
class MainTemplate extends Component {
    // 로딩이 끝난 후 실행되는 함수
    componentDidMount() {
        // 메뉴바에 이벤트 설정
        $(document).ready(function() {

            var toggleAffix = function(affixElement, scrollElement, wrapper) {
            
                var height = affixElement.outerHeight(),
                    top = wrapper.offset().top;
                // 스크롤로 인한 현재화면 높이 체크
                if (scrollElement.scrollTop() >= 100){
                    // class 추가
                    wrapper.height(height);
                    affixElement.addClass("affix");
                    $(".navbar-nav>li>a").css("color","white");
                }
                else {
                    // class 제거
                    affixElement.removeClass("affix");
                    wrapper.height("auto");
                    $(".navbar-nav>li>a").css("color","#222222");
                }
                
            };
            
            
            $("#mainNav").each(function() {
                var ele = $(this),
                    wrapper = $("<div></div>");
              
                ele.before(wrapper);
                $(window).on("scroll resize", function() {
                    toggleAffix(ele, $(this), wrapper);
                });
              
                // init
                toggleAffix(ele, $(window), wrapper);
            });
            
        });
    }
    // 화면에 보여주기 위한 부분 설정
    render(){
        const {children,title,subtitle} = this.props;
        return (
            <div className="index">
                <nav id="mainNav" className="navbar navbar-default navbar-custom navbar-fixed-top" >
                    <div className="container">
                        <div className="navbar-header page-scroll">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                                <span className="sr-only">Toggle navigation</span> Menu <i className="fa fa-bars"></i>
                            </button>
                            <Link to="/" className="navbar-brand page-scroll">AWS</Link>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                <li className="hidden">
                                    <a href="#page-top"></a>
                                </li>
                                <li>
                                    <a className="page-scroll" href="#services">소개</a>
                                </li>
                                <li>
                                    <a className="page-scroll" href="#about">제작</a>
                                </li>
                                
                                <Sign/>
                            </ul>
                        </div>
                    </div>
                </nav>
                <header className="es6-components-css-agency__header">
                    <div className="container">
                        <div className="intro-text">
                            <div className="intro-lead-in">인공지능이 만드는</div>
                            <div className="intro-heading">나만의 홈페이지</div>
                            <Link to="/select" className="page-scroll btn btn-xl">시작하기</Link>
                        </div>
                    </div>
                </header>
                <section id="services" className="bg-light-gray">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading">서비스</h2>
                                <h3 className="section-subheading text-muted">AWS 서비스를 이용해 원하는 페이지를 제작해보세요.!</h3>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="col-md-4">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                    <i className="fa fa-brain fa-stack-1x fa-inverse"></i>
                                </span>
                                <h4 className="service-heading">인공지능과 함께<br/>나만의 홈페이지 만들기</h4>
                                <p className="text-muted">매력적인 템플릿과 디자인 요소를 선택하세요 나를 더 잘 아는 인공지능이 여러분의 홈페이지를 제작해드립니다.</p>
                            </div>
                            <div className="col-md-4">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                    <i className="fa fa-hand-point-up fa-stack-1x fa-inverse"></i>
                                </span>
                                <h4 className="service-heading">드래그 앤 드랍 방식으로<br/> 누구나 손쉽게</h4>
                                <p className="text-muted">AWS는 누구나 쉽고 간편하게 사용할 수 있는 홈페이지 제작 서비스입니다. 디자인 편집 도구를 사용해 원하는 홈페이지를 만들어보세요.</p>
                            </div>
                            <div className="col-md-4">
                                <span className="fa-stack fa-4x">
                                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                                    <i className="fab fa-internet-explorer fa-stack-1x fa-inverse"></i>
                                </span>
                                <h4 className="service-heading">인공지능이 파악한 <br/> 최신 최고의 브랜드 홈페이지</h4>
                                <p className="text-muted">나를 더 잘 아는 인공지능을 이용해 전문가의 도움 없이 여러분이 원하는 홈페이지를 디자인 할 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="about" className="way">
                    <div className="container">

                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <h2 className="section-heading">제작하는 방법</h2>
                                <h3 className="section-subheading text-muted">AWS를 이용해 간단하게 웹 페이지를 제작해보세요!</h3>
                            </div>
                        </div>
                        <div className="page">
                            <div className="row">
                                <div className="six columns article make-it-appear-right">
                                    <h3>시작하기</h3>
                                    <p>AWS 서비스를 이용하기 위해선 회원가입 후, 시작하기 버튼을 눌러 나오는 다양한 디자인 중 마음에 드는 홈페이지 디자인을 선택하세요!</p>                    
                                    <div className="space"></div>
                                    <a className="line-btn-l">회원가입</a> 
                                </div>
                                <div className="five columns picture make-it-appear-left" >
                                    <img src="img/select.png" alt="EXEMPLE"/>
                                </div>

                            </div>
                        </div>
                        <div className="page1">
                            <div className="row">
				                <div className="five columns picture make-it-appear-right" >
					                <img src="img/edit.png" alt="EXEMPLE"/>
				                </div>
				                <div className="six columns article make-it-appear-left">
					                <h3>편집하기</h3>
					                <p>저희가 제공해주는 버튼, 이미지 등을 드래그로 간단하게 추가하거나 직접 HTML 태그를 이용해 수정할 수 있습니다.</p>
                                    <div className="space"></div>
                                    <a className="line-btn-l">시작하기</a> 
				                </div>
			                </div>
                        </div>
                        <div className="page2">
                            <div className="row">
		
                                <div className="four columns article make-it-appear-right">
                                    <h3>제작 완료</h3>
                                    <p>홈페이지 제작이 완료되면 완료 버튼을 눌러 편집된 디자인을 다운받아 홈페이지를 게시하고 세상에 알려보세요.</p>                           
                                    <div className="space"></div>
                                </div>
                                <div className="five columns picture make-it-appear-left" >
                                    <img src="img/1.png" alt="EXEMPLE"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                
                <Footer/>

            </div>
        );
    }
}
export default MainTemplate;