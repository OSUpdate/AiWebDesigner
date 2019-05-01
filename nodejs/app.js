
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();



// view engine setup

app.set("view engine", "jade");



app.use(logger("dev"));
app.use(cors());
// 전송 데이터 크기 설정
app.use(bodyParser.json({limit: 50000000}));
app.use(bodyParser.urlencoded({limit: 50000000, extended: true, parameterLimit:50000}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// /templates 요청을 /routes/api/Templates 경로에 매칭시킴
app.use("/templates",express.static(path.join(__dirname+"/routes/api/Templates")));

// /select 요청을 /routes/api/Templates 경로에 매칭시킴
app.use("/select",express.static(path.join(__dirname+"/routes/api/Templates")));

// /select/png 요청을 /png 경로에 매칭시킴
app.use("/select/png",express.static(path.join(__dirname+"/png")));

// /png 요청을 /png 경로에 매칭시킴
app.use("/png",express.static(path.join(__dirname+"/png")));

// /editor 요청이 오면 index.html이 아닌 default.html을 찾음
app.use("/editor", function (req, res, next) {
    return express.static(`${__dirname}/user`, { index: "default.html" }).apply(this, arguments);
});
// express 서버에서 세션 사용하기 위한 설정
app.use(session({
    secret: "test",
    resave: false,
    saveUninitialized: true
}));
// /경로 라우터 연결
app.use("/", indexRouter);

// /users 경로 라우터 연결
app.use("/users", usersRouter);

// /api 경로 라우터 연결
app.use("/api", apiRouter);

// 404 에러를 다음 미들웨어로 넘김
app.use(function(req, res, next) {
    next(createError(404));
});

// 에러 핸들러
app.use(function(err, req, res, next) {
    // 개발모드에서만 지원
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // 응답 상태 설정
    res.status(err.status || 500);
    // 사용자에게 에러페이지 전송
    res.redirect( "http://127.0.0.1:3001/404");
    res.end();
    //res.render("/");
});

module.exports = app;
