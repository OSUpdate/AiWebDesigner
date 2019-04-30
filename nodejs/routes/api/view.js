var express = require("express");
var bcrypt = require("bcryptjs");
var fs = require("fs");
var http = require("http");
const phantom = require("phantom");
var ncp = require("ncp").ncp;
var archiver = require("archiver");
var router = express.Router();
const btnReadline = require("readline").createInterface({
    input: require("fs").createReadStream(__dirname+"/a.html")
});
const imgReadline = require("readline").createInterface({
    input: require("fs").createReadStream(__dirname+"/img.html")
});
// 문자로된 숫자를 정렬하기 위한 컬렉터
let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"});
// 파일 이름들을 저장하기 위한 리스트
let filenames = [];
// 템플릿 데이터를 저장하기 위한 리스트
let templates = [];
// 템플릿 이미지 경로를 저장하기 위한 리스트
let srcs =[];
let btn = [];
let images = [];
// 버튼들을 읽어옴
btnReadline.on("line", function (line) {
    btn.push(line);
});
// 이미지들을 읽어옴
imgReadline.on("line", function (line) {
    images.push(line);
});
// html을 png로 바꿔주는 함수
const htmlToPng = (path, folder) => {
    // 템플릿명과 동일한 이미지가 존재하면 실행하지 않음
    if(!fs.existsSync(path)){
        // phantomJs을 사용한 html을 이미지로 변환 함수
        (async function() {
            const instance = await phantom.create();
            const page = await instance.createPage();
        
            await page.on("onResourceRequested", function(requestData) {
                console.info("Requesting", requestData.url);
            });
            // html 파일 경로 설정
            const status = await page.open(`file://${__dirname}/Templates/${folder}/index.html`);
            // html 페이지 크기 설정
            page.property("viewportSize", {width: 960, height: 270});
            // 잘라낼 크기 설정
            page.property("clipRect", {top: 0, left: 0, width: 960, height: 480});
            // html을 png 이미지로 변경
            const render = await page.render(path);
       
            await instance.exit();
        })();
    }
};
// 사용자가 작업한 템플릿들 전부 읽는 함수
const userTemplate = (user) => {
    let temp = [];
    fs.readdirSync(`./user/${user}`)
        // 문자로된 숫자를 정렬
        .sort(collator.compare)
        // 템플릿 폴더명으로 이미지 경로, 템플릿 데이터, 파일 이름을 읽어들이고 리스트에 저장
        .forEach((folder,index) => {
            if(folder === ".DS_Store")
                return;
            // 읽어들인 폴더가 템플릿 파일이 아니면 건너뜀
            if(!fs.lstatSync(`./user/${user}/${folder}`).isDirectory())
                return;
            temp.push({
                id: index,
                checked: false,
                name:filenames[parseInt(folder)-1],
                body: templates[parseInt(folder)-1],
                src:srcs[parseInt(folder)-1]
            });
        });
    return temp;
};
/*
fs.readdirSync(__dirname + "/html/")
    .sort(collator.compare)
    .forEach(file => {
        if(/.html/g.test(file)){
            filenames.push(file);
            templates.push(fs.readFileSync(__dirname + `/html/${file}`,"utf-8"));
            srcs.push("img/src/"+file.replace(/.html/g, ".jpg"));
        }
    });
*/
// 서버 실행시 템플릿 정보를 전부 읽어들임
fs.readdirSync(__dirname + "/Templates/")
    // 이름순서로 정렬
    .sort(collator.compare)
    // 템플릿 폴더명으로 이미지 경로, 템플릿 데이터, 파일 이름을 읽어들이고 리스트에 저장
    .forEach(folder => {
        if(folder === ".DS_Store")
            return;
        filenames.push(`${folder}`);
        templates.push(fs.readFileSync(__dirname + `/Templates/${folder}/index.html`,"utf-8"));
        htmlToPng(`png/${folder}.png`, folder);
        srcs.push(`png/${folder}.png`);
    });
// 페이징을 위한 데이터
let count = 30;
let maxPage = Math.ceil(filenames.length/count);

