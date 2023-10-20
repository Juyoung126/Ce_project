// node 파일명.js '새로운파일크기' '새로운보관기간'

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

// 명령줄 인수에서 새로운 로그 순환 설정을 읽어옵니다.
const newMaxLogSize = process.argv[2] || '20m'; // 기본값 설정 (예: 20MB)
const newLogRetentionPeriod = process.argv[3] || '14d'; // 기본값 설정 (예: 14일)

// 새로운 로그 순환 설정으로 업데이트
updateLogRotation(newMaxLogSize, newLogRetentionPeriod);

// 로그 파일 설정을 만드는 함수
function createLogRotationTransport(maxSize, retentionPeriod) {
  return new DailyRotateFile({
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: maxSize, // 파일 크기 제한
    maxFiles: retentionPeriod, // 보관 기간
  });
}

// Winston 로거 설정
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [logTransport],
  level: 'info' // 초기 로그 레벨 설정
});

// 로그 이벤트
logger.error('이것은 에러 로그입니다.');
logger.warn('이것은 경고 로그입니다.');
logger.info('이것은 정보 로그입니다.');

// 로그 순환 설정 업데이트 함수
function updateLogRotation(newMaxSize, newRetentionPeriod) {
  const newLogTransport = createLogRotationTransport(newMaxSize, newRetentionPeriod);
  logger.clear();
  logger.add(newLogTransport);
  console.log(`로그 파일 크기 제한: ${newMaxSize}, 보관 기간: ${newRetentionPeriod}`);
}
