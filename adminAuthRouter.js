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


router.post('/login', (req, res) => {
    const adminInputId = req.body.adminId; // 관리자가 입력한 아이디
    const adminPasswd = req.body.adminPasswd; // 관리자가 입력한 비밀번호
  
    // 데이터베이스에서 관리자 정보를 조회하고 입력한 비밀번호를 비교하여 인증 처리를 수행
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('데이터베이스 연결 오류:', err);
        return res.status(500).send('로그인 중 오류가 발생했습니다.');
      }
  
      conn.query('SELECT * FROM admin WHERE id = ?', [adminInputId], (err, rows) => {
        if (err) {
          conn.release();
          console.error('데이터베이스 쿼리 오류:', err);
          return res.status(500).send('로그인 중 오류가 발생했습니다.');
        }
  
        if (rows.length === 1) {
          const adminData = rows[0];
          bcrypt.compare(adminPasswd, adminData.passwd, (err, result) => {
            conn.release();
            if (err) {
              console.error('비밀번호 비교 오류:', err);
              return res.status(500).send('로그인 중 오류가 발생했습니다.');
            } else {
              if (result) {
                req.session.admin = {    //사용자 정보를 세션에 저장
                  id: adminInputId,
                };
                res.redirect('/web'); // 로그인 완료되면  메인 화면으로..
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
    // 세션에서 관리자 정보 삭제
    delete req.session.admin;
    res.send('로그아웃 성공');
    res.redirect('/src/adminManagements/login'); // 로그아웃하면 로그인 페이지로 다시 돌아가기
});
module.exports = router;
