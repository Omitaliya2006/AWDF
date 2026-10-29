# AWDF - Advanced Web Development Frameworks

- **Student Name:** Om Italiya
- **Roll Number:** 24IT029
- **Institution:** Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT
- **Department:** Information Technology
- **Semester:** 5th Semester
- **Email:** 24it029@charusat.edu.in

---

## 📚 Practical Index

| Practical No. | Title | Tech Stack | Status | Directory |
| :---: | :--- | :--- | :---: | :--- |
| **Practical 1** | Introduction to React and Component Architecture (Student Portfolio) | React 19, Vite, Modular CSS | ✅ Completed | [Practical-1](./Practical-1) |
| **Practical 2** | State Management and Routing in React (Multi-Page SPA) | React 19, React Router v7, useState | ✅ Completed | [Practical-2](./Practical-2) |
| **Practical 3** | REST API Integration & Data Rendering in React | React 19, GitHub REST API, useEffect | ✅ Completed | [Practical-3](./Practical-3) |
| **Practical 4** | Building a RESTful API with Node.js and Express | Node.js, Express.js, Middleware Pipeline | ✅ Completed | [Practical-4](./Practical-4) |
| **Practical 5** | MongoDB Integration and Schema Design with Mongoose | Node.js, Express, MongoDB, Mongoose ODM | ✅ Completed | [Practical-5](./Practical-5) |
| **Practical 6** | Full Stack Integration (React + Node.js/Express + MongoDB) | React 19, Vite, Express, MongoDB, Mongoose | ✅ Completed | [Practical-6](./Practical-6) |
| **Practical 7** | Authentication and Middleware Pipeline | Node.js, Express, JWT, bcryptjs, React 19 | ✅ Completed | [Practical-7](./Practical-7) |
| **Practical 8** | Performance Optimization and Lazy Loading in React | React 19, Vite, React.lazy, Suspense | ✅ Completed | [Practical-8](./Practical-8) |
| **Practical 9** | In-Memory Caching and Query Optimization | Node.js, Express, node-cache, MongoDB, React 19 | ✅ Completed | [Practical-9](./Practical-9) |

---

## 🚀 Practical 1 Overview
- **Objective:** Set up a React development environment using Vite and build a modular, reusable student portfolio UI.
- **Key Features:**
  - Component Architecture: `Header`, `About`, `Skills`, `Projects`, `Footer`, `NavBar`
  - Unidirectional Data Flow via Props
  - Dynamic array rendering with `.map()` in `Skills.jsx`
  - 3 Featured Projects: MediSlip, HRMS, House Price Predictor
  - Dynamic Props Controller Playground for real-time reactivity testing

---

## 🧭 Practical 2 Overview
- **Objective:** Implement client-side multi-page routing with `react-router-dom` and reactive state management using `useState`.
- **Key Features:**
  - Multi-page navigation: `/` (Home), `/projects` (Projects), `/contact` (Contact), `*` (Custom 404 Error page)
  - Seamless SPA route transitions with `NavLink` (no full page reloads)
  - Controlled form inputs bound to `useState` with real-time character counter and live state mirror
  - Reactive UI visibility toggles: Dark/Light mode theme toggle, help modal, project architecture modal, and viva guide

---

## 🌐 Practical 3 Overview
- **Objective:** Master asynchronous operations in React using `useEffect`, consume the live GitHub REST API, and handle `loading`, `error`, and `data` states with graceful fallbacks.
- **Key Features:**
  - RESTful Data Fetching: Fetches GitHub profile and public repositories concurrently using `fetch()` and `Promise.all` inside `useEffect`
  - Lifecycle State Management: Dynamic `<Spinner />` for `loading`, `<ErrorMessage />` with retry mechanism for `error`, and `<RepoCard />` grid for `data`
  - Clean Side-Effect Cleanup: Prevents memory leaks and race conditions using `AbortController`
  - Supplementary Work: Dynamic username search with presets (`Omitaliya2006`, `facebook`, `vitejs`), live state monitor HUD, language filter dropdown, sorting options, API Inspector, and Viva Guide

