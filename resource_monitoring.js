const os = require('os');
const diskusage = require('diskusage');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // JSON 형식으로 변경
  ),
  transports: [
    new DailyRotateFile({
      filename: '/home/t23201/svr/v0.5/src/logs/resource-monitor-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      maxsize: '5m',
      tailable: true,
    }),
  ],
});

function monitorResources() {
  // CPU 정보 가져오기
  const cpus = os.cpus();

  // 메모리 정보 가져오기
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  // 디스크 공간 정보 가져오기
  const diskInfo = diskusage.checkSync('/');

  // 로그 정보를 JSON 형식으로 출력
  logger.info({ 
    cpuInfo: cpus,
    totalMemory,
    freeMemory,
    diskInfo
  });
}

// 초기 실행 (프로그램 시작 시 한 번)
monitorResources();

