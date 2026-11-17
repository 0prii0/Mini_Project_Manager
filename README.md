# Mini Project Manager — Enterprise SaaS Platform

A modern, high-performance, full-stack Project and Task Management platform built with clean architecture, strict TypeScript types, PostgreSQL relational integrity, and a premium Indigo SaaS design system.

---

## 📌 Executive Summary

**Mini Project Manager** is an enterprise-grade project workflow web application structured as a monorepo containing an independent **Next.js 15** frontend and an **Express.js** REST API backend. The system enables authenticated users to organize projects, create granular tasks with workflow states (`TODO`, `IN_PROGRESS`, `DONE`), schedule deadlines, track live completion metrics, and visualize team progress through an aggregated real-time dashboard.

### Core Architectural Principles
- **Strict User Isolation & Zero-Trust Ownership:** Data access is strictly scoped to the authenticated user. Every database query enforces user ownership at the ORM layer.
- **Defense-in-Depth Security:** Stateless JWT tokens stored strictly in encrypted `HttpOnly` cookies, preventing XSS and script-based token exfiltration.
- **Relational Integrity:** PostgreSQL database managed via Prisma ORM with foreign-key constraints, cascading deletions, and performance indexes.
- **Centralized State & Automated Caching:** Redux Toolkit with RTK Query managing optimistic UI updates, tag invalidations (`Auth`, `Project`, `Task`, `Dashboard`), and normalized caching.
- **Enterprise SaaS Design:** Polished Indigo visual identity, responsive layouts, micro-interactions, modal forms, and real-time dashboard metrics.

---

## 🔐 JWT Authentication & Security Architecture

The application implements a robust, stateless **JSON Web Token (JWT)** authentication system adhering to OWASP web security standards.

### 1. Why JWT & HttpOnly Cookies?

Traditional single-page applications often store tokens in `localStorage` or `sessionStorage`. This introduces severe vulnerabilities:
- **XSS Vulnerability:** Any Cross-Site Scripting (XSS) vulnerability or rogue third-party dependency can access `window.localStorage` and steal user session tokens.
- **Token Invalidation:** Local storage tokens cannot be safely invalidated from the server side without complex token blacklists.

**Our Implementation:**
Tokens are issued by the backend upon successful credential verification and transmitted inside an **`HttpOnly` cookie** named `token`.
- **`HttpOnly: true`**: JavaScript running in the browser cannot read, inspect, or modify the cookie (`document.cookie` returns nothing regarding auth).
- **`SameSite: lax` (or `strict` in production)**: Protects against Cross-Site Request Forgery (CSRF) by preventing the browser from attaching the cookie to cross-origin requests.
- **`Secure: true` (in production)**: Enforces transmission strictly over TLS/HTTPS encrypted connections.
- **`Max-Age: 7 days`**: Matches the JWT expiration window.

```
┌─────────────────┐                                      ┌─────────────────┐
│     Client      │                                      │  Express API    │
│  (Next.js App)  │                                      │    (Backend)    │
└────────┬────────┘                                      └────────┬────────┘
         │                                                        │
         │  1. POST /api/auth/login { email, password }          │
         │───────────────────────────────────────────────────────>│
         │                                                        │ 2. Find user &
         │                                                        │    verify bcrypt hash
         │                                                        │ 3. Sign JWT with
         │                                                        │    JWT_SECRET & {id, email}
         │  4. Set-Cookie: token=<jwt>; HttpOnly; SameSite; Path  │
         │     Response: 200 OK { success: true, user: {...} }    │
         │<───────────────────────────────────────────────────────│
         │                                                        │
         │  5. GET /api/projects (Cookie sent automatically)      │
         │───────────────────────────────────────────────────────>│
         │                                                        │ 6. auth.middleware reads
         │                                                        │    req.cookies.token
         │                                                        │ 7. jwt.verify(token, secret)
         │                                                        │ 8. Attach req.user = user
         │  9. Response: 200 OK { projects: [...] }               │
         │<───────────────────────────────────────────────────────│
```