---

## ⚡ Practical 4 Overview
- **Objective:** Design and implement a RESTful backend server with complete CRUD endpoints using Express middleware pipeline for a Task Management System.
- **Key Features:**
  - Middleware Pipeline Architecture: Sequential execution with CORS, request logger, JSON parser, static file server, routes, 404 handler, and global error handler
  - Complete REST CRUD Endpoints: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id` with in-memory array storage
  - Custom Request Logger: Applied globally to log method, URL, timestamp, and duration for every request
  - Global Centralized Error Handler: 4-parameter `(err, req, res, next)` middleware defined last in pipeline to catch unhandled errors without crashing the server
  - Supplementary Work: `Content-Type: application/json` validator for POST/PUT (HTTP 415), route-specific task ID format validator (HTTP 400), structured 404 handler for undefined routes, automated 22-test evaluation suite, and interactive browser client dashboard

---

## 🍃 Practical 5 Overview
- **Objective:** Connect a live MongoDB database to an Express server and enforce strict data validation through a Mongoose schema with pre-save hooks and centralized error handling.
- **Key Features:**
  - Live MongoDB Connection: Mongoose connection management to `mongodb://127.0.0.1:27017/awdf_task_manager_24it029` with event logging and `.env` isolation
  - Validated Mongoose Schema: 6 fields (`title`, `description`, `completed`, `priority`, `createdAt`, `updatedAt`) with required constraints and default values
  - Persistent CRUD Methods: Executed via `Task.find()`, `Task.create()`, `Task.findByIdAndUpdate()`, and `Task.findByIdAndDelete()`
  - Pre-Save Hook: Automatically cleanses document inputs by trimming whitespace from titles and refreshing timestamps
  - Validation Enforcement: Transforms Mongoose `ValidationError` and `CastError` into clean, descriptive JSON responses (HTTP 400)
  - Supplementary Work: Priority enum constraint (`['low', 'medium', 'high']`), ObjectId format validator middleware, automated 25-test evaluation suite, and interactive browser client dashboard

---

## 🚀 Practical 6 Overview
- **Objective:** Build an end-to-end full-stack MERN (MongoDB, Express, React, Node.js) web application connecting an interactive React 19 frontend to an Express REST API backend and live MongoDB database.
- **Key Features:**
  - 3-Tier Architecture: Presentation (React 19 + Vite on port 5173), Application Logic (Node/Express on port 5000), Data Layer (MongoDB on port 27017)
  - Full Asynchronous CRUD: Complete Create, Read, Update, Toggle Complete, and Delete operations synchronized across React state and MongoDB documents
  - Modular React Architecture: `Navbar`, `StatsDashboard`, `TaskFilter`, `TaskList`, `TaskItem`, `TaskForm` modal, and `Toast` notifications
  - Robust Backend Pipeline: CORS configuration, request logger middleware with latency tracking, Mongoose schema validation with pre-save trimming hooks, and centralized error handling
  - Advanced HUD & Viva Prep: Real-time network architecture monitor, live HTTP request log stream, Mongoose schema contract viewer, and interactive oral examination viva guide
  - Automated Verification: Comprehensive 29-test evaluation suite (`test_fullstack.js`) verifying 100% distinction grade pass (20/20 marks)

---

