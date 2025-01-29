# Node.js 18 Alpine 버전 사용 (경량화)
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json만 먼저 복사하여 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 전체 소스 코드 복사
COPY . .

# Vue 개발 서버 실행 포트
EXPOSE 5173

# Vue 서버 실행 (호스트에서 접근 가능하도록 --host 옵션 추가)
CMD ["npm", "run", "dev", "--", "--host"]
