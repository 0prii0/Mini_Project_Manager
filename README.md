# Mini Project Manager

A modern, scalable, full-stack web application designed for managing projects and their associated tasks with granular control, built with clean architecture principles.

---

## 📌 Project Overview

**Mini Project Manager** is developed as a modular monorepo containing independent frontend and backend applications. The platform allows authenticated users to create and manage their own projects and organize tasks under each project with statuses (`TODO`, `IN_PROGRESS`, `DONE`).

### Key Principles
- **Separation of Concerns:** Clear boundary between Next.js frontend client/server layers and Express.js REST API.
- **Strict Typing:** End-to-end TypeScript throughout frontend and backend.
- **Relational Integrity:** PostgreSQL database managed with Prisma ORM, utilizing cascading deletions, foreign key constraints, and performance indexes.
- **Centralized State & Caching:** Redux Toolkit with RTK Query for efficient server-state caching and synchronization.
- **Resilient Error Handling:** Centralized Express middleware and Zod schema validation.
- **Security-First Auth:** JWT stored exclusively in HttpOnly cookies — never in localStorage or JSON response bodies.
- **Strict Resource Ownership:** Backend authorization verifies user ownership on every database operation; users can never access, edit, or delete another user's projects.

---

## ✅ Implementation Progress

| Phase | Status | Description |
| :--- | :--- | :--- |
| **Phase 1** | ✅ Complete | Project Initialization & Architecture Setup |
| **Phase 2** | ✅ Complete | Authentication & Authorization (JWT HttpOnly Cookies) |
| **Phase 3** | ✅ Complete | Project Management (Complete CRUD, Ownership Isolation & UI) |
| **Phase 4** | ✅ Complete | Task Management (Complete CRUD, Status Transitions, Due Dates & UI) |
| **Phase 5** | ✅ Complete | Complete Application Integration & UI Development (AppLayout, Dashboard API, Toasts, Responsive SaaS Shell) |

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) (App Router, React 18), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Redux Toolkit](https://redux-toolkit.js.org/), [RTK Query](https://redux-toolkit.js.org/rtk-query/overview), [Lucide React](https://lucide.dev/) |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [Zod](https://zod.dev/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [cookie-parser](https://github.com/expressjs/cookie-parser) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/) |
| **Architecture** | Monorepo, RESTful API, Feature-based frontend modules |
| **Package Manager** | `npm` |

---

## 🏗️ Project Architecture & Folder Structure

```
mini-project-manager/
│
├── frontend/                     # Next.js Application
│   ├── public/                   # Static assets & robots.txt
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── layout.tsx        # Root layout (Redux Provider + AuthInitializer)
│   │   │   ├── page.tsx          # Homepage (server component)
│   │   │   ├── login/            # Login page
│   │   │   │   ├── page.tsx      # Server component wrapper
│   │   │   │   └── LoginForm.tsx # Client component (form + RTK Query)
│   │   │   ├── signup/           # Signup page
│   │   │   │   ├── page.tsx      # Server component wrapper
│   │   │   │   └── SignupForm.tsx # Client component (form + RTK Query)
│   │   │   ├── dashboard/        # Protected dashboard page
│   │   │   │   ├── page.tsx      # Server component wrapper
│   │   │   │   └── DashboardContent.tsx # Client component (auth guard + stats + recent projects)
│   │   │   └── projects/         # Projects module
│   │   │       ├── page.tsx      # Server component wrapper
│   │   │       ├── ProjectsContent.tsx # Client component (listing, search, filter)
│   │   │       └── [id]/         # Project details page
│   │   │           ├── page.tsx  # Server component wrapper
│   │   │           └── ProjectDetailsContent.tsx # Client component (project details + task management)
│   │   ├── components/           # Reusable UI components
│   │   │   ├── auth/             # Auth-specific components
│   │   │   │   ├── AuthInitializer.tsx  # Restores auth session on page load
│   │   │   │   ├── ProtectedRoute.tsx   # Redirects unauthenticated users to /login
│   │   │   │   └── PublicOnlyRoute.tsx  # Redirects authenticated users to /dashboard
│   │   │   ├── projects/         # Project management components
│   │   │   │   ├── CreateProjectModal.tsx # Reusable modal for creating projects
│   │   │   │   ├── EditProjectModal.tsx   # Modal for editing project title/desc
│   │   │   │   ├── DeleteProjectModal.tsx # Confirmation dialog for project deletion
│   │   │   │   ├── ProjectCard.tsx        # Individual project card with actions
│   │   │   │   └── ProjectSkeleton.tsx    # Loading skeletons for project grids
│   │   │   ├── tasks/            # Task management components (Phase 4)
│   │   │   │   ├── TaskStatusBadge.tsx    # Clean badges for TODO, IN_PROGRESS, DONE
│   │   │   │   ├── TaskDueDateBadge.tsx   # Overdue, Today, Upcoming, and Done badges
│   │   │   │   ├── TaskStatusDropdown.tsx # Inline status switcher dropdown
│   │   │   │   ├── TaskCard.tsx           # Individual task card with actions
│   │   │   │   ├── TaskFilters.tsx        # Status tabs, search, due date & sort dropdowns
│   │   │   │   ├── CreateTaskModal.tsx    # Modal form for creating tasks
│   │   │   │   ├── EditTaskModal.tsx      # Modal form for editing tasks and due dates
│   │   │   │   ├── DeleteTaskDialog.tsx   # Confirmation dialog for task deletion
│   │   │   │   ├── EmptyTasks.tsx         # Empty state for zero tasks or filter empty
│   │   │   │   └── TaskSkeleton.tsx       # Loading skeleton cards for tasks
│   │   │   ├── common/           # Generic widgets
│   │   │   ├── home/             # Homepage-specific components
│   │   │   │   └── AuthHeroActions.tsx  # CTA buttons on homepage
│   │   │   └── layout/           # Shared layout components
│   │   │       └── Navbar.tsx    # Auth-aware navigation bar
│   │   ├── features/             # Feature-sliced modules
│   │   │   ├── auth/             # Authentication feature
│   │   │   │   ├── authTypes.ts  # TypeScript interfaces
│   │   │   │   ├── authSlice.ts  # Redux slice (setCredentials, clearCredentials)
│   │   │   │   ├── authApi.ts    # RTK Query endpoints
│   │   │   │   └── index.ts      # Public exports
│   │   │   ├── projects/         # Project management feature
│   │   │   │   ├── projectTypes.ts # Project, Request & Response interfaces
│   │   │   │   ├── projectApi.ts   # RTK Query endpoints with tag invalidation
│   │   │   │   ├── projectSlice.ts # Redux UI state (search, sorting)
│   │   │   │   └── index.ts        # Public exports
│   │   │   └── tasks/            # Task management feature (Phase 4)
│   │   │       ├── taskTypes.ts  # Task, TaskStatus, TaskCounts, Query & Request interfaces
│   │   │       ├── taskApi.ts    # RTK Query endpoints (getTasks, create, update, delete)
│   │   │       └── index.ts      # Public exports
│   │   ├── store/                # Centralized Redux store
│   │   │   ├── store.ts          # Store configuration (auth, projectsUI, baseApi)
│   │   │   ├── provider.tsx      # Client-side Redux Provider wrapper
│   │   │   └── api/
│   │   │       └── baseApi.ts    # Central RTK Query base API (credentials: include)
│   │   ├── hooks/                # Typed Redux hooks (useAppDispatch, useAppSelector)
│   │   ├── lib/                  # Helper utilities
│   │   └── types/                # Shared TypeScript types & interfaces
│   ├── .env.example              # Environment variables template
│   ├── next.config.mjs           # Next.js configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── tsconfig.json             # Frontend TypeScript configuration
│   └── package.json              # Frontend dependencies and scripts
│
├── backend/                      # Express.js REST API
│   ├── prisma/
│   │   └── schema.prisma         # Prisma data models & PostgreSQL schema
│   ├── src/
│   │   ├── config/               # Environment & database singleton configurations
│   │   │   ├── database.ts       # Prisma Client singleton
│   │   │   └── env.ts            # Zod-validated environment variables
│   │   ├── controllers/          # Request handlers
│   │   │   ├── health.controller.ts
│   │   │   ├── auth.controller.ts    # register, login, getMe, logout
│   │   │   ├── project.controller.ts # create, getProjects, getProjectById, update, delete
│   │   │   └── task.controller.ts    # createTask, getProjectTasks, getTaskById, updateTask, deleteTask
│   │   ├── routes/               # API route definitions
│   │   │   ├── index.ts          # Root API router (/api)
│   │   │   ├── health.routes.ts  # Health check routes (/api/health)
│   │   │   ├── auth.routes.ts    # Auth routes (/api/auth)
│   │   │   ├── project.routes.ts # Project routes (/api/projects, /api/projects/:id/tasks)
│   │   │   └── task.routes.ts    # Task routes (/api/tasks/:id)
│   │   ├── services/             # Business logic layer
│   │   │   ├── auth.service.ts       # User registration, verification, token generation
│   │   │   ├── project.service.ts    # Project CRUD with strict ownership validation
│   │   │   └── task.service.ts       # Task CRUD, status aggregation, filtering & sorting
│   │   ├── validators/           # Zod validation schemas
│   │   │   ├── auth.validator.ts     # Auth schemas
│   │   │   ├── project.validator.ts  # Project schemas
│   │   │   └── task.validator.ts     # Task CRUD, status, date filter & sort schemas
│   │   ├── middlewares/          # Centralized Express middlewares
│   │   │   ├── auth.middleware.ts      # JWT HttpOnly cookie authentication
│   │   │   ├── error.middleware.ts     # Central error handler
│   │   │   └── notFound.middleware.ts  # 404 Route handler
│   │   ├── services/             # Business logic layer
│   │   │   ├── auth.service.ts        # AuthService
│   │   │   └── project.service.ts     # ProjectService (with ownership verification)
│   │   ├── validators/           # Zod schema validation rules
│   │   │   ├── auth.validator.ts      # registerSchema, loginSchema
│   │   │   └── project.validator.ts   # createProjectSchema, updateProjectSchema
│   │   ├── utils/                # Utility and helper functions
│   │   │   ├── jwt.ts                 # generateToken, verifyToken
│   │   │   ├── password.ts            # hashPassword, comparePassword (bcrypt)
│   │   │   └── errors.ts              # HttpError class
│   │   ├── types/
│   │   │   └── express.d.ts           # Express Request augmentation (user field)
│   │   ├── app.ts                # Express application factory & middleware setup
│   │   └── server.ts             # Server entry point & graceful shutdown
│   ├── .env.example              # Backend environment template
│   ├── tsconfig.json             # Backend TypeScript configuration
│   └── package.json              # Backend dependencies and scripts
│
├── .gitignore                    # Git ignore file for monorepo
├── package.json                  # Root monorepo scripts
└── README.md                     # Comprehensive project documentation
```

---

## 📋 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js**: `v18.x` or higher (tested with Node `v26.x`)
- **npm**: `v9.x` or higher (tested with npm `v11.x`)
- **PostgreSQL**: `v14.x` or higher running locally or hosted on cloud (e.g. Supabase, Neon, AWS RDS)

---

## ⚙️ Environment Configuration

### 1. Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

Configure the following variables:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/mini_project_manager?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN=1d
FRONTEND_URL="http://localhost:3000"
```

### 2. Frontend (`frontend/.env.local`)

Copy `frontend/.env.example` to `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

Configure the API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🗄️ Database & Prisma Setup

The Prisma schema (`backend/prisma/schema.prisma`) defines three interconnected models:

- **User**: Authentication and profile data (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`).
- **Project**: User-owned projects (`id`, `userId`, `title`, `description`, `createdAt`, `updatedAt`).
  - Cascades on user deletion (`onDelete: Cascade`).
  - Indexed by `userId`.
- **Task**: Project-specific task items (`id`, `projectId`, `title`, `description`, `status`, `dueDate`, `createdAt`, `updatedAt`).
  - Status enum: `TODO`, `IN_PROGRESS`, `DONE`.
  - Cascades on project deletion (`onDelete: Cascade`).
  - Indexed by `projectId`, `status`, and `dueDate`.

### Database Commands:

```bash
# Generate Prisma Client
npm --prefix backend run prisma:generate

# Run Database Migrations (requires PostgreSQL running with valid DATABASE_URL)
npm --prefix backend run prisma:migrate
```

---

## 🚀 Installation & Running the Application

### 1. Install All Dependencies

From the repository root:

```bash
npm run install:all
```

Or individually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start the Backend API

```bash
npm run dev:backend
```

The Express API will be running at:
- **Base URL:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

### 3. Start the Frontend Application

In a separate terminal:

```bash
npm run dev:frontend
```

The Next.js application will be available at:
- **Frontend URL:** `http://localhost:3000`

---

## 📁 Project Management System (Phase 3)

The Project Management module provides complete CRUD functionality with strict user isolation and ownership verification.

### Endpoints Overview

All endpoints are protected by the JWT authentication middleware (`authenticateToken`).

| Method | Endpoint | Description | Status | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/projects` | Create a new project | `201 Created` | ✅ |
| `GET` | `/api/projects` | Get all projects belonging to user | `200 OK` | ✅ |
| `GET` | `/api/projects/:id` | Get single project by ID | `200 OK` | ✅ |
| `PATCH` | `/api/projects/:id` | Update project title / description | `200 OK` | ✅ |
| `DELETE` | `/api/projects/:id` | Delete project (cascades tasks) | `200 OK` | ✅ |

### Security & Ownership Rules

- **Zero-Trust Client ID:** `userId` is extracted exclusively from `req.user.id` (set by `authenticateToken`). Payloads containing `userId` are rejected or ignored.
- **Strict Query Ownership:** Every `findFirst`, `update`, and `delete` operation includes `where: { id: projectId, userId: authenticatedUserId }`.
- **Cross-User Protection:** If User A attempts to view, update, or delete a project belonging to User B, the backend returns a generic `404 Not Found` to prevent project ID enumeration.

### API Details

#### `POST /api/projects`

Create a new project.

**Request:**
```json
{
  "title": "E-commerce Platform",
  "description": "Full-stack online store with payment processing"
}
```

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "id": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
    "userId": "d748f341-a18d-4f11-9a74-9f79ce1c27bf",
    "title": "E-commerce Platform",
    "description": "Full-stack online store with payment processing",
    "createdAt": "2026-11-17T03:11:45.000Z",
    "updatedAt": "2026-11-17T03:11:45.000Z",
    "_count": { "tasks": 0 }
  }
}
```

#### `GET /api/projects`

Fetch all projects belonging to the authenticated user.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "projects": [
    {
      "id": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
      "userId": "d748f341-a18d-4f11-9a74-9f79ce1c27bf",
      "title": "E-commerce Platform",
      "description": "Full-stack online store with payment processing",
      "createdAt": "2026-11-17T03:11:45.000Z",
      "updatedAt": "2026-11-17T03:11:45.000Z",
      "_count": { "tasks": 0 }
    }
  ]
}
```

#### `GET /api/projects/:id`

Fetch details of a single project.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "project": {
    "id": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
    "userId": "d748f341-a18d-4f11-9a74-9f79ce1c27bf",
    "title": "E-commerce Platform",
    "description": "Full-stack online store with payment processing",
    "createdAt": "2026-11-17T03:11:45.000Z",
    "updatedAt": "2026-11-17T03:11:45.000Z",
    "_count": { "tasks": 0 }
  }
}
```

#### `PATCH /api/projects/:id`

Partial update of project title and/or description.

**Request:**
```json
{
  "title": "Updated E-commerce Platform",
  "description": "Updated project description"
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "project": {
    "id": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
    "userId": "d748f341-a18d-4f11-9a74-9f79ce1c27bf",
    "title": "Updated E-commerce Platform",
    "description": "Updated project description",
    "createdAt": "2026-11-17T03:11:45.000Z",
    "updatedAt": "2026-11-17T03:12:00.000Z"
  }
}
```

#### `DELETE /api/projects/:id`

Delete project and its cascade-related tasks.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

---

## 📋 Task Management Module (Phase 4)

Phase 4 delivers an end-to-end task tracking system with real-time status transitions, due date monitoring, flexible filtering, and database-level ownership isolation.

### Task Data Model

```prisma
model Task {
  id          String     @id @default(uuid())
  projectId   String
  title       String
  description String?
  status      TaskStatus @default(TODO)
  dueDate     DateTime?

  project     Project    @relation(fields: [projectId], references: [id], onDelete: Cascade)

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([projectId])
  @@index([status])
  @@index([dueDate])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

### Task API Endpoints

All task endpoints require authentication via HttpOnly JWT cookie.

#### 1. `POST /api/projects/:projectId/tasks`

Create a new task inside an existing project owned by the authenticated user.

**Request Body:**
```json
{
  "title": "Build User Authentication Flow",
  "description": "Implement JWT HttpOnly cookies and bcrypt hashing",
  "status": "TODO",
  "dueDate": "2026-11-20T00:00:00.000Z"
}
```
*Note: `title` is mandatory (1-200 chars). `description`, `status` (default: `TODO`), and `dueDate` are optional.*

**Success Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "id": "7fa1d293-1996-41f2-95f0-6a7cb8d3c162",
    "projectId": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
    "title": "Build User Authentication Flow",
    "description": "Implement JWT HttpOnly cookies and bcrypt hashing",
    "status": "TODO",
    "dueDate": "2026-11-20T00:00:00.000Z",
    "createdAt": "2026-11-17T03:30:00.000Z",
    "updatedAt": "2026-11-17T03:30:00.000Z"
  }
}
```

#### 2. `GET /api/projects/:projectId/tasks`

Get all tasks for a project with optional filtering, sorting, and aggregated status counts.

**Query Parameters:**
| Parameter | Type | Allowed Values | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `status` | string | `ALL`, `TODO`, `IN_PROGRESS`, `DONE` | `ALL` | Filter by task status |
| `dateFilter` | string | `ALL`, `OVERDUE`, `TODAY`, `UPCOMING` | `ALL` | Preset due date filtering |
| `dueDateFrom` | string | ISO Date / YYYY-MM-DD | — | Custom range start date |
| `dueDateTo` | string | ISO Date / YYYY-MM-DD | — | Custom range end date |
| `sortBy` | string | `dueDate`, `status`, `createdAt`, `title` | `dueDate` | Sorting field (null due dates appear last) |
| `order` | string | `asc`, `desc` | `asc` | Sort direction (`asc`: TODO → IN_PROGRESS → DONE) |

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "7fa1d293-1996-41f2-95f0-6a7cb8d3c162",
      "projectId": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
      "title": "Build User Authentication Flow",
      "description": "Implement JWT HttpOnly cookies and bcrypt hashing",
      "status": "TODO",
      "dueDate": "2026-11-20T00:00:00.000Z",
      "createdAt": "2026-11-17T03:30:00.000Z",
      "updatedAt": "2026-11-17T03:30:00.000Z"
    }
  ],
  "counts": {
    "total": 1,
    "todo": 1,
    "inProgress": 0,
    "done": 0
  }
}
```

#### 3. `GET /api/tasks/:id`

Retrieve details of a single task. Returns `404 Not Found` if the task does not exist or belongs to another user's project.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "task": {
    "id": "7fa1d293-1996-41f2-95f0-6a7cb8d3c162",
    "projectId": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
    "title": "Build User Authentication Flow",
    "description": "Implement JWT HttpOnly cookies and bcrypt hashing",
    "status": "TODO",
    "dueDate": "2026-11-20T00:00:00.000Z",
    "createdAt": "2026-11-17T03:30:00.000Z",
    "updatedAt": "2026-11-17T03:30:00.000Z"
  }
}
```

