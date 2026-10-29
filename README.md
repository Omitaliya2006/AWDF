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


