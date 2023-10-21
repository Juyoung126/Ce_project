const nodemailer = require('nodemailer');

// 경고 및 알림 설정
const alertThreshold = 90; // 예시: 90% 이상 사용 시 경고
const adminEmail = 'admin@example.com';


// 환경 변수에서 이메일 아이디와 비밀번호 읽어오기
const emailAdmin = process.env.EMAIL_Admin;
const emailPass = process.env.EMAIL_PASS;

// 이메일 알림 설정
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: emailAdmin,
    pass: emailPass
  }
});

// 모니터링 데이터를 주기적으로 확인하는 함수
function checkMonitoringData() {
  // 여기에서 모니터링 데이터를 가져오고 분석합니다.
  const currentUsage = getServerUsage(); // 예시: 서버 리소스 사용률

  if (currentUsage > alertThreshold) {
    sendAlertEmail(`서버 리소스 사용률이 ${currentUsage}%로 경고 수준을 초과했습니다.`);
  }
}

// 경고 및 알림 이메일을 보내는 함수
function sendAlertEmail(message) {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: adminEmail,
    subject: '경고: 서버 리소스 사용량 초과',
    text: message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('이메일 발송 중 오류:', error);
    } else {
      console.log('이메일 발송 성공:', info.response);
    }
  });
}

// 주기적으로 모니터링 데이터 확인
setInterval(checkMonitoringData, 60000); // 1분마다 확인 (밀리초 단위)

// 실제 모니터링 데이터를 가져오는 함수 (예시용)
function getServerUsage() {
  // 서버 리소스 사용률을 반환하는 코드
  // 실제 데이터를 가져오는 방법에 따라 이 함수를 수정해야 합니다.
  return Math.random() * 100; // 랜덤한 수를 사용한 예시
}
