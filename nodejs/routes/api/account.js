var express = require("express");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var emailjs = require("emailjs");
const mysql = require("mysql2/promise");
//const conn = require("./db");
var router = express.Router();
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: ""
});
const server = emailjs.server.connect({
    user: "",
    password: "",
    host: "smtp.naver.com",
    port: 465,
    ssl: true
});

const validId = (id) => (/^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/.test(id));
const validPassword = (password) => (/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(password));
const validCheck = (password, check) => password === check;
const validEmail = (email) => (/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(email));
const valid = (req) => {
    console.log(req);
    return (validId(req.id) && validPassword(req.password) && validCheck(req.password, req.check) && validEmail(req.email)) ?
        true:false;
};
const certifiedCode = () => {
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    return code;

};
const changePw = async (res, req) =>{
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            if(req.session.loginInfo){
                const [rows] = await connection.query("select * from userinfo where id = ?", [req.session.loginInfo.id]);
                const shasum = crypto.createHash("sha256");
                shasum.update(req.body.request.current);
                const pw = shasum.digest("hex");
                if (pw !== rows[0].password) {
                    return res.status(401).json({
                        Response: {
                            response: {
                                result: false,
                                error: "잘못된 비밀번호 입니다"
                            }
                        }
                    });
                }
            }
            if(!validPassword(req.body.request.password) || !validCheck(req.body.request.password, req.body.request.check)){
                return res.status(401).json({
                    Response: {
                        response: {
                            result: false,
                            error: "비밀번호를 확인해주세요"
                        }
                    }
                });
            }
            const shasum2 = crypto.createHash("sha256");
            shasum2.update(req.body.request.password);
            const changed_pw = shasum2.digest("hex");
            try{
                if (!req.session.temp){
                    await connection.query("update userinfo set password = ? where id = ?", [changed_pw, req.session.loginInfo.id]);
                }
                else{
                    await connection.query("update userinfo set password = ? where id = ?", [changed_pw, req.session.temp.id]);
                }
            }
            catch(err){
                console.log(err);
                connection.release();
                return res.status(401).json({
                    Response: {
                        response: {
                            result: false
                        }
                    }
                });
            }
            connection.release();
            req.session.destroy(() => req.session);
            return res.json({
                Response: {
                    response: {
                        result: true
                    }
                }
            });
        } catch(err) {
            console.log("Query Error". err);
            connection.release();
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 아이디입니다."
                    }
                }
            });
        }
    } catch(err) {
        console.log("DB Error",err);
        return res.status(401).json({
            Response: {
                response: {
                    result: false,
                    error: "서버와 연결에 문제가 발생했습니다."
                }
            }
        });
    }
};
const signin = async (res, req) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query("select * from userinfo where id = ?", [req.body.request.id]);
            const token = bcrypt.hashSync(req.body.request.id + Date.now()).replace(/\//g,"");
            req.session.loginInfo = {
                token:token,
                id: req.body.request.id
            };
            connection.release();
            return res.json({
                Response: {
                    token: token,
                    response: {
                        result: true,
                        id: req.body.request.id
                    }
                }
            });
        } catch(err) {
            console.log("Query Error",err);
            connection.release();
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 아이디입니다."
                    }
                }
            });
        }
    } catch(err) {
        console.log("DB Error",err);
        return res.status(401).json({
            Response: {
                response: {
                    result: false,
                    error: "서버와 연결에 문제가 발생했습니다."
                }
            }
        });
    }
};
const findId = async (res, req) => {
    console.log(req.body.request.email);
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query("select * from userinfo where email = ?", [req.body.request.email]);
            const message = {
                text: "Your AWS ID is " + rows[0].id,
                from: "force185@naver.com",
                to: req.body.request.email,
                subject: "[aws] Your ID"
            };
            server.send(message, function (err, message) {
                console.log(err || message);
            });
            connection.release();
            return res.json({
                Response: {
                    response: {
                        result: true,
                    }
                }
            });
        } catch(err) {
            console.log("find id query Error", err);
            connection.release();
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 이메일입니다."
                    }
                }
            });
        }
    } catch(err) {
        console.log("DB Error");
        return res.status(401).json({
            Response: {
                response: {
                    result: false,
                    error: "서버와 연결에 문제가 발생했습니다."
                }
            }
        });
    }
};
const findPw = async (res, req) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query("select * from userinfo where id = ? and email = ?", [req.body.request.id, req.body.request.email]);
            const code = certifiedCode();
            const token = bcrypt.hashSync(req.body.request.id + Date.now());
            req.session.temp = {
                token: token,
                id: req.body.request.id,
                code: code
            };
            const message = {
                text: "code is = " + code,
                from: "force185@naver.com",
                to: req.body.request.email,
                subject: "[aws] Your Code"
            };
            server.send(message, function (err, message) {
                console.log(err || message);
            });
            //랜덤코드 비교할 프론트 필요
            connection.release();
            return res.json({
                Response: {
                    response: {
                        result: true,
                    }
                }
            });
        } catch(err) {
            console.log("Query Error");
            connection.release();
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 계정입니다."
                    }
                }
            });
        }
    } catch(err) {
        console.log("DB Error");
        return res.status(401).json({
            Response: {
                response: {
                    result: false,
                    error: "서버와 연결에 문제가 발생했습니다."
                }
            }
        });
    }
};
const signupDB = async (res, req) => {
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const [rows] = await connection.query("select * from userinfo where id = ? or email = ?", [req.body.request.id, req.body.request.email]);
            if(rows.length > 0){
                connection.release();
                res.status(401).json({
                    Response:{
                        response:{
                            result: false,
                            error: "이미 존재하는 계정입니다"
                        }
                    }
                });
                return res;
            }
            else{
                const shasum = crypto.createHash("sha256");
                shasum.update(req.body.request.password);
                const pw = shasum.digest("hex");
                await connection.query("insert into userinfo (id, password, email) values(?, ?, ?)", [req.body.request.id, pw, req.body.request.email]);
                connection.release();
                const token = bcrypt.hashSync(req.body.request.id + Date.now()).replace(/\//g, "");
                req.session.loginInfo = {
                    token: token,
                    id: req.id
                };
                return res.json({
                    Response:{
                        token: token,
                        response:{
                            result: true,
                            id: req.body.request.id
                        }
                    }
                });
                
            }
        } catch(err) {
            console.log("Query Error", err);
            connection.release();
            return res.status(401).json({
                Response:{
                    response:{
                        result: false,
                        error: "회원가입에 실패했습니다"
                    }
                }
            });
        }
    } catch(err) {
        console.log("DB Error", err);
        return res.status(401).json({
            Response:{
                response:{
                    result: false,
                    error: "회원가입에 실패했습니다"
                }
            }
        });
    }
};

