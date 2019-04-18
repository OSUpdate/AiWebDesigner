var express = require("express");
var bcrypt = require("bcryptjs");
var fs = require("fs");
var http = require("http");
const phantom = require("phantom");
var ncp = require("ncp").ncp;
var archiver = require("archiver");
var router = express.Router();

let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"});
let filenames = [];
let templates = [];
let srcs =[];
const htmlToPng = (path, folder) => {
    if(!fs.existsSync(path)){
        (async function() {
            const instance = await phantom.create();
            const page = await instance.createPage();
        
            await page.on("onResourceRequested", function(requestData) {
                console.info("Requesting", requestData.url);
            });
       
            const status = await page.open(`file://${__dirname}/Templates/${folder}/index.html`);
            page.property("viewportSize", {width: 360, height: 270});
            page.property("clipRect", {top: 0, left: 0, width: 810, height: 480});
            const render = await page.render(path);
       
            await instance.exit();
        })();
    }
};
const userTemplate = (user) => {
    let temp = [];
    fs.readdirSync(`./user/${user}`)
        .sort(collator.compare)
        .forEach((folder,index) => {
            if(folder === ".DS_Store")
                return;
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
fs.readdirSync(__dirname + "/Templates/")
    .sort(collator.compare)
    .forEach(folder => {
        if(folder === ".DS_Store")
            return;
        filenames.push(`${folder}`);
        templates.push(fs.readFileSync(__dirname + `/Templates/${folder}/index.html`,"utf-8"));
        htmlToPng(`png/${folder}.png`, folder);
        srcs.push(`png/${folder}.png`);
    });
let count = 30;
let maxPage = Math.ceil(filenames.length/count);


const getTemplate = (res, name, select, token, callback) => {

    const body = JSON.stringify({
        request:{
            token: token,
            select: select
        }
    });
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
                console.log(json);
                if(json.Response.response.result){
                    //  json.Response.response.templates 에서 파일명 추출 후 각각 파일 오픈 후 내용을 사용자에게 전송
                    const user = userTemplate(name);
                    const recommend = json.Response.response.recommend.map((item, index) => {
                        return {
                            id: index,
                            checked: false,
                            name:filenames[parseInt(item)-1],
                            body: templates[parseInt(item)-1],
                            src:srcs[parseInt(item)-1],
                        };
                    });
                    const filename = filenames.slice(0,30);
                    const src = srcs.slice(0,30);
                    const template = templates.slice(0,30);
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
                    console.log(recommend);
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
    const token = req.body.request.token;
    console.log(token);
    if(req.session.isSave){
        return res.json({ 
            Response:{
                response:{
                    result: true,
                    continue: true,
                }
            }
        });
    }
    if(token === ""){
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    }
    getTemplate(res,req.session.loginInfo.id,null,token);
    req.session.page = 0;
    return res; 
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
    if(session.loginInfo.token === token){
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
        console.log(template);
        console.log(`${__dirname}/Templates/${template[0].name}`);
        ncp(`${__dirname}/Templates/${template[0].name}`, `./user/${req.session.loginInfo.id}/${template[0].name}`,function (err) {
            if (err) {
                return console.error(err);
            }
        });
        req.session.html = template;
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
    
    let css = [];
    if(session.isSave){
        try{
            if(fs.existsSync(`./user/${session.loginInfo.id}/${session.html[0].name}/css`)){
                fs.readdirSync(`./user/${session.loginInfo.id}/${session.html[0].name}/css`)
                    .forEach(file => {
                        if(/.css/g.test(file)){
                            const data = fs.readFileSync(`./user/${session.loginInfo.id}/${session.html[0].name}/css/${file}`,"utf-8");
                            //const result = data.replace(/[.]{2}/g, "");
                            const temp = {
                                name:`css/${file}`,
                                data:data
                            };
                            css.push(temp);
                        }
                    });
            }
            else{
                fs.readdirSync(`./user/${session.loginInfo.id}/${session.html[0].name}`)
                    .forEach(file => {
                        console.log(file);
                        if(/.css/g.test(file)){
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
        catch(err){
            console.log(err);
        }
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
    const  regex = new RegExp(`http://127.0.0.1:3001/templates/${session.html[0].name}/`);
    session.html[0].body = session.html[0].body.replace(regex, `http://127.0.0.1:3001///editor/${req.session.loginInfo.id}/${session.html[0].name}/`);
    /* 사용자가 최종적으로 선택한 템플릿을 클라이언트로 전달 */
    if(session.loginInfo.token === token && typeof session.html !== undefined){
        
        try{
            if(fs.existsSync(`${__dirname}/Templates/${session.html[0].name}/css`)){
                fs.readdirSync(`${__dirname}/Templates/${session.html[0].name}/css`)
                    .forEach(file => {
                        if(/.css/g.test(file)){
                            const data = fs.readFileSync(__dirname + `/Templates/${session.html[0].name}/css/${file}`,"utf-8");
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
            else{
                fs.readdirSync(`${__dirname}/Templates/${session.html[0].name}`)
                    .forEach(file => {
                        console.log(file);
                        if(/.css/g.test(file)){
                            console.log("test");
                            const data = fs.readFileSync(__dirname + `/Templates/${session.html[0].name}/${file}`,"utf-8");
                            //const result = data.replace(/url\(/g,`url(editor/${req.session.loginInfo.id}/${session.html[0].name}/`);
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
        catch(err){
            console.log(err);
        }
        console.log(css);
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
    return res.status(401).json({ 
        Response:{
            response:{
                result: false,
            }
        }
    });
    
});
/* 중간에 저장되어 있는 데이터를 삭제 */
router.post("/delete", function(req, res, next) {
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
        delete req.session.isSave;
        delete req.session.html;
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
    const name = req.body.request.name;
    let session = req.session;
    const cssList = req.body.request.css;
    if(session.loginInfo.token === token && typeof session.html !== undefined && typeof html !== undefined){
        /* 작업중인 html 임시 저장 */
        fs.writeFileSync(`./user/${session.loginInfo.id}/${name}/index.html`,html, function(err) {
            if(err) {
                return console.log(err);
            }
        });
        cssList.map((item, index)=>{
            if(/.css/g.test(item.name))
                item.data = item.data.replace(/url\([.]{1}/g,"url(..");

            fs.writeFileSync(`./user/${session.loginInfo.id}/${name}/${item.name}`,item.data, function(err){
                if(err) {
                    return console.log(err);
                }
            });
        });
        req.session.isSave = true;
        req.session.html[0].body = html;
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
    const session = req.session;
    const regex = new RegExp(`http://127.0.0.1:3001///editor/${session.loginInfo.id}/${session.html[0].name}/`);
    const token = req.body.request.token;
    const html = req.body.request.html.replace(regex, "");
    const name = req.body.request.name;
    
    const cssList = req.body.request.css;

    if(session.loginInfo.token === token && typeof session.html !== undefined && typeof html !== undefined){
        fs.writeFileSync(`./user/${req.session.loginInfo.id}/${name}/index.html`,html, function(err) {
            if(err) {
                return console.log(err);
            }
        });
        cssList.map((item, index)=>{
            if(/.css/g.test(item.name))
                item.data = item.data.replace(/url\([.]{1}/g,"url(..");

            fs.writeFileSync(`./user/${session.loginInfo.id}/${name}/${item.name}`,item.data, function(err){
                if(err) {
                    return console.log(err);
                }
            });
        });
        let output = fs.createWriteStream(`./user/${session.loginInfo.id}/html.zip`);
        let archive = archiver("zip", {
            zlib: { level: 9 } // Sets the compression level.
        });
        output.on("close", function() {
            console.log(archive.pointer() + " total bytes");
            console.log("archiver has been finalized and the output file descriptor has closed.");
        });
           
        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on("end", function() {
            console.log("Data has been drained");
        });
        archive.on("warning", function(err) {
            if (err.code === "ENOENT") {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });
           
        // good practice to catch this error explicitly
        archive.on("error", function(err) {
            throw err;
        });
           
        archive.pipe(output);
        archive.directory(`./user/${req.session.loginInfo.id}/${name}`, false);
        await archive.finalize();
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
router.get("/download", function(req, res, next) {
    if(req.query.token === "")
        return res.status(401).json({ 
            Response:{
                response:{
                    result: false,
                }
            }
        });
    const token = req.query.token;
    let session = req.session;
    if(req.session.isSave){
        delete req.session.isSave;
        delete req.session.html;
    }
    if(session.loginInfo.token === token){
        /* 인공지능 서버에서 차트정보 받아와야함 */
        res.download(`./user/${req.session.loginInfo.id}/html.zip`, "html.zip", function(err) {
            console.log(err);
        });
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
module.exports = router;