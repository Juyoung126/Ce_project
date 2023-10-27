/*const mysql = require('mysql');
const bcrypt = require('bcrypt');
const express = require('express'); // Express.js 또는 다른 웹 프레임워크 사용

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'dbid232',
  password: 'dbpass232',
  database: 'db23201',
});

const saltRounds = 10;
const userPassword = 'moohan314!';

bcrypt.hash(userPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('비밀번호 해싱 중 오류 발생: ' + err);
  } else {
    console.log('해싱된 비밀번호: ' + hashedPassword);
    const userData = {
      userid: 'mhgil',
      name: '길무한',
      nickName: '무한무한', // 컬럼명에 맞게 수정
      birthdate: '2000-03-14',
      email: 'mhgil314@gachon.ac.kr',
      password: hashedPassword,
    };

    // 데이터베이스에 사용자 정보 저장
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('데이터베이스 연결 오류:', err);
        // 에러 처리 로직 작성
      }

      conn.query(
        'INSERT INTO user (name, nickname, id, passwd, birth, email) VALUES (?, ?, ?, ?, ?, ?)',
        [
          userData.name,
          userData.nickName,
          userData.userid,
          userData.password,
          userData.birthdate,
          userData.email,
        ],
        (err, result) => {
          conn.release(); // 연결 반환
          if (err) {
            console.error('데이터베이스 쿼리 오류:', err);
            // 에러 처리 로직 작성
          }
          console.log('사용자 정보가 데이터베이스에 저장되었습니다.');
          // 응답 객체를 사용하여 클라이언트에 응답을 보낼 수 있음
        }
      );
    });
  }
});
*/