/* 회원가입 */
router.post("/signup", function (req, res, next) {
    /* to be implemented */
    const value = valid(req.body.request);
    if(value){
        return signupDB(res, req);
    }
    return res.status(401).json({
        Response:{
            response:{
                result: false,
                error: "입력값을 확인해주세요"
            }
        }
    });
});

/* 로그인 */
router.post("/signin", async function (req, res, next) {
    /* db와 연동해 계정 확인 */
    return signin(res, req);
    

});

/* 사용자 로그인 체크 */
router.get("/getinfo", function (req, res, next) {
    if (typeof req.session.loginInfo === "undefined") {
        return res.status(401).json({
            Response: {
                response: {
                    result: false,
                    error: 0
                }
            }
        });
    }

    return res.json({
        Response: {
            response: {
                result: true,
                id: req.session.loginInfo.id,
                token: req.session.loginInfo.token
            }
        }
    });
});
/* 로그아웃 */
router.post("/logout", function (req, res, next) {
    req.session.destroy(()=> {
        return req.session;
    });
    return res.json({
        Response: {
            response: {
                result: true,
            }
        }
    });
});
/* 비밀번호 찾기 */
router.post("/find/pw", function (req, res, next) {
    return findPw(res, req);
});

router.post("/find/certified", function (req, res, next) {
    const certified = req.body.request.certified;
    const code = req.session.temp.code.toUpperCase();
    /* 이메일 인증코드 비교 */
    if(certified !== code){
        return res.status(401).json({
            Response: {
                response: {
                    result: false,
                    error:"잘못된 코드입니다"
                }
            }
        });
    }
    return res.json({
        Response: {
            response: {
                result: true
            }
        }
    });
});
/* 아이디 찾기 */
router.post("/find/id", function (req, res, next) {
    /* 이메일로 계정 검색 */
    return findId(res, req);
});
/* 비밀번호 찾기 성공시 변경 */
/* 현재 비밀번호 current가 비어있을 수 있음(현재 비밀번호를 모르는 경우) */
router.post("/change", function (req, res, next) {
    return changePw(res, req);
});

module.exports = router;
