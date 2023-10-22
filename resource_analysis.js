const fs = require('fs');
const readline = require('readline');
const plotly = require('plotly')('yesring0126', 'PGEgiJ1rmamZWgsyUWZC');

// 현재 날짜를 가져오는 함수
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 로그 파일 경로를 현재 날짜를 포함하는 형태로 수정
const logFilePath = `/home/t23201/svr/v0.5/src/logs/resource-monitor-${getCurrentDate()}.log`;

const logs = [];

const readInterface = readline.createInterface({
  input: fs.createReadStream(logFilePath),
 // output: process.stdout,
  console: false,
});

readInterface.on('line', (line) => {
  logs.push(JSON.parse(line)); // JSON 형식의 로그 데이터를 파싱
});

readInterface.on('close', () => {
  analyzeLogs(logs);
});

function analyzeLogs(logs) {
  const timestamps = [];
  const memoryChanges = [];

  for (let index = 1; index < logs.length; index++) {
    timestamps.push(logs[index].timestamp);
    memoryChanges.push(logs[index - 1].totalMemory - logs[index].totalMemory);
  }
  // 바이트를 MB로 변환하는 함수
function bytesToMB(bytes) {
  return bytes / (1024 * 1024); // 1 MB = 1024 KB, 1 KB = 1024 bytes
}

const memoryChangesMB = memoryChanges.map(bytesToMB); // 메모리 변화 값을 MB로 스케일링

// 시간에 따른 총 메모리 변화를 그래프로 시각화
const data = [{
  x: timestamps,
  y: memoryChangesMB, // MB로 변환한 값 사용
  type: 'scatter',
  mode: 'lines',
  name: '총 메모리 변화 (MB)', // 시각적인 표시도 MB로 수정
}];
const layout = {
  title: '총 메모리 변화 그래프',
  xaxis: { title: '시간' },
  yaxis: { title: '메모리 변화 (MB)' },
};

const graphOptions = { layout: layout, filename: 'memory-change-graph', fileopt: 'overwrite' };
plotly.plot(data, graphOptions, (err, msg) => {
  if (err) {
    console.error('시각화 중 오류 발생:', err);
  } else {
    console.log('시각화 생성:', msg.url);
  }
});
}