### 2. Token Structure & Payload

The JWT is signed using the HMAC-SHA256 algorithm with a cryptographically secure `JWT_SECRET`. The payload contains minimal non-sensitive identity claims:

```json
{
  "id": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
  "email": "user@example.com",
  "iat": 1794896400,
  "exp": 1795501200
}
```

- **`id`**: Unique UUID of the user in PostgreSQL. Used for zero-trust query filtering.
- **`email`**: User's verified email address.
- **`iat`**: Issued-at UNIX timestamp.
- **`exp`**: Expiration UNIX timestamp (configured via `JWT_EXPIRES_IN`, defaulting to `7d`).

### 3. Password Security with bcrypt

- Passwords are never stored in plaintext.
- During registration (`POST /api/auth/register`), passwords are salted and hashed using **`bcrypt`** with **10 salt rounds**.
- During login (`POST /api/auth/login`), the entered password is compared against the database hash using constant-time evaluation (`bcrypt.compare`) to mitigate timing attacks.

### 4. Authentication Middleware (`auth.middleware.ts`)

Every protected API route executes the `authenticateToken` middleware:
1. **Extraction:** Retrieves the token from `req.cookies.token` (or fallback `Authorization: Bearer <token>` header for external API consumers).
2. **Presence Verification:** Returns `401 Unauthorized` if no token is found.
3. **Cryptographic Verification:** Verifies token integrity and expiration using `jwt.verify(token, env.JWT_SECRET)`. If tampered with or expired, returns `401 Unauthorized`.
4. **Database Resolution:** Fetches the active user profile (`id`, `name`, `email`, `createdAt`) from PostgreSQL using Prisma. If the user was deleted, access is denied.
5. **Context Augmentation:** Injects `req.user` into the Express `Request` object for downstream controllers and services.

### 5. Session Lifecycle Management

- **Login (`POST /api/auth/login`):** Validates credentials, issues JWT, sets `Set-Cookie: token=...`, returns user object to Redux.
- **Session Restoration (`GET /api/auth/me`):** When the browser loads or refreshes, `AuthInitializer` dispatches `/api/auth/me`. If the cookie is valid, Redux restores user state seamlessly without requiring re-login.
- **Logout (`POST /api/auth/logout`):** The server issues a cookie-clearing header (`res.clearCookie('token')`), destroying the session. Redux state is purged.

---

## 📡 REST API Endpoint Reference

The backend provides a comprehensive, RESTful API organized by functional modules. All API routes are prefixed with `/api`.

### Summary Table

| Method | Endpoint | Description | Auth Required | Success Status |
| :--- | :--- | :--- | :---: | :---: |
| **AUTH** | | | | |
| `POST` | `/api/auth/register` | Register a new user account & set session cookie | ❌ Public | `201 Created` |
| `POST` | `/api/auth/login` | Authenticate user credentials & set session cookie | ❌ Public | `200 OK` |
| `POST` | `/api/auth/logout` | Clear session cookie & terminate authentication | ❌ Public | `200 OK` |
| `GET` | `/api/auth/me` | Retrieve active authenticated session & user profile | ✅ Protected | `200 OK` |
| **PROJECTS** | | | | |
| `POST` | `/api/projects` | Create a new project workspace for user | ✅ Protected | `201 Created` |
| `GET` | `/api/projects` | Retrieve all projects owned by the user (with task counts) | ✅ Protected | `200 OK` |
| `GET` | `/api/projects/:id` | Retrieve single project details with all child tasks | ✅ Protected | `200 OK` |
| `PATCH` | `/api/projects/:id` | Update project title or description | ✅ Protected | `200 OK` |
| `DELETE` | `/api/projects/:id` | Delete project and cascade-delete all its tasks | ✅ Protected | `200 OK` |
| **TASKS** | | | | |
| `POST` | `/api/projects/:projectId/tasks` | Create a new task within a specified project | ✅ Protected | `201 Created` |
| `GET` | `/api/projects/:projectId/tasks` | Retrieve project tasks with filtering & sorting | ✅ Protected | `200 OK` |
| `GET` | `/api/tasks/:id` | Retrieve individual task details by task ID | ✅ Protected | `200 OK` |
| `PATCH` | `/api/tasks/:id` | Update task title, description, status, or due date | ✅ Protected | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Permanently delete a task | ✅ Protected | `200 OK` |
| **DASHBOARD** | | | | |
| `GET` | `/api/dashboard` | Aggregated analytics, KPIs, completion rate & recent items | ✅ Protected | `200 OK` |
| **SYSTEM** | | | | |
| `GET` | `/api/health` | Health check, PostgreSQL ping & uptime monitoring | ❌ Public | `200 OK` |

