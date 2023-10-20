// 로그 파일 설정 + 로그 레벨 및 로그 형식 정의

const winston = require('winston');

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
const fileTransport = new winston.transports.File({ filename: 'app.log' });

// 로깅 설정
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console(), // 콘솔 출력을 위한 설정
    fileTransport, // 파일 출력을 위한 설정
  ]
});

// 예제 로그 메시지 작성
logger.info('파일에 저장되는 정보 로그 메시지');
logger.error('파일에 저장되는 오류 로그 메시지');