#### 4. `PATCH /api/tasks/:id`

Update task title, description, status, or due date. Setting `dueDate: null` removes the due date.

**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "dueDate": null
}
```

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "task": {
    "id": "7fa1d293-1996-41f2-95f0-6a7cb8d3c162",
    "projectId": "e9b2512f-6831-4ce8-b5b0-dfb65cf11f93",
    "title": "Build User Authentication Flow",
    "description": "Implement JWT HttpOnly cookies and bcrypt hashing",
    "status": "IN_PROGRESS",
    "dueDate": null,
    "createdAt": "2026-11-17T03:30:00.000Z",
    "updatedAt": "2026-11-17T03:35:00.000Z"
  }
}
```

#### 5. `DELETE /api/tasks/:id`

Delete a task permanently.

**Success Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## 🧪 Phase 4 Automated Verification & Test Suite

All 20 Phase 4 test cases were executed and passed against the live PostgreSQL database:

| # | Test Scenario | Verified Behavior | Result |
| :--- | :--- | :--- | :--- |
| 1 | Create task with valid data | Successfully created in project | ✅ PASS (201 Created) |
| 2 | Reject task without title | Schema validation catches missing title | ✅ PASS (400 Bad Request) |
| 3 | Reject task with empty title | Validation catches empty string | ✅ PASS (400 Bad Request) |
| 4 | Get all tasks with status counts | Returns tasks array & counts (`total`, `todo`, `inProgress`, `done`) | ✅ PASS (200 OK) |
| 5 | Get single task by ID | Returns task object | ✅ PASS (200 OK) |
| 6 | Change task status to IN_PROGRESS | Updates status cleanly | ✅ PASS (200 OK) |
| 7 | Change task status to DONE | Updates status cleanly | ✅ PASS (200 OK) |
| 8 | Update task description | Updates description without affecting other fields | ✅ PASS (200 OK) |
| 9 | Nullify / clear due date | Sets `dueDate` to `null` in PostgreSQL | ✅ PASS (200 OK) |
| 10 | Reject empty PATCH request | Rejects update with no fields | ✅ PASS (400 Bad Request) |
| 11 | Filter tasks by status (`TODO`) | Only returns TODO tasks | ✅ PASS (200 OK) |
| 12 | Filter tasks by date (`OVERDUE`) | Only returns past-due, incomplete tasks | ✅ PASS (200 OK) |
| 13 | Filter tasks by date (`UPCOMING`) | Only returns future-due tasks | ✅ PASS (200 OK) |
| 14 | Sort tasks by `dueDate` `asc` | Null due dates correctly placed last | ✅ PASS (200 OK) |
| 15 | Sort tasks by `status` `asc` | Ordered strictly: `TODO` → `IN_PROGRESS` → `DONE` | ✅ PASS (200 OK) |
| 16 | Reject unauthenticated task access | Protected by JWT HttpOnly auth middleware | ✅ PASS (401 Unauthorized) |
| 17 | Prevent User B from creating task in User A's project | Ownership check on parent project blocks access | ✅ PASS (404 Not Found) |
| 18 | Prevent User B from listing User A's tasks | Ownership check on parent project blocks access | ✅ PASS (404 Not Found) |
| 19 | Prevent User B from updating User A's task | Direct ownership verification blocks access | ✅ PASS (404 Not Found) |
| 20 | Prevent User B from deleting User A's task | Direct ownership verification blocks access | ✅ PASS (404 Not Found) |