---

### Detailed Endpoint Documentation

#### 1. Authentication Endpoints (`/api/auth`)

##### `POST /api/auth/register`
Creates a new user record, hashes password, signs JWT, and sets `token` HttpOnly cookie.

- **Request Body:**
  ```json
  {
    "name": "Alex Morgan",
    "email": "alex@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Validation Rules (Zod):**
  - `name`: String, minimum 2 characters.
  - `email`: Valid email format, normalized to lowercase.
  - `password`: String, minimum 6 characters.
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "c4d3b6f1-7a2e-4e31-89d5-1c58f0b72c91",
      "name": "Alex Morgan",
      "email": "alex@example.com",
      "createdAt": "2026-11-17T10:00:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Validation failure.
  - `409 Conflict`: Email already registered.

---

##### `POST /api/auth/login`
Verifies email and password, signs JWT, and sets `token` HttpOnly cookie.

- **Request Body:**
  ```json
  {
    "email": "alex@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "c4d3b6f1-7a2e-4e31-89d5-1c58f0b72c91",
      "name": "Alex Morgan",
      "email": "alex@example.com",
      "createdAt": "2026-11-17T10:00:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Missing credentials.
  - `401 Unauthorized`: Invalid email or incorrect password.

---

##### `POST /api/auth/logout`
Destroys the session by clearing the `token` cookie.

- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

---

##### `GET /api/auth/me`
Restores the user session from the incoming `token` cookie. Protected by `authenticateToken`.

- **Headers:** `Cookie: token=<jwt>`
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "user": {
      "id": "c4d3b6f1-7a2e-4e31-89d5-1c58f0b72c91",
      "name": "Alex Morgan",
      "email": "alex@example.com",
      "createdAt": "2026-11-17T10:00:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: Missing, expired, or invalid cookie.

---

#### 2. Project Management Endpoints (`/api/projects`)

All project endpoints require valid authentication. Data isolation guarantees users can only access their own projects.

##### `POST /api/projects`
Creates a new project owned by the authenticated user.

- **Request Body:**
  ```json
  {
    "title": "Mobile App Redesign",
    "description": "Complete UI/UX overhaul of iOS and Android applications"
  }
  ```
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Project created successfully",
    "project": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "userId": "c4d3b6f1-7a2e-4e31-89d5-1c58f0b72c91",
      "title": "Mobile App Redesign",
      "description": "Complete UI/UX overhaul of iOS and Android applications",
      "createdAt": "2026-11-17T10:15:00.000Z",
      "updatedAt": "2026-11-17T10:15:00.000Z",
      "_count": { "tasks": 0 }
    }
  }
  ```

---

##### `GET /api/projects`
Retrieves all projects owned by the authenticated user, ordered by `createdAt DESC`. Includes aggregate count of associated tasks.

- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "projects": [
      {
        "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        "userId": "c4d3b6f1-7a2e-4e31-89d5-1c58f0b72c91",
        "title": "Mobile App Redesign",
        "description": "Complete UI/UX overhaul of iOS and Android applications",
        "createdAt": "2026-11-17T10:15:00.000Z",
        "updatedAt": "2026-11-17T10:15:00.000Z",
        "_count": { "tasks": 4 }
      }
    ]
  }
  ```

