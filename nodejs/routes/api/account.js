var express = require("express");
var bcrypt = require("bcryptjs");
var crypto = require("crypto");
var emailjs = require("emailjs");
var fs = require("fs");
const mysql = require("mysql2/promise");
//const conn = require("./db");
var router = express.Router();
// mysql 연결 설정
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "aws"
});
// 이메일 인증시 이메일 보내는 계정
const server = emailjs.server.connect({
    user: "force185@naver.com",
    password: "",
    host: "smtp.naver.com",
    port: 465,
    ssl: true
});
// 계정 생성시 사용자 폴더 생성
const newFolder = (id) =>{
    fs.mkdir(`./user/${id}`,0755,function(err){
        if(err) throw err;
    })
};
// 정규식을 통한 id 값 검증 함수
const validId = (id) => (/^(?=.*[a-zA-Z])(?=.*\d).{6,10}$/.test(id));
// 정규식을 통한 password 값 검증 함수
const validPassword = (password) => (/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{6,20}$/.test(password));
// 정규식을 통한 password check 값 검증 함수
const validCheck = (password, check) => password === check;
// 정규식을 통한 email 값 검증 함수
const validEmail = (email) => (/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/.test(email));
// 정규식 검증 함수
const valid = (req) => {
    console.log(req);
    return (validId(req.id) && validPassword(req.password) && validCheck(req.password, req.check) && validEmail(req.email)) ?
        true:false;
};
// 이메일 인증 코드 생성 함수
const certifiedCode = () => {
    var code = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++)
        code += possible.charAt(Math.floor(Math.random() * possible.length));
    return code;

};
// 비밀번호 변경 처리 함수
const changePw = async (res, req) =>{
    try {
        // mysql 연결
        const connection = await pool.getConnection(async conn => conn);
        try {
            // 로그인 데이터가 존재할 경우
            if(req.session.loginInfo){
                // id를 이용해 db 조회
                const [rows] = await connection.query("select * from userinfo where id = ?", [req.session.loginInfo.id]);
                // 현재 비밀번호가 맞는지 암호화시켜 값 비교
                const shasum = crypto.createHash("sha256");
                shasum.update(req.body.request.current);
                const pw = shasum.digest("hex");
                // 암호화된 값이 다를 
                if (pw !== rows[0].password) {
                    // 변경 실패
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
            // 변경할 값의 유효성이 안맞는 경우
            if(!validPassword(req.body.request.password) || !validCheck(req.body.request.password, req.body.request.check)){
                // 변경 실패
                return res.status(401).json({
                    Response: {
                        response: {
                            result: false,
                            error: "비밀번호를 확인해주세요"
                        }
                    }
                });
            }
            // 변경할 비밀번호 암호화
            const shasum2 = crypto.createHash("sha256");
            shasum2.update(req.body.request.password);
            const changed_pw = shasum2.digest("hex");
            try{
                // 로그인 후 비밀번호 변경, 찾기를 통한 비밀번호 변경 구분
                if (!req.session.temp){
                    // 새로운 비밀번호로 갱신
                    await connection.query("update userinfo set password = ? where id = ?", [changed_pw, req.session.loginInfo.id]);
                }
                else{
                    await connection.query("update userinfo set password = ? where id = ?", [changed_pw, req.session.temp.id]);
                }
            }
            // db에서 에러 발생시 처리
            catch(err){
                console.log(err);
                // db 연결 해제
                connection.release();
                // 변경 실패
                return res.status(401).json({
                    Response: {
                        response: {
                            result: false
                        }
                    }
                });
            }
            // db 연결 해제
            connection.release();
            // 임시 세션 및 현재 로그인 세션 삭제
            req.session.destroy(() => req.session);
            // 성공
            return res.json({
                Response: {
                    response: {
                        result: true
                    }
                }
            });
        // 쿼리에러 에러가 발생시 처리
        } catch(err) {
            console.log("Query Error". err);
            // db 연결 해제
            connection.release();
            // 변경 실패
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 아이디입니다."
                    }
                }
            });
        }
    // db 연결에서 에러 발생시 처리
    } catch(err) {
        console.log("DB Error",err);
        // 변경 실패
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
// 로그아웃 함수
const logout = async (token) => {
    try {
        // mysql 연결
        const connection = await pool.getConnection(async conn => conn);
        try {
            // 계정 조회
            connection.query("update logged set token = ? where token = ?", ["", token]);

        // 쿼리에서 에러 발생시 처리
        } catch(err) {
            console.log("Query Error",err);
            // db 연결 해제
            connection.release();
            // 로그인 실패
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 아이디입니다."
                    }
                }
            });
        }
    // db 연결 에러 발생시 처리
    } catch(err) {
        console.log("DB Error",err);
        // 로그인 실패
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
// 로그인 처리 함수
const signin = async (res, req) => {
    try {
        // mysql 연결
        const connection = await pool.getConnection(async conn => conn);
        try {
            // 계정 조회
            const shasum = crypto.createHash("sha256");
            shasum.update(req.body.request.password);
            const pw = shasum.digest("hex");
            const [rows] = await connection.query("select * from userinfo where id = ? and password = ?", [req.body.request.id, pw]);
            if(!Object.keys(rows).lengths)
                return res.status(401).json({
                    Response: {
                        response: {
                            result: false,
                            error: "존재하지 않는 아이디입니다."
                        }
                    }
                });
            // 토큰 생성
            const token = bcrypt.hashSync(req.body.request.id + Date.now()).replace(/\//g,"");
            // db에 토큰 update
            await connection.query("update logged set token = ? where uid = ?", [token, req.body.request.id]);
            // 사용자에게 토큰 발급
            req.session.loginInfo = {
                token:token,
                id: req.body.request.id
            };
            // db 연결 해제
            connection.release();
            // 로그인 성공
            return res.json({
                Response: {
                    token: token,
                    response: {
                        result: true,
                        id: req.body.request.id
                    }
                }
            });
        // 쿼리에서 에러 발생시 처리
        } catch(err) {
            console.log("Query Error",err);
            // db 연결 해제
            connection.release();
            // 로그인 실패
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 아이디입니다."
                    }
                }
            });
        }
    // db 연결 에러 발생시 처리
    } catch(err) {
        console.log("DB Error",err);
        // 로그인 실패
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
// 아이디 찾기 처리 함수
const findId = async (res, req) => {
    console.log(req.body.request.email);
    try {
        // mysql 연결
        const connection = await pool.getConnection(async conn => conn);
        try {
            // 계정 조회
            const [rows] = await connection.query("select * from userinfo where email = ?", [req.body.request.email]);
            // 이메일 생성
            const message = {
                text: "Your AWS ID is " + rows[0].id,
                from: "force185@naver.com",
                to: req.body.request.email,
                subject: "[aws] Your ID"
            };
            // 이메일로 아이디 전송
            server.send(message, function (err, message) {
                console.log(err || message);
            });
            // db 연결 해제
            connection.release();
            // 처리 완료
            return res.json({
                Response: {
                    response: {
                        result: true,
                    }
                }
            });
        // 쿼리에서 에러 발생시 처리
        } catch(err) {
            console.log("find id query Error", err);
            // db 연결 해제
            connection.release();
            // 아이디 찾기 실패
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 이메일입니다."
                    }
                }
            });
        }
    // db 연결 에러 발생시 처리
    } catch(err) {
        console.log("DB Error");
        // 아이디 찾기 실패
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
// 비밀번호 찾기 처리 함수
const findPw = async (res, req) => {
    try {
        // mysql 연동
        const connection = await pool.getConnection(async conn => conn);
        try {
            // 계정 조회
            const [rows] = await connection.query("select * from userinfo where id = ? and email = ?", [req.body.request.id, req.body.request.email]);
            // 이메일 인증코드 생성
            const code = certifiedCode();
            // 토큰 생성
            const token = bcrypt.hashSync(req.body.request.id + Date.now());
            // 임시 세션 발급
            req.session.temp = {
                token: token,
                id: req.body.request.id,
                code: code
            };
            // 이메일 생성
            const message = {
                text: "code is = " + code,
                from: "force185@naver.com",
                to: req.body.request.email,
                subject: "[aws] Your Code"
            };
            // 이메일 전송
            server.send(message, function (err, message) {
                console.log(err || message);
            });
            // db 연결 해제
            connection.release();
            // 처리 완료
            return res.json({
                Response: {
                    response: {
                        result: true,
                    }
                }
            });
        // 쿼리에서 에러 발생시 처리
        } catch(err) {
            console.log("Query Error");
            // db 연결 해제
            connection.release();
            // 비밀번호 찾기 실패
            return res.status(401).json({
                Response: {
                    response: {
                        result: false,
                        error: "존재하지 않는 계정입니다."
                    }
                }
            });
        }
    // db 연결 에러 발생시 처리
    } catch(err) {
        console.log("DB Error");
        // 비밀번호 찾기 실패
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
// 회원가입 처리 함수
const signupDB = async (res, req) => {
    try {
        // mysql 연동
        const connection = await pool.getConnection(async conn => conn);
        try {
            // 동일한 계정정보가 존재하는지 체크
            const [rows] = await connection.query("select * from userinfo where id = ? or email = ?", [req.body.request.id, req.body.request.email]);
            // 계정이 존재할 경우
            if(rows.length > 0){
                connection.release();
                // 회원가입 실패
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
            // 계정이 없을 경우
            else{
                // 비밀번호 암호화
                const shasum = crypto.createHash("sha256");
                shasum.update(req.body.request.password);
                const pw = shasum.digest("hex");
                // db에 계정정보 삽입
                await connection.query("insert into userinfo (id, password, email) values(?, ?, ?)", [req.body.request.id, pw, req.body.request.email]);
                // db 연결 해제
                connection.release();
                // 토큰 발급
                const token = bcrypt.hashSync(req.body.request.id + Date.now()).replace(/\//g, "");
                // db에 토큰 테이블 삽입
                await connection.query("insert into logged (token, uid) values(?, ?)", [token, req.body.request.id]);
                // 세선 발급
                req.session.loginInfo = {
                    token: token,
                    id: req.body.request.id
                };
                // 사용자 폴더 생성
                newFolder(req.body.request.id);
                // 회원가입 성공
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
        // 쿼리에서 에러 발생시 처리
        } catch(err) {
            console.log("Query Error", err);
            // db 연결 해제
            connection.release();
            // 회원가입 실패
            return res.status(401).json({
                Response:{
                    response:{
                        result: false,
                        error: "회원가입에 실패했습니다"
                    }
                }
            });
        }
    // db 연결 에러 발생시 처리
    } catch(err) {
        console.log("DB Error", err);
        // 회원가입 실패
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
// /api/account/signup 주소로 요청이 오는 경우 처리 라우터
router.post("/signup", function (req, res, next) {
    // 입력값 유효성 검증
    const value = valid(req.body.request);
    // 유효하면 회원가입 처리 함수 호출
    if(value){
        return signupDB(res, req);
    }
    // 회원가입 실패
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
// /api/account/signin 주소로 요청이 오는 경우 처리 라우터
router.post("/signin", async function (req, res, next) {
    /* db와 연동해 계정 확인 */
    return signin(res, req);
    

});

/* 사용자 로그인 체크 */
// /api/account/getinfo 주소로 요청이 오는 경우 처리 라우터
router.get("/getinfo", function (req, res, next) {
    // 세션값 확인
    if (typeof req.session.loginInfo === "undefined") {
        // 로그인이 안되어 있을 경우
        return res.status(401).json({
            Response: {
                response: {
                    result: false,
                    error: 0
                }
            }
        });
    }
    // 로그인이 되어 있을 경우 토큰, 로그인 id 전송
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
    logout(req.body.request.token);
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
// /api/account/find/pw 주소로 요청이 오는 경우 처리 라우터
router.post("/find/pw", function (req, res, next) {
    // 비밀번호 찾기 함수 호출
    return findPw(res, req);
});
/* 이메일 인증 */
// /api/account/find/certified 주소로 요청이 오는 경우 처리 라우터
router.post("/find/certified", function (req, res, next) {
    const certified = req.body.request.certified;
    // 이메일 인증 코드 대문자화
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
    // 이메일 인증 성공
    return res.json({
        Response: {
            response: {
                result: true
            }
        }
    });
});
/* 아이디 찾기 */
// /api/account/find/id 주소로 요청이 오는 경우 처리 라우터
router.post("/find/id", function (req, res, next) {
    /* 이메일로 계정 검색 */
    return findId(res, req);
});
/* 비밀번호 찾기 성공시 변경 */
/* 현재 비밀번호 current가 비어있을 수 있음(현재 비밀번호를 모르는 경우) */
// /api/account/change 주소로 요청이 오는 경우 처리 라우터
router.post("/change", function (req, res, next) {
    return changePw(res, req);
});

module.exports = router;
