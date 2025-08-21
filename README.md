#  Fullstack Joblisting Application  

![Java](https://img.shields.io/badge/Java-17-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)
![Maven](https://img.shields.io/badge/Maven-3.x-blue?style=flat-square&logo=apachemaven)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)

A **Fullstack Joblisting App** built with **React (frontend)**, **Spring Boot (backend)**, and **MongoDB Atlas (database)**.  
It allows users to browse job postings, search/filter listings, and explore required skills.  

Perfect for learning **full-stack development**, **REST API integration**, and **cloud databases**.  

---

##  Features

###  Backend (Spring Boot + MongoDB)
- **Job Listings API** – RESTful endpoints to fetch, add, update, and delete jobs.  
- **MongoDB Integration** – Stores job data in a cloud database.  
- **Filtering** – Supports filtering jobs by profile, experience, and technologies.  
- **Extensible** – Easy to extend with authentication or advanced queries.  

###  Frontend (React)
- **Job Browser** – Displays all jobs in a clean UI.  
- **Search & Filter** – Find jobs by keywords, skills, or years of experience.  
- **Job Details Page** – Explore job description, required stack, and profile.  
- **Responsive Design** – Works across desktop and mobile.  
- **Reusable Components** – Built with React best practices.  

---

##  Project Structure  

```
Fullstack-Joblisting/
│
├── Joblisting-Backend/         # Spring Boot backend
│   ├── src/                    # Java source files
│   ├── pom.xml                 # Maven dependencies
│   └── application.properties  # DB Configurations
│
├── Joblisting-Frontend/        # React frontend
│   ├── src/                    # React components & pages
│   ├── package.json            # Dependencies & scripts
│
├── Joblisting-50.json          # Sample dataset (50 jobs)
└── README.md                   # Documentation
```

---

##  Setup Instructions  

### 1 Clone the Repository
```bash
git clone https://github.com/ananthakrishnan234/Fullstack-Joblisting.git
cd Fullstack-Joblisting
```

---

### 2 Backend Setup (Spring Boot + MongoDB Atlas)

1. Navigate to the backend:  
   ```bash
   cd Joblisting-Backend
   ```

2. Configure MongoDB in `src/main/resources/application.properties`:  
   ```properties
   MONGO_DATABASE=jobapidb
   MONGO_USER=ananthakrishnans234
   MONGO_PASSWORD=bEBrZ7HCg4oUVJ2L
   MONGO_CLUSTER=cluster1.hptlfmp.mongodb.net

   spring.data.mongodb.database=${MONGO_DATABASE}
   spring.data.mongodb.uri=mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority
   ```

3. Run the backend:  
   ```bash
   ./mvnw spring-boot:run
   ```

    Runs at `http://localhost:8080`  

---

### 3 Frontend Setup (React)

1. Navigate to the frontend:  
   ```bash
   cd Joblisting-Frontend
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Start the app:  
   ```bash
   npm start
   ```

    Runs at `http://localhost:3000`  

---

### 4 Import Sample Data into MongoDB

To preload the dataset (`Joblisting-50.json`) into MongoDB Atlas:  

```bash
mongoimport --uri "mongodb+srv://ananthakrishnans234:bEBrZ7HCg4oUVJ2L@cluster1.hptlfmp.mongodb.net/jobapidb" \
  --collection JobPost \
  --type json \
  --file Joblisting-50.json \
  --jsonArray
```

---

##  Example Dataset  

Each job document looks like:  

```json
{
  "_id": "1",
  "desc": "Already sea cup they let figure performance guess...",
  "exp": 12,
  "profile": "Academic librarian",
  "techs": ["docker", "kubernetes", "react", "python"]
}
```

---

##  API Endpoints  

| Method | Endpoint       | Description             |
|--------|---------------|-------------------------|
| GET    | `/jobs`       | Get all job listings    |
| GET    | `/jobs/{id}`  | Get job by ID           |
| POST   | `/jobs`       | Add a new job           |
| PUT    | `/jobs/{id}`  | Update a job            |
| DELETE | `/jobs/{id}`  | Delete a job            |

---

##  Technologies Used  

- **Java 17**  
- **Spring Boot 3.x**  
- **React 18**  
- **MongoDB Atlas**  
- **Maven**  
- **Axios** (API calls)  
- **React Router DOM**  

---

##  Future Improvements  

- JWT Authentication (Spring Security + React Auth)  
- Job Application Submission feature  
- Advanced search with multiple filters  
- Deployment → Backend on **Render/Heroku**, Frontend on **Vercel/Netlify**  

---

##  License  

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.  

---

##  Contact  

**Ananthakrishnan Sudhakaran**  
 Email: [ananthakrishnans234@gmail.com](mailto:ananthakrishnans234@gmail.com)  
 GitHub: [ananthakrishnan234](https://github.com/ananthakrishnan234)  
 LinkedIn: [Ananthakrishnan Sudhakaran](https://www.linkedin.com/in/ananthakrishnan-sudhakaran)  