## 🔐 Practical 7 Overview
- **Objective:** Implement JWT-based authentication and input validation as part of the Express middleware pipeline for the full-stack Task Management application.
- **Key Features:**
  - User Registration with bcryptjs: Password salted and hashed (10 rounds) before MongoDB storage; passwords never exposed in JSON responses
  - JWT Login Flow: Credentials verified using `bcrypt.compare`; returns signed JWT token with 1-hour expiration; tested via automated test suite
  - Authentication Middleware: Protected task routes inspect `Authorization: Bearer <token>`; rejects missing, malformed, or expired tokens with HTTP 401; sets `req.user`
  - Input Validation Middleware: Enforces 5 strict validation rules (email regex, password length $\ge 6$, name presence, title length $\ge 2$, priority enum); returns structured HTTP 400 Bad Request
  - Error Response Structure: Consistent JSON responses (`success`, `error`, `message`, `statusCode`) with zero stack traces leaked
  - Supplementary Solutions: `/auth/me` user profile endpoint, client-side auto-logout on 401 token expiry, interactive Pipeline HUD with JWT inspector, and automated 37-test evaluation suite (`test_auth.js`) with 100% distinction pass (20/20 marks)

---

## ⚡ Practical 8 Overview
- **Objective:** Improve frontend web application performance using route-based code splitting, `React.lazy()`, `<Suspense>`, and fallback UI to dramatically reduce initial JavaScript bundle size and Time to Interactive (TTI).
- **Key Features:**
  - Route-Based Code Splitting: Dynamically lazy loads all route components (`Home`, `Projects`, `Analytics`, `Contact`, `NotFound`) on demand via `React.lazy(() => import(...))`.
  - Seamless Fallback UI: Global `<Suspense fallback={<PageLoader />}>` boundary displaying an animated spinner, visual layout skeleton, and real-time chunk loading progress bar.
  - Measurable Performance Gains: Initial JavaScript transferred reduced from **358.4 KB** down to **138.2 KB** (a **61.4% reduction**); Time to Interactive on Slow 3G reduced by **71.2%** (from 2.85s to 0.82s).
  - Supplementary Work:
    - Heavy Component Isolation: Dynamic lazy loading for heavy data-visualization (`HeavyChart.jsx`).
    - Network Throttling Simulation: In-app throttle controller (`instant`, `fast3g`, `slow3g`) with minimum delay fallback to prevent loader flickering.
    - Interactive Performance HUD: Live before/after benchmark comparison matrix, chunk waterfall diagram, and React DevTools Profiler audit tab.
    - Oral Viva Examination Guide: 6 curated questions & detailed answers covering code splitting theory, browser network tab profiling, and React Suspense lifecycle.
  - Automated Verification: Comprehensive 34-test evaluation suite (`test_performance.js`) verifying 100% distinction grade pass (20/20 marks).

---

## ⚡ Practical 9 Overview
- **Objective:** Implement server-side in-memory caching using `node-cache` in an Express and MongoDB backend, enforce cache invalidation across write operations to eliminate stale data, and measure the empirical latency impact.
- **Key Features:**
  - Cache-Aside (Lazy Loading) Pipeline: `GET /tasks` checks in-memory `node-cache` first (`all_tasks`); on HIT returns data immediately from RAM (<1ms); on MISS queries MongoDB, saves to cache with 60s TTL, and returns response (~16.5ms).
  - Strict Cache Invalidation: Write operations (`POST`, `PUT`, `DELETE`) automatically trigger `cache.del('all_tasks')` and `cache.del('task_' + id)` to guarantee immediate cache coherence and eliminate stale reads.
  - Empirical Latency Reduction: 5 sample readings demonstrate an empirical latency drop from **16.50 ms** down to **0.84 ms** (a **🔻 94.9% reduction** and **⚡ 19.6x speedup**).
  - Supplementary Work:
    - Single-Task Caching: `GET /tasks/:id` cached independently under `task_<id>`.
    - Live Telemetry & Debug API: `/api/cache/stats` exposing hits, misses, hit rate %, active keys, and invalidations.
    - Automated Empirical Benchmark API: `/api/cache/benchmark` executing high-resolution 5-trial tests.
    - Interactive Cache Monitor HUD & Oral Viva Guide: Real-time cache hit indicator pills, flush button, bypass toggle switch, and 6 curated viva questions & answers.
  - Automated Verification: Comprehensive 39-test evaluation suite (`test_caching.js`) verifying 100% distinction grade pass (20/20 marks).






