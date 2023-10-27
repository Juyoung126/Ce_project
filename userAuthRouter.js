const express = require('express');
const session = require('express-session');
const router = express.Router();
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());


//세션 미들웨어 설정
app.use(session({
    secret: 'your-secret-key', // 세션 데이터 암호화에 사용할 시크릿 키
    resave: false,
    saveUninitialized: true,
  }));
router.get('/signup',(req, res)=>{
  
});
  
// POST 요청에 대한 회원가입 처리
router.post('/signup', (req, res) => {
  const pool = req.app.get('pool'); // 메인 애플리케이션 코드에서 정의한 데이터베이스 연결 정보를 가져옵니다.
  const saltRounds = 10; // 비밀번호 해싱에 사용할 salt의 라운드 수

  // 사용자가 POST 요청으로 보낸 데이터 추출
  /*const userInputId = req.body.userId;
  const userInputName = req.body.userName;
  const userInputNickname = req.body.userNickname;
  const userInputBirthdate = req.body.userBirthdate;
  const userInputEmail = req.body.userEmail;
  const userPassword = req.body.userPassword; // 사용자가 입력한 비밀번호
*/
  const userInputId = req.body.newuser.SubmitId;
  const userInputName = req.body.newuser.SubmitUserName;
  const userInputNickname = req.body.newuser.SubmitNickname;
  const userInputBirthdate = req.body.newuser.SubmitDate_birth;
  const userInputEmail = req.body.newuser.SubmitEmail;
  const userPassword = req.body.newuser.SubmitPassword;

  // 아이디 중복 확인을 위한 쿼리
  const query = "SELECT id FROM user WHERE id = ?";

  // 데이터베이스에서 아이디 중복 확인
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('데이터베이스 연결 오류:', err);
      return res.status(500).send('회원가입 중 오류가 발생했습니다.');
    }

    conn.query(query, [userInputId], (err, result) => {
      if (err) {
        conn.release(); // 연결 반환
        console.error('데이터베이스 쿼리 오류:', err);
        return res.status(500).send('회원가입 중 오류가 발생했습니다.');
      }
 
      if (result.length > 0) {
        // 이미 존재하는 아이디인 경우
        conn.release(); // 연결 반환
        return res.status(400).send('이미 사용 중인 아이디입니다.');
      } else {
        // 아이디 중복이 없는 경우, 비밀번호 해싱
        bcrypt.hash(userPassword, saltRounds, (err, hashedPassword) => {
          if (err) {
            console.error('비밀번호 해싱 오류:', err);
            conn.release(); // 연결 반환
            return res.status(500).send('회원가입 중 오류가 발생했습니다.');
          } else {
            // 사용자 정보와 해싱된 비밀번호를 userData 객체에 할당
            const userData = {
              username: userInputId,
              name: userInputName,
              nickname: userInputNickname,
              birthdate: userInputBirthdate,
              email: userInputEmail,
              password: hashedPassword, // 해싱된 비밀번호
            };

            // 데이터베이스에 사용자 정보 저장
            conn.query(
              'INSERT INTO user (name, nickname, id, passwd, birth, email) VALUES (?, ?, ?, ?, ?, ?)',
              [
                userData.name,
                userData.nickname,
                userData.username,
                userData.password,
                userData.birthdate,
                userData.email
              ],
              (err, result) => {
                conn.release(); // 연결 반환
                if (err) {
                  console.error('데이터베이스 쿼리 오류:', err);
                  return res.status(500).send('회원가입 중 오류가 발생했습니다.');
                }
                console.log('사용자 정보가 데이터베이스에 저장되었습니다.');
                res.send('회원가입이 완료되었습니다.');
                res.redirect('/src/userManagements/login'); // 회원가입 완료시 로그인페이지로

              }
            );
          }
        });
      }
    });
  });
});

// 로그인 요청 처리 코드
router.post('/login', (req, res) => {
    const userInputId = req.body.userId; // 사용자가 입력한 아이디
    const userPassword = req.body.userPassword; // 사용자가 입력한 비밀번호
  
    // 데이터베이스에서 사용자 정보를 조회하고 사용자가 입력한 비밀번호를 비교하여 인증 처리를 수행합니다.
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('데이터베이스 연결 오류:', err);
        return res.status(500).send('로그인 중 오류가 발생했습니다.');
      }
  
      conn.query('SELECT * FROM user WHERE id = ?', [userInputId], (err, rows) => {
        if (err) {
          conn.release();
          console.error('데이터베이스 쿼리 오류:', err);
          return res.status(500).send('로그인 중 오류가 발생했습니다.');
        }
  
        if (rows.length === 1) {
          const userData = rows[0];
          bcrypt.compare(userPassword, userData.passwd, (err, result) => {
            conn.release();
            if (err) {
              console.error('비밀번호 비교 오류:', err);
              return res.status(500).send('로그인 중 오류가 발생했습니다.');
            } else {
              if (result) {
                req.session.user = {    //사용자 정보를 세션에 저장
                  id: userInputId,
                };
                res.redirect('/mobile'); // 로그인 완료되면  메인 화면으로..
              } else {
                res.status(401).send('로그인 실패: 비밀번호가 일치하지 않습니다.');
              }
            }
          });
        } else {
          conn.release();
          res.status(401).send('로그인 실패: 사용자가 존재하지 않습니다.');
        }
      });
    });
  });

// 로그아웃 post
router.post('/logout', (req, res) => {
    // 세션에서 사용자 정보 삭제
    delete req.session.user;
  
    res.send('로그아웃 성공');
    res.redirect('/src/userManagements/login'); // 로그아웃 완료시 로그인페이지로
});
module.exports = router;
