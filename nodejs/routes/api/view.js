var express = require("express");
var bcrypt = require("bcryptjs");
var fs = require("fs");
var http = require("http");
var router = express.Router();

let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"});
let filenames = [];
let templates = [];
let srcs =[];
fs.readdirSync(__dirname + "/html/")
    .sort(collator.compare)
    .forEach(file => {
        if(/.html/g.test(file)){
            filenames.push(file);
            templates.push(fs.readFileSync(__dirname + `/html/${file}`,"utf-8"));
            srcs.push("img/src/"+file.replace(/.html/g, ".jpg"));
        }
    });
let count = 30;
let maxPage = Math.ceil(filenames.length/count);




const aiTemplate = (res, templates, token, callback) => {
    const name = templates.map((item, index)=>{
        return item.name;
    });
    const body = JSON.stringify({
        request:{
            token: token,
            name: name
        }
    });
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
    const req = http.request(options,function(aiRes) {
        /*
        console.log("STATUS: " + aiRes.statusCode);
        console.log("HEADERS: " + JSON.stringify(aiRes.headers));
        */
        // Buffer the body entirely for processing as a whole.
        var body = "";
        aiRes.on("data", function(chunk) {
            // You can process streamed parts here...
            body += chunk;
        }).on("end", function() {
            try{
                var json = JSON.parse(body);
                if(json.Response.response.result){
                    //  json.Response.response.templates 에서 파일명 추출 후 각각 파일 오픈 후 내용을 사용자에게 전송

                    const htmls = json.Response.response.templates.map((item, index)=>{
                        try {
                            return fs.readFileSync(__dirname + `/html/${item}`,"utf-8");
                        }
                        catch(err){
                            throw err;
                        }
                    });
                    const name = json.Response.response.templates.map((item, index)=>{
                        return item;
                    });
                    res.json({ 
                        Response:{
                            response:{
                                result: true,
                                templates:htmls,
                                name: name,
                                src:json.Response.response.images
                            }
                        }
                    });
                }
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
            // ...and/or process the entire body here.
        });
    });
    req.write(body);
    req.end();
};

const aiSubmit = (res, html, token, callback) => {
    const body = JSON.stringify({
        request:{
            token: token,
            html: html,
        }
    });
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
    const req = http.request(options,function(aiRes) {
        /*
        console.log("STATUS: " + aiRes.statusCode);
        console.log("HEADERS: " + JSON.stringify(aiRes.headers));
        */
        // Buffer the body entirely for processing as a whole.
        var body = "";
        aiRes.on("data", function(chunk) {
            // You can process streamed parts here...
            body += chunk;
        }).on("end", function() {
            try {
                var json = JSON.parse(body);
                console.log("BODY: " + json.Response.response.result);
                if(json.Response.response.result){
                    res.json({ 
                        Response:{
                            response:{
                                result: true
                            }
                        }
                    });
                    callback(html);
                }
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
            catch(e){
                console.log("완료 과정에서 에러 발생");
                res.json({ 
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
    
    req.write(body);
    req.end();
};

router.post("/template", function(req, res, next) {
    if(req.body.request.token === ""){
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    }
    let filename = filenames.slice(0,30);
    let src = srcs.slice(0,30);
    let template = templates.slice(0,30);
    req.session.page = 0;
    return res.json({ 
        Response:{
            response:{
                result: true,
                name: filename,
                templates:template,
                src:src
            }
        }
    }); 
});
router.post("/update", function(req, res, next) {
    if(req.body.request.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    req.session.page += 1;
    if(req.session.page >= maxPage){
        return res.status(401).json({ 
            Response:{
                response:{
                    result: true
                }
            }
        });
    }
    const page = req.session.page;

    let end = (page+1) * count;
    if(((page+1)* count) > filenames.length){
        end = filenames.length;
    }
    let filename = filenames.slice(page * count,end);
    let src = srcs.slice(page*count,end);
    let template = templates.slice(page*count,end);
    
    console.log(page,end, filenames.length, maxPage);
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
router.post("/set", async function(req, res, next) {
    if(req.body.request.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    const token = req.body.request.token;
    const templates = req.body.request.templates;
    let session = req.session;
    console.log(session.loginInfo.token === token);
    if(session.loginInfo.token === token){
        console.log("python");
        /* 인공지능 서버에 템플릿 요청 후 받아온 데이터를 클라이언트로 전송해야함 */
        await aiTemplate(res, templates, token, ()=>{
            
        });
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
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    const token = req.body.request.token;
    const template = req.body.request.template;
    let session = req.session;
    if(session.loginInfo.token === token){
        /* 사용자가 선택한 템플릿을 세션에 저장 */
        
        req.session.html = template;
        console.log(req.session.html );
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    
                }
            }
        });
        
    }
    return res.json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* Editor 페이지 요청 시 html 설정 작업*/
router.post("/editor", function(req, res, next) {
    console.log(req.body.request, "editor");
    if(req.body.request.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    console.log(req.body);
    const token = req.body.request.token;
    let session = req.session;
    /* 사용자가 최종적으로 선택한 템플릿을 클라이언트로 전달 */
    if(session.loginInfo.token === token && typeof session.html !== undefined){
        
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    template:session.html[0].body
                }
            }
        });
    }
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});

/* Editor 페이지 요청 시 버튼, 이미지 등 설정 작업*/
router.post("/panel", function(req, res, next) {
    console.log(req.body.request, "panel");
    if(req.body.request.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    const token = req.body.request.token;
    let session = req.session;
    if(session.loginInfo.token === token && typeof session.html !== undefined){
        /* 서버에서 버튼, 이미지 리스트를 클라이언트로 전송 */
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    button:[
                        "<a styles=''>test</a>",
                        
                    ],
                    image:[

                    ]
                }
            }
        });
    }
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
router.post("/save", function(req, res, next) {
    if(req.body.request.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    const token = req.body.request.token;
    const html = req.body.request.html;
    let session = req.session;
    if(session.loginInfo.token === token && typeof session.html !== undefined && typeof html !== undefined){
        /* 작업중인 html 임시 저장 */
        req.session.html.body = html;
        return res.json({ 
            Response:{
                response:{
                    result: true
                }
            }
        });
    }
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
router.post("/submit", async function(req, res, next) {
    if(req.body.request.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    const token = req.body.request.token;
    const html = req.body.request.html;
    let session = req.session;
    if(session.loginInfo.token === token && typeof session.html !== undefined && typeof html !== undefined){
        await aiSubmit(res, html, token, (html)=>{
            // 다운로드 코드 여기 실행
        });
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
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
router.post("/chart", function(req, res, next) {
    if(req.body.request.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    const token = req.body.request.token;
    let session = req.session;
    if(session.loginInfo.token === token){
        /* 인공지능 서버에서 차트정보 받아와야함 */
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
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
module.exports = router;