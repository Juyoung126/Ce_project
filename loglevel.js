// node 파일명.js 로그레벨

const winston = require('winston');

// 명령줄에서 입력 받기
const newLogLevel = process.argv[2]; // 첫 번째 인수 (0번은 'node', 1번은 파일명)

// 유효한 로그 레벨인지 확인
if (['error', 'warn', 'info', 'debug'].includes(newLogLevel)) {
  setLogLevel(newLogLevel); // 로그 레벨 변경
} else {
  console.error('유효하지 않은 로그 레벨입니다.');
}

// 로그 레벨을 설정하는 함수
function setLogLevel(newlevel) {
  winston.configure({
    level: newlevel
  });
  console.log(`로깅 레벨이 ${newlevel}로 변경되었습니다.`);
}
