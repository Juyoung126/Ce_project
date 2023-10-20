//로그인 요청을 처리하고 비밀번호를 검증하는 Node.js 코드

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mariadb = require('mariadb');

app.use(express.urlencoded({ extended: false }));
const pool = mariadb.createPool({
  host: '데이터베이스 호스트',
  user: '데이터베이스 사용자 이름',
  password: '데이터베이스 비밀번호',
  database: '데이터베이스 이름'
});
const saltRounds = 10;

app.post('/login', (req, res) => {
  const userInputId = req.body.userId;
  const userInputPassword = req.body.userPassword;

  // 데이터베이스에서 사용자의 해시된 비밀번호 가져오기
  getUserPasswordFromDatabase(userInputId)
    .then((savedHashedPassword) => {
      if (!savedHashedPassword) {
        res.status(401).send('로그인 실패: 아이디가 잘못되었습니다.');
      } else {
        bcrypt.compare(userInputPassword, savedHashedPassword, (err, result) => {
          if (err) {
            console.error('비밀번호 검증 오류:', err);
            res.status(500).send('로그인 중 오류가 발생했습니다.');
          } else {
            if (result) {
              res.send('로그인 성공');
            } else {
              res.status(401).send('로그인 실패: 비밀번호가 잘못되었습니다.');
            }
          }
        });
      }
    })
    .catch((err) => {
      console.error('데이터베이스 오류:', err);
      res.status(500).send('로그인 중 오류가 발생했습니다.');
    });
});

// 데이터베이스에서 사용자의 해시된 비밀번호를 가져오는 함수
function getUserPasswordFromDatabase(userId) {
  return new Promise(async (resolve, reject) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT user_password FROM user WHERE user_id = ?', [userId]);

      if (rows.length > 0) {
        resolve(rows[0].user_password);
      } else {
        resolve(null); // 사용자가 존재하지 않음
      }
    } catch (err) {
      reject(err);
    } finally {
      if (conn) conn.end();
    }
  });
}

app.listen(60001, () => {
  console.log('서버가 60001번 포트에서 실행 중입니다.');
});