---

## 🔐 Authentication System (Phase 2)

The authentication system uses **JWT stored in HttpOnly cookies** — the token is never exposed to JavaScript, localStorage, or the JSON response body.

### Security Architecture

| Feature | Implementation |
| :--- | :--- |
| **Password hashing** | bcrypt with 12 salt rounds |
| **Token transport** | HttpOnly cookie (not `Authorization` header, not localStorage) |
| **Cookie config** | `httpOnly: true`, `sameSite: lax`, `secure: true` in production |
| **Token expiry** | Configurable via `JWT_EXPIRES_IN` env variable (default: `1d`) |
| **Validation** | Zod schemas on all auth endpoints |
| **Email** | Normalized to lowercase and trimmed on registration & login |
| **Session restore** | `GET /api/auth/me` called on app load by `AuthInitializer` |

### Auth API Endpoints

- `POST /api/auth/register` — Register a new user account (201 Created)
- `POST /api/auth/login` — Login and receive HttpOnly cookie (200 OK)
- `GET /api/auth/me` — Retrieve current authenticated user (200 OK)
- `POST /api/auth/logout` — Clear auth cookie (200 OK)

---

## 🧪 Automated Verification & Postman Tests

All 17 Phase 3 test cases were executed and passed against live PostgreSQL database:

