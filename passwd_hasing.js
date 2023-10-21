const express = require('express');
const bcrypt = require('bcrypt');
const mariadb = require('mariadb');

const app = express();
app.use(express.json());

const pool = mariadb.createPool({
  host: '데이터베이스 호스트',
  user: '데이터베이스 사용자 이름',
  password: '데이터베이스 비밀번호',
  database: '데이터베이스 이름'
});
const saltRounds = 10;

app.post('/signup', (req, res) => {
  const userInputId = req.body.userId;
  const userInputName = req.body.userName;
  const userInputNickname = req.body.userNickname;
  const userInputBirthdate = req.body.userBirthdate;
  const userInputEmail = req.body.userEmail;
  const userPassword = req.body.userPassword; // 사용자가 입력한 비밀번호

  // 비밀번호 해싱
  bcrypt.hash(userPassword, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('비밀번호 해싱 오류:', err);
      res.status(500).send('회원가입 중 오류가 발생했습니다.');
    } else {
      // 사용자 정보와 해싱된 비밀번호를 userData 객체에 할당
      const userData = {
        username: userInputId,
        name: userInputName,
        nickname: userInputNickname,
        birthdate: userInputBirthdate,
        email: userInputEmail,
        password: hashedPassword,  // 해싱된 비밀번호
      };

      // 데이터베이스에 사용자 정보 저장
      pool.getConnection()
        .then(conn => {
          conn.query('INSERT INTO user (user_id, user_name, user_nickname, user_birthdate, user_email, user_password) VALUES (?, ?, ?, ?, ?, ?)',
            [userData.username, userData.name, userData.nickname, userData.birthdate, userData.email, userData.password])
            .then(result => {
              console.log('사용자 정보가 데이터베이스에 저장되었습니다.');
              res.send('회원가입이 완료되었습니다.');
            })
            .catch(err => {
              console.error('데이터베이스 쿼리 오류:', err);
              res.status(500).send('회원가입 중 오류가 발생했습니다.');
            })
            .finally(() => {
              conn.release(); // 연결 반환
            });
        })
        .catch(err => {
          console.error('데이터베이스 연결 오류:', err);
          res.status(500).send('회원가입 중 오류가 발생했습니다.');
        });
    }
  });
});

app.listen(60001, () => {
  console.log('서버가 60001번 포트에서 실행 중입니다.');
});