const mysql = require('mysql');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// 파일 로그 설정
const fileTransport = new DailyRotateFile({
  filename: '/home/t23201/svr/v0.5/src/logs/database-monitoring-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '30d', // 30일 동안 로그 파일 유지
  maxsize: '5m', // 로그 파일 크기 제한 (5MB)
  tailable: true, // 순환 파일 활성화
});

// 로깅 설정
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), // 콘솔 출력을 위한 설정
    fileTransport, // 파일 출력을 위한 설정
  ]
});

const connection = mysql.createConnection({
  host: '210.102.178.98',
  user: 'dbid232',
  password: 'dbpass232',
  database: 'db23201',
});

connection.connect((err) => {
  if (err) {
    logger.error('데이터베이스 연결에 실패했습니다: \n' + err.stack);
    return;
  }
  logger.info('데이터베이스 연결 성공\n');

  // 데이터베이스 쿼리 실행
  const query = 'SELECT * FROM 테이블명';
  const startTime = Date.now();

  connection.query(query, (error, results) => {
    const endTime = Date.now();
    const queryTime = endTime - startTime;

    if (error) {
      logger.error('쿼리 실행 중 오류 발생: ' + error);
    } else {
      logger.info('쿼리 실행 시간:', queryTime, '밀리초');
      logger.info('쿼리 결과:', results);
    }

    // 데이터베이스 연결 종료
    connection.end((err) => {
      if (err) {
        logger.error('데이터베이스 연결 종료 중 오류 발생: ' + err);
      }
      logger.info('데이터베이스 연결 종료\n');
    });
  });
});