| # | Test Case | Result |
| :--- | :--- | :--- |
| 1 | Create project with valid data | ✅ PASS (201 Created) |
| 2 | Create project without title | ✅ PASS (400 Bad Request) |
| 3 | Create project with empty title | ✅ PASS (400 Bad Request) |
| 4 | Get all projects for authenticated user | ✅ PASS (200 OK) |
| 4b | User B sees 0 projects (Isolation) | ✅ PASS (200 OK, empty array) |
| 5 | Get single existing project | ✅ PASS (200 OK) |
| 6 | Get invalid project ID format | ✅ PASS (400 Bad Request) |
| 7 | Update project title | ✅ PASS (200 OK) |
| 8 | Update project description | ✅ PASS (200 OK) |
| 9 | Update both fields | ✅ PASS (200 OK) |
| 10 | Send empty PATCH request | ✅ PASS (400 Bad Request) |
| 11 | Access API without authentication | ✅ PASS (401 Unauthorized) |
| 12 | User B cannot access User A's project | ✅ PASS (404 Not Found) |
| 13 | User B cannot update User A's project | ✅ PASS (404 Not Found) |
| 14 | User B cannot delete User A's project | ✅ PASS (404 Not Found) |
| 15 | User A deletes own project | ✅ PASS (200 OK) |
| 16 | Deleted project removed from database | ✅ PASS (Verified in PostgreSQL) |