---

##### `GET /api/projects/:id`
Retrieves project details by ID, along with its complete list of tasks and task counts grouped by status.

- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "project": {
      "id": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "userId": "c4d3b6f1-7a2e-4e31-89d5-1c58f0b72c91",
      "title": "Mobile App Redesign",
      "description": "Complete UI/UX overhaul of iOS and Android applications",
      "createdAt": "2026-11-17T10:15:00.000Z",
      "updatedAt": "2026-11-17T10:15:00.000Z",
      "tasks": [
        {
          "id": "t1a2b3c4-0000-0000-0000-111122223333",
          "projectId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
          "title": "Design Figma Wireframes",
          "description": "Create high-fidelity mockups for navigation flow",
          "status": "DONE",
          "dueDate": "2026-11-20T00:00:00.000Z",
          "createdAt": "2026-11-17T10:20:00.000Z",
          "updatedAt": "2026-11-17T10:30:00.000Z"
        }
      ],
      "_count": { "tasks": 1 }
    }
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Project does not exist or belongs to another user.

---

##### `PATCH /api/projects/:id`
Updates title or description of a user's project.

- **Request Body (Partial):**
  ```json
  {
    "title": "Mobile App Redesign v2",
    "description": "Updated roadmap for 2027 delivery"
  }
  ```
- **Success Response (`200 OK`):** Returns the updated project object.

---

##### `DELETE /api/projects/:id`
Deletes the project. Cascades to automatically delete all associated tasks via PostgreSQL foreign key constraint.

- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Project and associated tasks deleted successfully"
  }
  ```

---

#### 3. Task Management Endpoints (`/api/projects/:projectId/tasks` & `/api/tasks/:id`)

Tasks belong to a specific project. All task operations enforce that the parent project belongs to the authenticated user.

##### `POST /api/projects/:projectId/tasks`
Creates a task inside the specified project.

- **URL Parameter:** `projectId` (UUID)
- **Request Body:**
  ```json
  {
    "title": "Implement OAuth2 Login Flow",
    "description": "Add Google and GitHub social login buttons",
    "status": "TODO",
    "dueDate": "2026-11-25T18:00:00.000Z"
  }
  ```
- **Task Statuses Allowed:** `TODO` (default), `IN_PROGRESS`, `DONE`.
- **Success Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "task": {
      "id": "9f8e7d6c-5b4a-3210-fedc-ba9876543210",
      "projectId": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "title": "Implement OAuth2 Login Flow",
      "description": "Add Google and GitHub social login buttons",
      "status": "TODO",
      "dueDate": "2026-11-25T18:00:00.000Z",
      "createdAt": "2026-11-17T10:45:00.000Z",
      "updatedAt": "2026-11-17T10:45:00.000Z"
    }
  }
  ```

---

##### `GET /api/projects/:projectId/tasks`
Retrieves tasks for a project with optional query filtering and sorting.

- **Query Parameters:**
  - `status`: Optional filter (`ALL`, `TODO`, `IN_PROGRESS`, `DONE`).
  - `sortBy`: Optional sort field (`createdAt`, `dueDate`, `title`, `status`). Default: `createdAt`.
  - `sortOrder`: Sort direction (`asc`, `desc`). Default: `desc`.
- **Example Request:** `GET /api/projects/a1b2c3d4.../tasks?status=IN_PROGRESS&sortBy=dueDate&sortOrder=asc`
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "tasks": [ ... ],
    "counts": {
      "total": 5,
      "todo": 2,
      "inProgress": 2,
      "done": 1
    }
  }
  ```

---

##### `GET /api/tasks/:id`
Retrieves a single task by its UUID.

- **Success Response (`200 OK`):** Returns task object.
- **Error Response:** `404 Not Found` if task does not exist or user is unauthorized.

---

##### `PATCH /api/tasks/:id`
Updates task details, moves tasks between workflow statuses (`TODO` → `IN_PROGRESS` → `DONE`), or updates due dates.

- **Request Body (Any subset):**
  ```json
  {
    "status": "IN_PROGRESS",
    "dueDate": "2026-11-28T00:00:00.000Z"
  }
  ```
- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "task": { ... }
  }
  ```

