import axios from "axios";
/* 계정 관련 API */
/* 로그인 요청 */
export const signIn = (id,password) => axios.post("/api/account/signin", {
    request:{
        id,
        password
    }
});
/* 회원가입 요청 */
export const signUp = (id,password,check,email) => axios.post("/api/account/signup", {
    request:{
        id, 
        password, 
        check, 
        email
    }
});

/* 서버에 세션이 존재하는지 확인 후 존재하면 로그인 성공 */
export const checkLogin = () => axios.get("/api/account/getinfo");

/* 로그아웃 요청 */
export const logout = (token) => axios.post("/api/account/logout", {
    request:{
        token
    }
});

/* 아이디 찾기 서버로 전송 */
export const findId = (email) => axios.post("/api/account/find/id", {
    request:{
        email
    }
});
/* 비밀번호 찾기 데이터 서버로 전송 */
export const findPw = (id, email) => axios.post("/api/account/find/pw",{
    request:{
        id,
        email
    }
});
/* 이메일 인증을 위한 데이터 요청 */
export const certified = (certified, token) => axios.post("/api/account/find/certified",{
    request:{
        token,
        certified
    }
});

/* 비밀번호 변경 요청 */
export const change = (password, check, token = "", current = "") => axios.post("/api/account/change",{
    request:{
        token,
        current,
        password,
        check
    }
});


/* select 페이지 관련 API */
/* 처음 페이지 요청 시 템플릿 요청 */
export const getView = (token) => axios.post("/api/view/template",{
    request:{
        token
    }
});
/* 사용자가 선택한 템플릿을 서버로 전송 (인공지능이 선택한 템플릿 요청) */
export const setTemplate = (token, templates) => axios.post("/api/view/set",{
    request:{
        token,
        templates
    }
});
/* 인공지능 서버에서 받아온 템플릿 중 한개의 템플릿을 노드 서버로 전송 */
export const setHTML = (token, template) => axios.post("/api/view/html",{
    request:{
        token,
        template
    }
});
/* 페이지에 맞는 템플릿 데이터 요청 */
export const update = (token, page) => axios.post("/api/view/update",{
    request:{
        token,
        page
    }
});

/* editor 페이지 관련 API */
/* editor 페이지 요청 시 select 페이지에서 선택한 html 요청 */
export const getEditor = (token) => axios.post("/api/view/editor",{
    request:{
        token
    }
});

/* editor 페이지 요청 시 버튼, 이미지 등 미리 만들어둔 css 요청 */
export const getPanel = (token) => axios.post("/api/view/panel",{
    request:{
        token
    }
});

/* 수정중인 템플릿 서버에 임시 저장 요청 */
export const save = (token, html, name, css) => axios.post("/api/view/save",{
    request:{
        token,
        html,
        name,
        css
    }
});
/* 편집이 끝나 서버에 압축, 저장 요청 */
export const endEdit = (token, html, name, css) => axios.post("/api/view/submit",{
    request:{
        token,
        html,
        name,
        css
    }
}).then((response) => {
    const {Response:res} = response.data;
    if(res.response.result){
        getZip(token);
    }
});
/* 작업 중간에 저장된 데이터 삭제 요청*/
export const deleteHtml = (token) => axios.post("/api/view/delete",{
    request:{
        token
    }
});
/* info 페이지 관련 API */
/* 차트를 그리기 위한 데이터 요청 */
export const getChart = (token) => axios.post("/api/view/chart",{
    request:{
        token
    }
});
/* 압축된 작업물 파일 요청 */
export const getZip = (token) => axios.get("/api/view/download",{
    params:{
        token
    },
    responseType: "blob",
}).then((response) => {
    // 압축 파일 데이터를 다운 받기위해 객체 생성
    const url = window.URL.createObjectURL(new Blob([response.data], { type:"application/zip" }));
    // 링크 생성
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "html.zip");
    // 현재 페이지에 링크 추가
    document.body.appendChild(link);
    // 링크 클릭으로 다운로드 실행
    link.click();
    // 해당 링크 제거
    document.body.removeChild(link);
});