---

## 🎨 Application Integration & UI Shell (Phase 5)

Phase 5 establishes a complete, cohesive SaaS experience with a unified layout, live backend dashboard metrics, toast notifications, and responsive navigation across all viewports.

### 1. Global Application Layout (`AppLayout`)
- **Desktop Sidebar (`Sidebar.tsx`):** 256px wide sticky navigation with active link highlighting, logo, quick links, user profile pill, and one-click Sign Out.
- **Mobile Navigation Drawer (`MobileSidebar.tsx`):** Responsive slide-over drawer with backdrop blur, keyboard accessibility (`Esc` to close), and scroll locking.
- **Top Application Header (`Header.tsx`):** Dynamic page title, mobile toggle hamburger, dynamic breadcrumb trail, and user account dropdown.
- **Dynamic Breadcrumbs (`Breadcrumbs.tsx`):** Automatically computed trail with home icon and contextual route links.

### 2. Live Dashboard API (`GET /api/dashboard`)
- Authenticated endpoint returning real-time metrics for the authenticated user only:
  - **Aggregated Statistics:** `totalProjects`, `totalTasks`, `todoTasks`, `inProgressTasks`, `doneTasks`, `completionRate` (percentage).
  - **Recent Projects:** 5 most recently updated workspaces with associated task counts.
  - **Recent Tasks:** 5 most recently active tasks across all user projects, including project name, status badge, and due date.
  - **Task Status Overview:** Dynamic visual distribution bar showing exact task progression.
  - **Quick Shortcuts:** Instant modal triggers for "+ Create Project" and direct navigation to all workspaces.

### 3. Reusable UI Components & Toast System
- **Toast Notifications (`ToastProvider` & `useToast()`):** Instant feedback for project creation/edits/deletions, task status changes, logins, and logouts.
- **Unified Modals & Dialogs:** Standardized `CreateProjectModal`, `EditProjectModal`, `DeleteProjectModal`, `CreateTaskModal`, `EditTaskModal`, `DeleteTaskDialog`.
- **Status & Due Date Badges:** Color-coded badges for statuses (`TODO`, `IN_PROGRESS`, `DONE`) and deadline urgency (`OVERDUE`, `DUE TODAY`, `UPCOMING`).

---

## 📦 Build & Run Commands

Verify production builds for both frontend and backend:

```bash
# Build both services
npm run build

# Build backend independently (TypeScript compile)
npm run build:backend

# Build frontend independently (Next.js production build)
npm run build:frontend
```
