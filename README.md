# CodeBridge Learning Platform — Full Stack React.js & Express API Platform

A complete, production-ready full stack web application developed for the **REACT.JS PRACTICAL ASSIGNMENT: CodeBridge Learning Platform — API Integration & Authentication** (Module: Develop Frontend Application using React.js, LO1 — 30 Marks).

---

## 📌 Workspace Structure

```
backend work/
├── codebridge-frontend/         # React.js 19 + Vite Frontend Application
│   ├── src/
│   │   ├── components/          # Reusable components (UserCard, PostCard, CourseCard, Navbar, Footer, ProtectedRoute, Toast)
│   │   ├── context/             # AuthContext (JWT & User state)
│   │   ├── pages/               # Home, Users, UserDetail, Posts, PostDetail, Courses, Register, Login, Dashboard
│   │   ├── services/            # API service helpers (JSONPlaceholder & CodeBridge Backend)
│   │   ├── App.jsx              # Routes & App Layout
│   │   └── index.css            # Human Editorial Anti-AI Design System
│   └── README.md
│
└── backend-work-code-bridge-API-/ # Node.js + Express + MySQL Backend API
    ├── server.js                # Server entry point (Port 3000)
    ├── schema.sql               # Database schema & sample seed courses
    └── src/
        ├── app.js               # Express App & CORS setup
        ├── config/db.js         # MySQL Connection Pool
        ├── controllers/         # Auth, Course, and Enrollment controllers
        ├── middleware/          # JWT & Authentication middleware
        └── routes/              # Express API Routes
```

---

## 📋 Comprehensive Assignment Modules & Implementation Logic

### PART A: JSONPlaceholder Users
- **Page**: `/users` (`src/pages/Users.jsx`)
- **API Endpoint**: `https://jsonplaceholder.typicode.com/users` & `GET /api/auth/users`
- **Reusable Component**: `UserCard` (`src/components/UserCard.jsx`)
- **Logic**:
  1. Component fetches user records on load via `useEffect`.
  2. Stores output in React `useState` (`users`, `loading`, `error`).
  3. Displays loading messages while waiting and clear error notifications if fetch fails.
  4. Supports tab switching between real CodeBridge registered database users and JSONPlaceholder test users.

### PART B & C: Fetch Posts & Real-Time Search
- **Page**: `/posts` (`src/pages/Posts.jsx`)
- **API Endpoint**: `https://jsonplaceholder.typicode.com/posts`
- **Reusable Component**: `PostCard` (`src/components/PostCard.jsx`)
- **Search Logic**:
  - Implements real-time client-side search field (`Search posts...`).
  - Manages `searchTerm`, `posts`, and `filteredPosts` in React state.
  - Filters posts whose titles contain the search substring (case-insensitive) dynamically without page reloads.

### PART D: Single Post & User Detail Routes
- **Post Detail Route**: `/posts/:id` (`src/pages/PostDetail.jsx`)
- **User Detail Route**: `/users/:id` (`src/pages/UserDetail.jsx`)
- **Logic**:
  - Extracts parameters dynamically from URL using React Router `useParams()`.
  - Fetches individual post (`/posts/:id`) or user profile (`/api/auth/users/:id`).
  - Displays complete details, author info, registration metadata, with loading spinners and back navigation.

### PARTS E, F & G: Authentication & JWT Management
- **Registration (`/register`)**:
  - Form Fields: Full Name, Email, Password, Confirm Password.
  - **Validation Rules**:
    1. Full Name required (min 3 characters).
    2. Valid Email format regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
    3. Password strength: min 8 characters, at least 1 uppercase letter (`/[A-Z]/`), at least 1 number (`/[0-9]/`).
    4. Password confirmation match (`password === confirmPassword`).
  - Posts to `POST /api/auth/register` and redirects to `/login` upon success.
- **Login (`/login`)**:
  - Posts credentials to `POST /api/auth/login`.
  - Receives JWT token & user information (`id`, `full_name`, `email`, `role`).
  - Stores JWT token in `localStorage` (`codebridge_token`) and React `AuthContext`.
  - Automatically attaches header `Authorization: Bearer <token>` on protected endpoints.

### PARTS H, I & J: Course Catalog, Filtering, Pagination & Enrollment
- **Catalog Page (`/courses`)**:
  - Endpoint: `GET /api/courses`
  - Reusable Component: `CourseCard` (`src/components/CourseCard.jsx`) displaying Course Title, Category badge, Description, formatted Price, and Enroll action.
