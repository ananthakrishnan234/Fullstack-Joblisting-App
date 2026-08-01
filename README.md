<div align="center">

# 💼 AI-Powered Job Listing Platform

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude_API-D97757?style=for-the-badge&logo=anthropic&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=for-the-badge)

**A full-stack job board with AI-enhanced job descriptions, advanced filtering, and a recruiter-style analytics dashboard.**

[🌐 Live Demo](https://fullstack-joblisting-app.vercel.app/) · [🐛 Report Bug](https://github.com/ananthakrishnan234/Fullstack-Joblisting-App/issues)

</div>

---

## 📌 About

A job listing platform built to go past basic CRUD — it pairs a Spring Boot REST API with a React frontend and layers in an **AI-powered job description enhancer using the Claude API**, real filtering/search, bookmarking, and a stats dashboard. Styled with a dark navy + teal design system and signature terminal-style tech tag components.

### Engineering highlights
- **Service layer + DTO pattern** — controllers never touch MongoDB documents directly
- **AI job description enhancement** — Claude API rewrites raw job descriptions into clean, structured postings
- **Advanced filtering** — by role, tech stack, experience level, and free-text search
- **Bookmarking system** — client-side persistence via localStorage UUIDs, no login required
- **Analytics dashboard** — job counts by tech stack, experience level, and trends
- **Global exception handling & Bean Validation** on every write endpoint

---

## ✨ Features

| Category | Details |
|---|---|
| 📋 **Job Listings** | Full CRUD for job postings via REST API |
| 🤖 **AI Enhancement** | One-click job description rewrite powered by Claude (claude-haiku) |
| 🔍 **Search & Filter** | Filter by profile, tech stack, and experience; free-text search |
| 🔖 **Bookmarks** | Save jobs locally without requiring an account |
| 📊 **Dashboard** | Visual stats on listings by tech, role, and experience |
| 🎨 **Design System** | Dark navy/teal theme with custom `TechTag` components |
| ⚠️ **Validation** | Bean Validation + centralized exception handling on all endpoints |

---

## 🛠️ Tech Stack

**Backend:** Java 17 · Spring Boot · Spring Data MongoDB · Maven · Claude API (AI enhancement)
**Frontend:** React · Axios · React Router · Bootstrap 5
**Database:** MongoDB Atlas
**Deployment:** Vercel (frontend) · Render (backend)

---

## 📁 Project Structure

```
Fullstack-Joblisting-App/
│
├── Joblisting-Backend/                  # Spring Boot backend
│   ├── src/main/java/com/joblisting/
│   │   ├── controller/                  # REST controllers
│   │   ├── service/                     # Business logic + Claude API integration
│   │   ├── repository/                  # MongoDB repositories
│   │   ├── dto/                         # Request/response DTOs
│   │   ├── model/                       # MongoDB document models
│   │   └── exception/                   # Global exception handling
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── Joblisting-Frontend/                 # React frontend
│   ├── src/
│   │   ├── components/                  # TechTag, JobCard, FilterBar, etc.
│   │   ├── pages/                       # Home, JobDetails, Dashboard
│   │   ├── services/                    # Axios API layer
│   │   └── App.js
│   └── package.json
│
├── job_listings_50.json                 # Sample dataset (50 jobs)
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ananthakrishnan234/Fullstack-Joblisting-App.git
cd Fullstack-Joblisting-App
```

### 2. Backend setup (Spring Boot + MongoDB Atlas)

Set the following as **environment variables** — never hardcode these in `application.properties` or commit them:
```properties
spring.data.mongodb.uri=${MONGO_URI}
spring.data.mongodb.database=jobapidb
claude.api.key=${CLAUDE_API_KEY}
```

Run the backend:
```bash
cd Joblisting-Backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`

### 3. Frontend setup (React)

Create a `.env` file in `Joblisting-Frontend/`:
```
REACT_APP_API_URL=http://localhost:8080
```

```bash
cd Joblisting-Frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`

### 4. (Optional) Seed sample data
```bash
mongoimport --uri "$MONGO_URI" --collection jobs --file job_listings_50.json --jsonArray
```

---

## 🌐 Deployment Notes

- **Frontend** is deployed on Vercel — set `REACT_APP_API_URL` to the deployed backend URL in Vercel's project environment variables.
- **Backend** is deployed on Render — set `MONGO_URI` and `CLAUDE_API_KEY` as Render environment variables, and configure CORS to allow the deployed Vercel origin.

---

## 🗺️ Roadmap

- [ ] JWT authentication for recruiter accounts
- [ ] Server-side bookmark persistence (currently localStorage)
- [ ] Job application submission flow
- [ ] Swagger/OpenAPI documentation

---

## 📄 License

Licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

## 📬 Contact

**Ananthakrishnan Sudhakaran**
📧 [ananthakrishnans234@gmail.com](mailto:ananthakrishnans234@gmail.com) · 💼 [LinkedIn](https://www.linkedin.com/in/ananthakrishnan234/) · 🐙 [GitHub](https://github.com/ananthakrishnan234)

<div align="center">

⭐ If this project helped you, consider giving it a star!

</div>
