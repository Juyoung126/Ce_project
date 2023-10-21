// 서버 리소스 모니터링 코드
const os = require('os');

function monitorResources() {
  // CPU 정보 가져오기
  const cpus = os.cpus();

  // 메모리 정보 가져오기
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  // 디스크 공간 정보 가져오기
  const diskInfo = os.diskSpace();

  // 서버 리소스 상태 출력 또는 로깅
  console.log('CPU 정보:', cpus);
  console.log('총 메모리:', totalMemory, 'bytes');
  console.log('사용 가능한 메모리:', freeMemory, 'bytes');
  console.log('디스크 정보:', diskInfo);
}

// 주기적으로 모니터링 수행 ( 5초마다)
const monitoringInterval = 5000; // 5초
setInterval(monitorResources, monitoringInterval);