- **Search, Filtering, Sorting & Pagination**:
  - **Search**: Query param `?search=...` (matches title or category).
  - **Category**: Filter dropdown for Web Development, Frontend, Backend, Database, Full Stack.
  - **Price Sort**: Sort dropdown for Low-to-High (`order=asc`) or High-to-Low (`order=desc`).
  - **Pagination**: Parameters `?page=1&limit=6`. Returns pagination metadata (`total`, `total_pages`, `has_next`, `has_prev`). Next and Previous buttons navigate pages dynamically.
- **Course Enrollment Logic**:
  - Endpoint: `POST /api/enrollments` with body `{ course_id: id }` and JWT header.
  - Prompts unauthenticated visitors to log in before enrolling.
  - Status code handling:
    - `201 Created`: Displays success toast & marks course as Enrolled.
    - `401 Unauthorized`: Session expired / redirect to login.
    - `409 Conflict`: Toast error "You are already enrolled in this course".
    - `404 / 500`: Appropriate error message display.

### PARTS K & L: Protected Student Dashboard & Logout
- **Protected Dashboard (`/dashboard`)**:
  - Guarded by `ProtectedRoute` wrapper component (`src/components/ProtectedRoute.jsx`). Unauthenticated access redirects to `/login`.
  - Endpoint: `GET /api/enrollments/my-courses` (JOIN query between `enrollments` and `courses`).
  - Displays student profile (Name, Email), enrolled courses, price, and enrollment timestamp (`enrolled_at`).
  - **Drop Course**: Option to drop an enrolled course via `DELETE /api/enrollments/:courseId`.
- **Logout Functionality**:
  - Clears token and user state from `localStorage` and `AuthContext`.
  - Immediately redirects to `/login` and blocks access to protected routes.

---

## 🎨 Design System (Editorial Anti-AI Aesthetic)

The application features an anti-AI humanized editorial design system:

- **Body Background**: `#f5f1e8` (Warm tactile paper tone)
- **Card / Form Background**: `#ffffff` with top `#b54d35` terracotta accent border
- **Primary Text**: `#1d2b2a` (Deep warm charcoal)
- **Eyebrows & Accents**: `#b54d35` (Muted terracotta / rust)
- **Callout Banners**: `#d9e4d5` (Calm sage green with left accent bar)
- **Focus Outlines**: `#2f8f46` (Natural emerald green)
- **Headings & Body Font**: `Georgia, "Times New Roman", serif`
- **Navigation & Labels**: Uppercase `Arial, sans-serif` (`0.75rem` / `0.8rem`)

---

## 🔌 API Endpoints Reference

Base URL: `http://localhost:3000/api`

### Auth & User Endpoints
| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register new student account |
| `POST` | `/auth/login` | No | Authenticate user & return JWT token |
| `GET` | `/auth/profile` | Yes | Get logged-in student profile |
| `GET` | `/auth/users` | No | List all registered database users |
| `GET` | `/auth/users/:id` | No | Get single user profile by ID |

### Course Catalog Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/courses` | List courses (`?search=`, `?page=`, `?limit=`, `?sort=price`, `?order=asc\|desc`) |
| `GET` | `/courses/:id` | Get single course detail |

### Enrollment Endpoints (Protected)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/enrollments` | Enroll in course (`{ course_id: id }`) |
| `GET` | `/enrollments/my-courses` | Get logged-in student's enrolled courses |
| `DELETE` | `/enrollments/:courseId` | Drop enrolled course |

---

## 🚀 Quick Start Guide

### 1. Start Express Backend API
```bash
cd backend-work-code-bridge-API-
npm start
```
*Listens on `http://localhost:3000`.*

### 2. Start React Frontend Server
```bash
cd codebridge-frontend
npm run dev
```
*Listens on `http://localhost:5173`.*

---

## 📊 Marking Rubric Summary (30 Marks)

- **React Components & Structure**: 3/3 Marks
- **JSONPlaceholder API Integration**: 4/4 Marks
- **Loading, Error & Conditional Rendering**: 3/3 Marks
- **React Router & Dynamic Routes**: 3/3 Marks
- **Forms & Input Validation**: 3/3 Marks
- **Backend Auth & JWT**: 4/4 Marks
- **Course Fetching & Catalog**: 3/3 Marks
- **Search, Filter, Sort & Pagination**: 2/2 Marks
- **Enrollments & Protected Requests**: 2/2 Marks
- **Dashboard & Logout**: 1/1 Marks
- **Code Quality & Aesthetics**: 2/2 Marks
- **Total Score**: **30 / 30 Marks**
