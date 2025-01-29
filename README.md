# Drawry Frontend

🚀 **Drawry Frontend**는 [Vue.js](https://vuejs.org/)를 기반으로 개발된 프로젝트로, 사용자에게 직관적인 UI/UX를 제공하는 웹 애플리케이션입니다.

---

## 📂 프로젝트 개요

**Drawry Frontend**는 다음과 같은 기능을 제공합니다:
- ✏️ 사용자 스케치 기반 이미지 생성 (ControlNet, GLIGEN 연동)
- 🎨 커스텀 스케치 및 추가 이미지 삽입 기능
- ⚡ 빠른 렌더링을 위한 최적화된 프론트엔드 구성

백엔드 레포지토리는 [Drawry Backend](https://github.com/msai-project3-team4/Drawry-BackEnd)에서 확인할 수 있습니다.

---

## 🛠 기술 스택

- **Frontend**: Vue.js 3, Vite
- **State Management**: Pinia
- **UI Framework**: Tailwind CSS, Vue Router
- **Backend API**: FastAPI, Flask (Docker 연동)
- **Database**: MongoDB, Redis
- **Deployment**: Docker, Azure

---

## 🚀 설치 및 실행 방법

### 1️⃣ 프로젝트 클론
```sh
git clone https://github.com/msai-project3-team4/Drawry-FrontEnd.git
cd Drawry-FrontEnd
```

### 2️⃣ 패키지 설치
```sh
npm install
```
---

## 📁 프로젝트 구조

[작성예정]

---

## 🐳 Docker 실행 방법
``` sh
docker build -t drawry-frontend .
docker run -p 5173:5173 drawry-frontend
```

```sh
docker-compose up -d
```