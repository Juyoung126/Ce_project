const express = require('express');
const app = express();
const winston = require('winston');
const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

// 로그 레벨 정의
const logLevel = 'info';
// 로그 형식 정의 
const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level}]: ${message}`;
  })
);

// 파일 로그 설정
const fileTransport = new winston.transports.File({
  filename: '/home/t23201/svr/v0.5/src/logs/server.log',
  maxsize: 5242880, // 파일 크기 제한 (5MB)
  maxFiles: 5, // 순환 파일의 최대 개수
  tailable: true, // 순환 파일 활성화
  zippedArchive: true, // 압축 파일 생성
});

// 로깅 설정
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console(), // 콘솔 출력을 위한 설정
    fileTransport, // 파일 출력을 위한 설정
  ]
});

// 로그 파일 순환 설정
fileTransport.on('rotate', (oldFilename, newFilename) => {
  // 로그 파일이 순환될 때 실행되는 코드
  logger.info(`로그 파일이 순환되었습니다. 이전 파일: ${oldFilename}, 새 파일: ${newFilename}`);
});

// 예외 처리
process.on('uncaughtException', (err) => {
  logger.error('예외 발생:', err);
  process.exit(1); // 프로세스를 종료
});

// 예외 처리 완료 후 프로세스 종료
process.on('exit', (code) => {
  logger.info(`프로세스 종료 (코드: ${code})`);
});

// MariaDB 연결 정보 설정
const pool = mariadb.createPool({
  host: '210.102.178.98',
  user: 'dbid232',
  password: 'dbpass232',
  database: 'db23201',
  connectionLimit: 5, // 연결 풀 크기 설정
});

// POST 요청 - 로그인 
app.post('/login', async (req, res) => {
  const { userid, passwd } = req.body; // 사용자로부터 제출된 로그인 정보

  // MariaDB 연결 및 쿼리 실행
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM user WHERE id = ?', [userid]);

    if (rows.length === 1) {
      const hashedPassword = rows[0].passwd; // 데이터베이스에 저장된 해시된 비밀번호
      const passwordMatch = await bcrypt.compare(passwd, hashedPassword);

      if (passwordMatch) {
        // 로그인 성공
        logger.info(`사용자 ${userid}이(가) 로그인했습니다.`);
        res.send('로그인 성공');
      } else {
        // 로그인 실패
        logger.warn(`사용자 ${userid}의 로그인 시도 실패`);
        res.send('로그인 실패');
      }
    } else {
      // 사용자가 존재하지 않음
      logger.warn(`사용자 ${userid}가 존재하지 않습니다.`);
      res.send('사용자가 존재하지 않습니다.');
    }

    conn.release(); // 연결 반환
  } catch (err) {
    // 오류 처리
    logger.error(`로그인 처리 오류: ${err}`);
    res.send('오류 발생');
  }
});


const port = 60001;

const server = app.listen(port, () => {
  logger.info(`서버가 ${port} 포트에서 실행 중입니다.`);
});

// 서버 종료 로직
process.on('SIGINT', () => {
  logger.info('서버가 종료됩니다.');
  server.close(() => {
    process.exit(0); // 프로세스를 정상 종료
  });
});