---

##### `DELETE /api/tasks/:id`
Deletes the specified task.

- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Task deleted successfully"
  }
  ```

---

#### 4. Dashboard Analytics Endpoint (`/api/dashboard`)

##### `GET /api/dashboard`
Computes real-time aggregated metrics across all projects and tasks owned by the authenticated user in a single optimized transaction.

- **Success Response (`200 OK`):**
  ```json
  {
    "success": true,
    "stats": {
      "totalProjects": 6,
      "totalTasks": 24,
      "todoTasks": 8,
      "inProgressTasks": 6,
      "doneTasks": 10,
      "completionRate": 42
    },
    "recentProjects": [
      {
        "id": "a1b2c3d4-...",
        "title": "Mobile App Redesign",
        "description": "Complete UI/UX overhaul",
        "createdAt": "2026-11-17T10:15:00.000Z",
        "_count": { "tasks": 4 }
      }
    ],
    "recentTasks": [
      {
        "id": "9f8e7d6c-...",
        "title": "Implement OAuth2 Login Flow",
        "status": "IN_PROGRESS",
        "dueDate": "2026-11-25T18:00:00.000Z",
        "createdAt": "2026-11-17T10:45:00.000Z",
        "project": {
          "id": "a1b2c3d4-...",
          "title": "Mobile App Redesign"
        }
      }
    ]
  }
  ```

---

#### 5. Health & Monitoring Endpoint (`/api/health`)

##### `GET /api/health`
Public liveness and database probe for container orchestrators, load balancers, and uptime monitors.

- **Success Response (`200 OK`):**
  ```json
  {
    "status": "ok",
    "uptime": 1420.52,
    "timestamp": "2026-11-17T11:00:00.000Z",
    "database": "connected"
  }
  ```

---

## 🛠️ Complete Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | 15.1.7 | Server & Client Components, file-based routing |
| **UI Library** | React | 18.3.1 | Component-based reactive interfaces |
| **Language** | TypeScript | 5.7.x | Strict end-to-end type safety |
| **State Management** | Redux Toolkit | 2.5.x | Centralized client state & slices |
| **Data Fetching / Cache**| RTK Query | 2.5.x | Declarative queries, automatic tag invalidation, caching |
| **Styling & Design** | Tailwind CSS | 3.4.x | Utility-first styling with custom Indigo SaaS tokens |
| **Iconography** | Lucide React | 0.475.x | Modern SVG icon system |
| **Backend Framework** | Express.js | 4.21.x | REST API server & middleware routing |
| **Runtime** | Node.js | >= 18.x (tested on 26.x) | High-performance asynchronous execution |
| **Database** | PostgreSQL | >= 14.x | Relational ACID database |
| **ORM** | Prisma ORM | 6.4.x | Type-safe migrations, queries & schema modeling |
| **Validation** | Zod | 3.24.x | Runtime request body & environment variable validation |
| **Authentication** | jsonwebtoken | 9.0.x | HMAC-SHA256 stateless token signing & verification |
| **Password Security** | bcrypt | 5.1.x | Secure password hashing (10 salt rounds) |
| **Cookie Parsing** | cookie-parser | 1.4.x | Express HttpOnly cookie parsing middleware |

---

## 🗄️ Database Architecture & Prisma Schema

The PostgreSQL database is managed via Prisma ORM (`backend/prisma/schema.prisma`).

```mermaid
erDiagram
    USER ||--o{ PROJECT : "owns (1:N)"
    PROJECT ||--o{ TASK : "contains (1:N)"

    USER {
        string id PK "cuid/uuid"
        string name
        string email UK
        string password "bcrypt hash"
        datetime createdAt
        datetime updatedAt
    }

    PROJECT {
        string id PK "uuid"
        string userId FK "References User.id (CASCADE)"
        string title
        string description
        datetime createdAt
        datetime updatedAt
    }

    TASK {
        string id PK "uuid"
        string projectId FK "References Project.id (CASCADE)"
        string title
        string description
        enum status "TODO | IN_PROGRESS | DONE"
        datetime dueDate
        datetime createdAt
        datetime updatedAt
    }
```

### Relational Integrity & Performance Rules
1. **User → Project Cascade:** When a user account is deleted, all their projects are automatically removed (`onDelete: Cascade`).
2. **Project → Task Cascade:** When a project is deleted, all associated tasks are automatically purged (`onDelete: Cascade`), preventing orphaned database records.
3. **Database Indexes:**
   - `User.email`: Unique B-Tree index for $O(1)$ authentication lookups.
   - `Project.userId`: Index for instant project filtering by owner.
   - `Task.projectId`: Index for fast project-task relational queries.
   - `Task.status`: Index for high-speed status filtering (`TODO`, `IN_PROGRESS`, `DONE`).
   - `Task.dueDate`: Index for chronological sort and overdue detection.

---

## 🎨 Frontend Architecture & SaaS Design System

### 1. State Management & RTK Query Cache Invalidation

The frontend utilizes Redux Toolkit and RTK Query (`frontend/src/store/api/baseApi.ts`) with tag-based cache management:

- **Tags:** `['Auth', 'Project', 'Task', 'Dashboard']`
- **Cache Lifecycle:**
  - Creating, updating, or deleting a Project invalidates `['Project', 'Dashboard']`.
  - Creating, moving, or deleting a Task invalidates `['Task', 'Project', 'Dashboard']`.
  - The dashboard metrics and project cards instantly update across the application without manual page reloading.

### 2. Design System Tokens (Indigo Palette)

The UI was redesigned into an executive-grade SaaS dashboard utilizing an Indigo color hierarchy:

- **Primary Accent:** `indigo-600` (`#4F46E5`), `indigo-700` (`#4338CA`), `indigo-500` (`#6366F1`)
- **Dashboard Sidebar:** Dark Navy with soft Indigo accent highlights (`bg-[#0B0F19]`, `border-indigo-950/40`)
- **Topbar & Header:** Clean white with subtle border separation (`border-slate-200/80`)
- **Metric Cards:** Dual-tone soft gradient backgrounds (`from-indigo-50/50 to-white`, `from-emerald-50/50`, `from-amber-50/50`)
- **Typography:** Inter font family with crisp optical sizing, deliberate font weights (`font-semibold`, `font-bold`), and tabular numerals.

---

## 🏗️ Monorepo Directory Structure

```
Mini Project Management System/
│
├── frontend/                         # Next.js 15 Application
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── layout.tsx            # Global layout with Redux Provider & AuthInitializer
│   │   │   ├── page.tsx              # Clean public SaaS landing page
│   │   │   ├── login/page.tsx        # Login page wrapper
│   │   │   ├── login/LoginForm.tsx   # Login client form with RTK Query
│   │   │   ├── signup/page.tsx       # Signup page wrapper
│   │   │   ├── signup/SignupForm.tsx # Signup client form
│   │   │   ├── dashboard/page.tsx    # Dashboard server component
│   │   │   ├── dashboard/DashboardContent.tsx # Premium SaaS Dashboard view
│   │   │   └── projects/             # Projects module (Listing & Details)
│   │   ├── components/               # Reusable UI components
│   │   │   ├── auth/                 # AuthInitializer & route protection guards
│   │   │   ├── layout/               # Topbar, Sidebar, SaaS Navigation
│   │   │   ├── projects/             # Project cards, creation modals, delete dialogs
│   │   │   └── tasks/                # Task cards, badges, filter bar, modals
│   │   ├── features/                 # RTK Query APIs & Redux slices
│   │   │   ├── auth/                 # authApi, authSlice, authTypes
│   │   │   ├── projects/             # projectApi, projectSlice, projectTypes
│   │   │   └── tasks/                # taskApi, taskSlice, taskTypes
│   │   └── store/                    # Central Redux store & baseApi
│   ├── package.json
│   └── tailwind.config.ts
│
├── backend/                          # Express.js REST API
│   ├── prisma/
│   │   └── schema.prisma             # PostgreSQL schema definition
│   ├── src/
│   │   ├── config/                   # Prisma database client & Zod env validation
│   │   ├── controllers/              # Auth, Project, Task, Dashboard, Health controllers
│   │   ├── middlewares/              # JWT auth, centralized error, 404 handler
│   │   ├── routes/                   # Modular route declarations
│   │   ├── services/                 # Core business logic & database queries
│   │   ├── utils/                    # JWT generator, bcrypt helpers, HttpError class
│   │   ├── validators/               # Zod validation schemas
│   │   ├── app.ts                    # Express application setup & middleware stack
│   │   └── server.ts                 # Server entry point & graceful shutdown
│   ├── package.json
│   └── tsconfig.json
│
├── scripts/                          # Utility & build scripts
│   └── generate-pdf.js               # Node.js PDF documentation generator
│
├── Mini_Project_Manager_Documentation.pdf # Complete PDF Documentation
├── package.json                      # Monorepo root scripts
└── README.md                         # This file
```

---

## ⚙️ Environment Configuration

### 1. Backend (`backend/.env`)

Create `backend/.env` with the following parameters:

```env
# Server Port
PORT=5000

# Environment Mode
NODE_ENV=development

# PostgreSQL Connection String
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mini_project_manager?schema=public"

# JWT Secret Key (Generate a secure random string for production)
JWT_SECRET="super-secure-jwt-secret-key-at-least-32-chars-long"

# JWT Expiration Window
JWT_EXPIRES_IN="7d"

# Cookie Expiration in Days
COOKIE_EXPIRES_IN_DAYS=7

# Allowed Frontend URL for CORS
FRONTEND_URL="http://localhost:3000"
```

### 2. Frontend (`frontend/.env.local`)

Create `frontend/.env.local`:

```env
# Backend REST API Base URL
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

## 🚀 Installation & Running Guide

### 1. Install Dependencies

Install all root, backend, and frontend dependencies:

```bash
# Monorepo root command
npm run install:all
```

Or install in each directory individually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Database & Run Migrations

Ensure your PostgreSQL instance is running and the database specified in `DATABASE_URL` is accessible:

```bash
# Generate Prisma Client
npm --prefix backend run prisma:generate

# Execute Database Migrations
npm --prefix backend run prisma:migrate
```

### 3. Start the Development Servers

Start the backend and frontend in separate terminals:

```bash
# Terminal 1 — Start Backend Express API (Runs on http://localhost:5000)
npm run dev:backend

# Terminal 2 — Start Frontend Next.js App (Runs on http://localhost:3000)
npm run dev:frontend
```

Open your browser and navigate to:
- **Application URL:** [http://localhost:3000](http://localhost:3000)
- **Backend API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 4. Production Build & Verification

```bash
# Build backend TypeScript
npm run build:backend

# Build frontend Next.js App
npm run build:frontend
```

---

## 📄 PDF Documentation

A complete, formatted PDF version of this documentation is available in the root repository directory:

- **PDF File:** [Mini_Project_Manager_Documentation.pdf](file:///c:/Users/kushk/OneDrive/Desktop/Mini%20Project%20Management%20System/Mini_Project_Manager_Documentation.pdf)
- **Generator Script:** `scripts/generate-pdf.js`

To regenerate the PDF at any time using Node.js:

```bash
node scripts/generate-pdf.js
```

---

## 📜 License

This project is licensed under the MIT License. Developed for enterprise project management workflows.
