// 메인 애플리케이션 코드
const express = require('express');
var mysql = require('mysql');

const app = express();
app.use(express.json());

var pool = mysql.createPool({
  host: 'localhost',  // 데이터베이스 서버가 있는 주소.
  port: 3306,
  user: 'dbid232',     // 데이터베이스에 접근하기 위한 ID
  password: 'dbpass232',     // 데이터베이스에 접근하기 위한 Password
  database: 'db23201'   // 접근하고자 하는 데이터베이스 이름
});


//사용자 회원가입, 로그인, 로그아웃
const userAuthRouter = require('./lib/userAuthRouter.js');
app.use('/src/userManagements/signup', userAuthRouter);
app.use('/src/userManagements/login', userAuthRouter);
app.use('/src/userManagements/logout', userAuthRouter);



//관리자 회원가입, 로그인, 로그아웃
const adminAuthRouter = require('./lib/adminAuthRouter.js');
app.use('/src/adminManagements/login', adminAuthRouter);
app.use('/src/adminManagements/logout', adminAuthRouter);

/*
// 사용자 앱 메인페이지 
const mobileMain = require('./lib/mobileMainRouter.js');
app.use('/mobile',mobileMain);

// 관리자 웹 메인페이지 
const webMain = require('./lib/webMainRouter.js');
app.use('/web',webMain);
*/

// 서버 시작
const port = 60001;
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});


