// PM2 배포 설정 예시 파일.
// 실제 배포 시 이 파일을 복사해 ecosystem.config.js 로 사용하세요.
//   cp ecosystem.config.example.js ecosystem.config.js
// 민감정보(DB/AWS 자격증명)는 여기에 두지 말고 backend/.env 에 작성합니다.
// (backend/.env.example 참고)

module.exports = {
  apps: [
    {
      name: "frontend",
      script: "npm",
      args: "run start",
      cwd: "/path/to/community/frontend",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "backend",
      script: "node",
      args: "./backend/dist/index.js",
      watch: false,
      env: {
        NODE_ENV: "production"
        // DB/AWS 등 민감정보는 backend/.env 에서 dotenv로 로드됨
      }
    }
  ]
};