/* 인공지능 서버에 템플릿 요청 함수 */
const getTemplate = (res, name, select, token, callback) => {
    // 파이썬 서버에 전송할 데이터
    const body = JSON.stringify({
        request:{
            token: token,
            user: name,
            select: select
        }
    });
    // 파이썬 서버와 연결 설정 옵션
    const options = {
        host: "127.0.0.1",
        path: `/api/get/${token}`,
        method: "POST",
        port:"4000",
        headers:{
            "Content-Type": "application/json",
            "Content-Length": body.length
        }
    };
    // 데이터를 받는 도중, 다 받은 후 처리 함수
    const req = http.request(options,function(aiRes) {
        /*
        console.log("STATUS: " + aiRes.statusCode);
        console.log("HEADERS: " + JSON.stringify(aiRes.headers));
        */
        // 통신 데이터 저장 변수
        let body = "";
        //데이터를 받는 도중에 실행되는 함수
        aiRes.on("data", function(chunk) {
            body += chunk;
        // 데이터를 다 받은 후 실행되는 함수
        }).on("end", function() {
            try{
                var json = JSON.parse(body);
                console.log(json);
                if(json.Response.response.result){
                    // 사용자가 작업한 템플릿들을 읽어옴
                    const user = userTemplate(name);
                    // 파이썬 서버에서 받아온 추천 템플릿 리스트로 화면에 보여주기 위한 리스트 생성
                    const recommend = json.Response.response.recommend.map((item, index) => {
                        return {
                            id: index,
                            checked: false,
                            name:filenames[parseInt(item)-1],
                            body: templates[parseInt(item)-1],
                            src:srcs[parseInt(item)-1],
                        };
                    });
                    // 페이징 처리를 위해 파일 이름, 이미지 경로, 템플릿 내용을 30개씩만 보여줌 첫 페이징
                    const filename = filenames.slice(0,30);
                    const src = srcs.slice(0,30);
                    const template = templates.slice(0,30);
                    // 작업한 데이터를 전송하기 위해 설정
                    res.json({ 
                        Response:{
                            response:{
                                result: true,
                                templates:template,
                                name: filename,
                                recommend:recommend,
                                src:src,
                                user:user
                            }
                        }
                    });
                }
                else{
                    // 파이썬 서버에서 받아온 값이 정상적인 값이 아닌 경우 처리
                    res.status(401).json({ 
                        Response:{
                            response:{
                                result: false
                            }
                        }
                    });
                }
            }
            // 파일 읽기에서 에러가 발생한 경우 처리
            catch(err){
                if(err.code === "ENOENT"){
                    console.log("파일이 존재하지않습니다.");
                    
                }
                res.status(401).json({ 
                    Response:{
                        response:{
                            result: false
                        }
                    }
                });
            }
        });
    });
    // post 방식으로 body에 데이터를 씀
    req.write(body);
    // 전송
    req.end();
};
/* 인공지능 서버에 사용자 선택 템플릿으로 추천 요청 함수 */
const aiTemplate = (res, templates, token, user,callback) => {
    // 사용자가 선택한 템플릿의 이름정보만 저장
    const name = templates.map((item, index)=>{
        return item.name;
    });
    // 파이썬 서버에 전송할 데이터
    const body = JSON.stringify({
        request:{
            token: token,
            user: user,
            name: name
        }
    });
    // 파이썬 서버와 연결 설정 옵션
    const options = {
        host: "127.0.0.1",
        path: `/api/templates/${token}`,
        method: "POST",
        port:"4000",
        headers:{
            "Content-Type": "application/json",
            "Content-Length": body.length
        }
    };
    // 데이터를 받는 도중, 다 받은 후 처리 함수
    const req = http.request(options,function(aiRes) {
        /*
        console.log("STATUS: " + aiRes.statusCode);
        console.log("HEADERS: " + JSON.stringify(aiRes.headers));
        */
        // 통신 데이터 저장 변수
        let body = "";
        //데이터를 받는 도중에 실행되는 함수
        aiRes.on("data", function(chunk) {
            // You can process streamed parts here...
            body += chunk;
        // 데이터를 다 받은 후 실행되는 함수
        }).on("end", function() {
            try{
                var json = JSON.parse(body);
                if(json.Response.response.result){
                    //  json.Response.response.templates 에서 파일명 추출 후 각각 파일 오픈 후 내용을 사용자에게 전송
                    let name = [];
                    const htmls = json.Response.response.templates.map((item, index)=>{
                        try {
                            name.push(item);
                            return fs.readFileSync(`${__dirname}/Templates/${item}/index.html`,"utf-8");
                        }
                        catch(err){
                            throw err;
                        }
                    });
                    const recommend = json.Response.response.recommend;
                    // 사용자에게 전송 데이터 설정
                    res.json({ 
                        Response:{
                            response:{
                                result: true,
                                templates:htmls,
                                name: name,
                                recommend:recommend,
                                src:json.Response.response.images
                            }
                        }
                    });
                }
                // 파이썬 서버에서 받아온 값이 정상적인 값이 아닌 경우 처리
                else{
                    res.status(401).json({ 
                        Response:{
                            response:{
                                result: false
                            }
                        }
                    });
                }
            }
            // 파일 읽기에서 에러가 발생한 경우 처리
            catch(err){
                console.log(err);
                if(err.code === "ENOENT"){
                    console.log("파일이 존재하지않습니다.");
                    
                }
                res.status(401).json({ 
                    Response:{
                        response:{
                            result: false
                        }
                    }
                });
            }
            // ...and/or process the entire body here.
        });
    });
    // post 방식으로 body에 데이터를 씀
    req.write(body);
    // 전송
    req.end();
};
// 편집이 완료된 경우 파이썬 서버와 통신하기 위한 함수
const aiSubmit = (res, html, token, callback) => {
    // 파이썬 서버에 전송할 데이터
    const body = JSON.stringify({
        request:{
            token: token,
            html: html,
        }
    });
    // 파이썬 서버에 전송할 데이터
    const options = {
        host: "127.0.0.1",
        path: `/api/save/${token}`,
        method: "POST",
        port:"4000",
        header:{
            "Content-Type": "application/json",
            "Content-Length": body.length
        }
    };
    // 데이터를 받는 도중, 다 받은 후 처리 함수
    const req = http.request(options,function(aiRes) {
        /*
        console.log("STATUS: " + aiRes.statusCode);
        console.log("HEADERS: " + JSON.stringify(aiRes.headers));
        */
        // 통신 데이터 저장 변수
        let body = "";
        //데이터를 받는 도중에 실행되는 함수
        aiRes.on("data", function(chunk) {
            // You can process streamed parts here...
            body += chunk;
        // 데이터를 다 받은 후 실행되는 함수
        }).on("end", function() {
            try {
                var json = JSON.parse(body);
                // 통신이 정상적으로 종료되면 사용자에게 전송
                if(json.Response.response.result){
                    res.json({ 
                        Response:{
                            response:{
                                result: true
                            }
                        }
                    });
                    // 인자로 전달받은 콜백함수 실행
                    callback(html);
                }
                else{
                    // 파이썬 서버에서 받아온 값이 정상적인 값이 아닌 경우 처리
                    res.status(401).json({ 
                        Response:{
                            response:{
                                result: false
                            }
                        }
                    });
                }
            }
            // 통신에 문제가 생긴 경우 처리
            catch(e){
                console.log("완료 과정에서 에러 발생");
                res.status(401).json({ 
                    Response:{
                        response:{
                            result: false
                        }
                    }
                });
            }
        });
    });
    // post 방식으로 body에 데이터를 씀
    req.write(body);
    // 전송
    req.end();
};
// /api/view/template 주소로 요청이 오는 경우 처리 라우터
router.post("/template", function(req, res, next) {
    // 로그인 정보
    const token = req.body.request.token;
    // 이전에 저장한 작업물이 있는 지 체크
    if(req.session.isSave){
        // 있을 경우 메시지를 띄우기 위한 설정 전송
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    continue: true,
                }
            }
        });
    }
    // 로그인 체크
    if(token === ""){
        // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    }
    // 파이썬 서버에서 템플릿을 받아오는 함수 호출
    getTemplate(res,req.session.loginInfo.id,null,token);
    // 페이징 처리
    req.session.page = 0;
    // 사용자에게 처리 데이터 전송
    return res; 
});
/* 모든 템플릿 페이징 작업 */
// /api/view/update 주소로 요청이 오는 경우 처리 라우터
router.post("/update", function(req, res, next) {
    // 로그인 체크
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 페이징 처리
    req.session.page += 1;
    // 페이징 에러 처리
    if(req.session.page >= maxPage){
        return res.status(401).json({ 
            Response:{
                response:{
                    result: true
                }
            }
        });
    }
    // 현재 사용자 페이지 번호
    const page = req.session.page;
    // 읽어와야할 마지막 데이터 번호
    let end = (page+1) * count;
    if(((page+1)* count) > filenames.length){
        end = filenames.length;
    }
    // 페이지에 맞는 파일이름, 이미지 경로, 템플릿 데이터를 가져옴
    const filename = filenames.slice(page * count,end);
    const src = srcs.slice(page*count,end);
    const template = templates.slice(page*count,end);
    // 사용자에게 전송
    res.json({ 
        Response:{
            response:{
                page:page,
                result: true,
                name: filename,
                templates:template,
                src:src
            }
        }
    });
    
});
/* 사용자가 선택한 템플릿을 통해 템플릿을 받아옴 */
// /api/view/set 주소로 요청이 오는 경우 처리 라우터
router.post("/set", async function(req, res, next) {
    // 로그인 체크
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사용자가 전송한 토큰, 선택한 템플릿들을 받아옴
    const token = req.body.request.token;
    const templates = req.body.request.templates;
    let session = req.session;
    if(session.loginInfo.token === token){
        /* 인공지능 서버에 템플릿 요청 후 받아온 데이터를 클라이언트로 전송해야함 */
        await aiTemplate(res, templates, token, session.loginInfo.id,()=>{
            
        });
        // 사용자에게 전송
        return res;
        /*
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    templates:[
                        "<html><body><div><h1>test4</h1></div></body></html>",
                        "<html><body><div><h1>test5</h1></div></body></html>"
                    ],
                    src:[
                        "escape.jpg",
                        "escape.jpg"
                    ]
                }
            }
        });
        */
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
router.post("/html", function(req, res, next) {
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사용자가 전송한 토큰, 템플릿 데이터 저장
    const token = req.body.request.token;
    const template = req.body.request.template;
    let session = req.session;
    if(session.loginInfo.token === token){
        /* 사용자가 선택한 템플릿을 세션에 저장 */
        // 사용자가 선택한 템플릿을 사용자 디렉토리에 저장
        ncp(`${__dirname}/Templates/${template[0].name}`, `./user/${req.session.loginInfo.id}/${template[0].name}`,function (err) {
            if (err) {
                return console.error(err);
            }
        });
        // 세션에 작업한 템플릿을 저장함
        req.session.html = template;
        // 사용자에게 전송
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    
                }
            }
        });
        
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* Editor 페이지 요청 시 html 설정 작업*/
// /api/view/editor 주소로 요청이 오는 경우 처리 라우터
router.post("/editor", function(req, res, next) {
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사용자가 전송한 토큰 저장
    const token = req.body.request.token;
    let session = req.session;
    
    let css = [];
    // 세션에 이전에 작업한 데이터가 있는지 확인
    if(session.isSave){
        try{
            // 사용자 디렉토리에서 이전에 작업한 탬플릿 css를 읽어옴 (css 폴더가 존재할 경우)
            if(fs.existsSync(`./user/${session.loginInfo.id}/${session.html[0].name}/css`)){
                // css 폴더가 존재하면 폴더내 파일들을 읽어옴
                fs.readdirSync(`./user/${session.loginInfo.id}/${session.html[0].name}/css`)
                    .forEach(file => {
                        // 정규식을 통해 css 파일 체크
                        if(/.css/g.test(file)){
                            // css 파일 읽어들임
                            const data = fs.readFileSync(`./user/${session.loginInfo.id}/${session.html[0].name}/css/${file}`,"utf-8");
                            const temp = {
                                name:`css/${file}`,
                                data:data
                            };
                            css.push(temp);
                        }
                    });
            }
            // 사용자 디렉토리에서 이전에 작업한 탬플릿 css를 읽어옴 (css 폴더가 없을 경우)
            else{
                // css 폴더가 없을 경우 css 파일을 찾음
                fs.readdirSync(`./user/${session.loginInfo.id}/${session.html[0].name}`)
                    .forEach(file => {
                        console.log(file);
                        // 정규식을 통해 css 파일 체크
                        if(/.css/g.test(file)){
                            // css 파일 읽어들임
                            const data = fs.readFileSync( `./user/${session.loginInfo.id}/${session.html[0].name}/${file}`,"utf-8");
                            const temp = {
                                name:file,
                                data:data
                            };
                            css.push(temp);
                            console.log(css);
                        }
                    });
            }
        }
        // 폴더 읽어들이는 과정에서 에러 발생시 처리
        catch(err){
            console.log(err);
        }
        // 사용자에게 전송
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    template:session.html[0].body,
                    name:session.html[0].name,
                    css:css,
                }
            }
        });
    }
    // 정규식 생성
    const  regex = new RegExp(`http://127.0.0.1:3001/templates/${session.html[0].name}/`);
    // 사용자가 선택한 html 데이터를 세션에서 꺼낸 후 정규식을 통해 변경
    session.html[0].body = session.html[0].body.replace(regex, `http://127.0.0.1:3001///editor/${req.session.loginInfo.id}/${session.html[0].name}/`);
    /* 사용자가 최종적으로 선택한 템플릿을 클라이언트로 전달 */
    if(session.loginInfo.token === token && typeof session.html !== undefined){
        
        try{
            // 사용자 디렉토리에서 이전에 작업한 탬플릿 css를 읽어옴 (css 폴더가 존재할 경우)
            if(fs.existsSync(`${__dirname}/Templates/${session.html[0].name}/css`)){
                // css 폴더가 존재하면 폴더내 파일들을 읽어옴
                fs.readdirSync(`${__dirname}/Templates/${session.html[0].name}/css`)
                    .forEach(file => {
                        // 정규식을 통해 css 파일 체크
                        if(/.css/g.test(file)){
                            // css 파일 읽어들임
                            const data = fs.readFileSync(__dirname + `/Templates/${session.html[0].name}/css/${file}`,"utf-8");
                            // 경로 문제를 해결하기 위해 css내 이미지 데이터 경로 수정
                            const result = data.replace(/url\([.]{2}/g, "url(.");
                            //const result1 = result.replace(/url\(/g,`url(editor/${req.session.loginInfo.id}/${session.html[0].name}`);
                            const temp = {
                                name:`css/${file}`,
                                data:result
                            };
                            css.push(temp);
                        }
                    });
            }
            // 사용자 디렉토리에서 이전에 작업한 탬플릿 css를 읽어옴 (css 폴더가 없을 경우)
            else{
                // css 폴더가 없을 경우 css 파일을 찾음
                fs.readdirSync(`${__dirname}/Templates/${session.html[0].name}`)
                    .forEach(file => {
                        console.log(file);
                        // 정규식을 통해 css 파일 체크
                        if(/.css/g.test(file)){
                            // css 파일 읽어들임
                            const data = fs.readFileSync(__dirname + `/Templates/${session.html[0].name}/${file}`,"utf-8");
                            //const result = data.replace(/url\(/g,`url(editor/${req.session.loginInfo.id}/${session.html[0].name}/`);
                            const temp = {
                                name:file,
                                data:data
                            };
                            css.push(temp);
                        }
                    });
            }
        }
        // 폴더 읽어들이는 과정에서 에러 발생시 처리
        catch(err){
            console.log(err);
        }
        // 사용자에게 전송
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    template:session.html[0].body,
                    name:session.html[0].name,
                    css:css,
                }
            }
        });
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* 사용자가 작업 도중 저장한 데이터를 삭제 */
// /api/view/delete 주소로 요청이 오는 경우 처리 라우터
router.post("/delete", function(req, res, next) {
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사용자가 전송한 토큰 저장
    const token = req.body.request.token;
    let session = req.session;
    // 세션에 저장된 토큰과 사용자가 전송한 토큰이 동일할 경우
    if(session.loginInfo.token === token){
        // 세션에 저장되어있는 세이브 여부 false
        delete req.session.isSave;
        // 세션에 저장된 템플릿 html 삭제 
        delete req.session.html;
        // 사용자에게 전송
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    
                }
            }
        });
        
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* Editor 페이지 요청 시 버튼, 이미지 등 설정 작업*/
// /api/view/panel 주소로 요청이 오는 경우 처리 라우터
router.post("/panel", function(req, res, next) {
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사용자가 전송한 토큰 저장
    const token = req.body.request.token;
    let session = req.session;
    // 세션에 저장된 토큰과 사용자가 전송한 토큰이 동일할 경우
    if(session.loginInfo.token === token && typeof session.html !== undefined){
        /* 서버에서 버튼, 이미지 리스트를 클라이언트로 전송 */
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    button:btn,
                    image:images
                }
            }
        });
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* 데이터 저장 요청시 처리 작업*/
// /api/view/save 주소로 요청이 오는 경우 처리 라우터
router.post("/save", function(req, res, next) {
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사영지기 잔송한 토큰, html, css 데이터들, 템플릿 폴더명 저장
    const token = req.body.request.token;
    const html = req.body.request.html;
    const name = req.body.request.name;
    let session = req.session;
    const cssList = req.body.request.css;

    if(session.loginInfo.token === token && typeof session.html !== undefined && typeof html !== undefined){
        /* 작업중인 html 저장 */
        fs.writeFileSync(`./user/${session.loginInfo.id}/${name}/index.html`,html, function(err) {
            if(err) {
                return console.log(err);
            }
        });
        // 작업 중인 css 저장
        cssList.map((item, index)=>{
            // css 파일이 맞는지 체크
            if(/.css/g.test(item.name))
                // 경로 문제 해결을 위해 바꾼 이미지 경로를 원래 경로로 수정
                item.data = item.data.replace(/url\([.]{1}/g,"url(..");
            // 사용자 폴더에 결과물 저장
            fs.writeFileSync(`./user/${session.loginInfo.id}/${name}/${item.name}`,item.data, function(err){
                if(err) {
                    return console.log(err);
                }
            });
        });
        // 세이브 여부 true
        req.session.isSave = true;
        // 세션에 최종 작업 html 저장
        req.session.html[0].body = html;
        // 사용자에게 전송
        return res.json({ 
            Response:{
                response:{
                    result: true
                }
            }
        });
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* 템플릿 편집 완료시 처리 작업 */
// /api/view/submit 주소로 요청이 오는 경우 처리 라우터
router.post("/submit", async function(req, res, next) {
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 요청 보낸 사용자의 세션 정보 가져옴
    const session = req.session;
    // 정규식 생성
    const regex = new RegExp(`http://127.0.0.1:3001///editor/${session.loginInfo.id}/${session.html[0].name}/`);
    // 사용자가 전송한 토큰, html 데이터, css 데이터, 폴더명 저장
    const token = req.body.request.token;
    const html = req.body.request.html.replace(regex, "");
    const name = req.body.request.name;
    
    const cssList = req.body.request.css;

    if(session.loginInfo.token === token && typeof session.html !== undefined && typeof html !== undefined){
        // 작업중인 html 저장
        fs.writeFileSync(`./user/${req.session.loginInfo.id}/${name}/index.html`,html, function(err) {
            if(err) {
                return console.log(err);
            }
        });
        // 작업중인 css 저장
        cssList.map((item, index)=>{
            // css 파일이 맞는지 체크
            if(/.css/g.test(item.name))
                // 경로 문제 해결을 위해 바꾼 이미지 경로를 원래 경로로 수정
                item.data = item.data.replace(/url\([.]{1}/g,"url(..");
            // 사용자 폴더에 결과물 저장
            fs.writeFileSync(`./user/${session.loginInfo.id}/${name}/${item.name}`,item.data, function(err){
                if(err) {
                    return console.log(err);
                }
            });
        });
        // 사용자가 작업한 폴더 압축, 저장을 위한 객체 생성
        let output = fs.createWriteStream(`./user/${session.loginInfo.id}/html.zip`);
        let archive = archiver("zip", {
            zlib: { level: 9 } // Sets the compression level.
        });
        // 파일 디스크립터가 닫힌 후 콜백 함수
        output.on("close", function() {
            console.log(archive.pointer() + " total bytes");
            console.log("archiver has been finalized and the output file descriptor has closed.");
        });
        // 압축이 끝난후 콜백 함수
        output.on("end", function() {
            console.log("Data has been drained");
        });
        // 압축 도중 경고 발생 시 콜백 함수
        archive.on("warning", function(err) {
            if (err.code === "ENOENT") {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });
           
        // 압축 도중 에러 발생 시 콜백 함수
        archive.on("error", function(err) {
            throw err;
        });
        // 압축 파일 저장을 위한 경로 설정
        archive.pipe(output);
        archive.directory(`./user/${req.session.loginInfo.id}/${name}`, false);
        // 압축 실행
        await archive.finalize();
        // 사용자에게 전송
        res.json({ 
            Response:{
                response:{
                    result: true,
                }
            }
        });
        //await aiSubmit(res, html, token, (html)=>{
        // 다운로드 코드 여기 실행
        //});
        /* html 파일 다운로드 */
        /*
            let filename = 'myFile.ext';
            let absPath = path.join(__dirname, '/my_files/', filename);
            let relPath = path.join('./my_files', filename); // path relative to server root

            fs.writeFile(relPath, 'File content', (err) => {
                if (err) {
                    console.log(err);
                }
                res.download(absPath, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('FILE [' + filename + '] REMOVED!');
                });
            });
        */
        //req.session.htmldestroy(err => { if(err) throw err; });
        return res;
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* 인공지능 데이터를 기반으로 그래프를 그려주기 위한 작업 */
// /api/view/chart 주소로 요청이 오는 경우 처리 라우터
router.post("/chart", function(req, res, next) {
    if(req.body.request.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사용자가 전송한 토큰 저장
    const token = req.body.request.token;
    let session = req.session;
    if(session.loginInfo.token === token){
        /* 인공지능 서버에서 차트정보 받아와야함 */
        // 그래프를 그리기 위한 정보 전송
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    charts:{
                        labels:["January", "February", "March", "April", "May", "June", "July"],
                        datasets: [
                            {
                                label: "My First dataset",
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: "rgba(75,192,192,0.4)",
                                borderColor: "rgba(75,192,192,1)",
                                borderCapStyle: "butt",
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: "miter",
                                pointBorderColor: "rgba(75,192,192,1)",
                                pointBackgroundColor: "#fff",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                                pointHoverBorderColor: "rgba(220,220,220,1)",
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: [65, 59, 80, 81, 56, 55, 40]
                            }
                        ]
                        
                    }
                }
            }
        });
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* 템플릿 편집 완료 후 다운로드 요청 처리 */
// /api/view/download 주소로 요청이 오는 경우 처리 라우터
router.get("/download", function(req, res, next) {
    if(req.query.token === "")
    // 로그인이 안되어 있을 경우 에러 전송
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    // 사용자가 전송한 토큰 정보 저장
    const token = req.query.token;
    let session = req.session;
    // 다운로드 시 세션에서 기존 작업 데이터 삭제
    if(req.session.isSave){
        delete req.session.isSave;
        delete req.session.html;
    }
    if(session.loginInfo.token === token){
        // 압축 파일 데이터 사용자에게 전송
        res.download(`./user/${req.session.loginInfo.id}/html.zip`, "html.zip", function(err) {
            console.log(err);
        });
        return res;
    }
    // 서버에 저장된 토큰과 사용자가 전송한 토큰이 다를 경우 에러 전송
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
module.exports = router;
