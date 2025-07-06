/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // …기존 옵션

  // 🛠️ 배포 빌드 시 ESLint 검사를 생략하도록 설정
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
