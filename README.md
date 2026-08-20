# CareerMate – AI-Powered Job Portal 🚀

CareerMate is a full-stack AI-powered job portal that connects **job seekers and recruiters** on a single platform. Candidates can search and apply for jobs, manage their profiles and resumes, while recruiters can create companies, post jobs, and manage applicants.

## ✨ Features

### 👨‍💻 For Job Seekers

* User registration and login with JWT authentication
* Browse and search for jobs
* Apply for jobs
* Track applied jobs and application status
* Create and manage user profiles
* Upload resumes and profile images
* AI-powered resume parsing and analysis
* AI-based job matching and recommendations

### 🏢 For Recruiters

* Recruiter authentication
* Create and manage company profiles
* Upload company logos
* Post and manage job vacancies
* View job applicants
* Update application status
* Search and filter jobs and companies

### 🤖 AI Features

* **AI Resume Parser** – Extracts important information from resumes
* **AI Resume Analyzer** – Analyzes resume quality and provides insights
* **AI Job Matcher** – Matches candidates with suitable job opportunities
* **AI Job Recommendations** – Recommends relevant jobs based on candidate information

## 🛠️ Tech Stack

**Frontend**

* React.js
* Redux Toolkit
* Tailwind CSS
* Axios
* React Router
* Lucide React

**Backend**

* Node.js
* Express.js
* RESTful APIs
* JWT Authentication
* bcryptjs

**Database**

* MongoDB
* Mongoose

**AI & Services**

* Groq API
* Cloudinary
* AI-powered resume processing

## 📂 Project Structure

```text
CareerMate/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── redux/
│   │   └── utils/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🔐 Authentication & Security

* JWT-based authentication
* HTTP-only cookies for authentication tokens
* Password hashing using bcryptjs
* Protected routes for authenticated users
* Separate recruiter/admin functionality
* Environment variables for API keys and sensitive configuration

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Rishu778/CareerMate.git
cd CareerMate
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create `.env` files inside the `backend` and `frontend` directories.

**Backend `.env`:**

```env
PORT=7856
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
GROQ_API_KEY=your_groq_api_key
```

**Frontend `.env:**

```env
VITE_API_URL=http://localhost:7856
VITE_GROQ_API_KEY=your_groq_api_key
```

> Never commit `.env` files or API keys to GitHub.

### 5. Run the Backend

```bash
cd backend
npm run dev
```

### 6. Run the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 🔄 Application Workflow

```text
Candidate
   ↓
Register / Login
   ↓
Create Profile & Upload Resume
   ↓
AI Resume Analysis
   ↓
Search / Get Job Recommendations
   ↓
Apply for Jobs
   ↓
Track Application Status
```

```text
Recruiter
   ↓
Login
   ↓
Create Company
   ↓
Post Job
   ↓
View Applicants
   ↓
Update Application Status
```

## 🎯 Project Highlights

* Full-stack MERN architecture
* Role-based job seeker and recruiter functionality
* RESTful backend APIs
* Secure authentication system
* AI-powered career assistance
* Resume upload and processing
* Cloud-based file storage using Cloudinary
* MongoDB-based job and application management
* Responsive and modern user interface

## 🚀 Future Enhancements

* Google OAuth authentication
* Email verification
* Forgot password functionality
* Advanced semantic job search
* AI-powered interview preparation
* Automated candidate ranking
* Real-time notifications
* Application analytics dashboard

## 👨‍💻 Author

**Rishu Sharma**

BTech Student | Full-Stack Developer | AI/ML Enthusiast

GitHub: [@Rishu778](https://github.com/Rishu778)
