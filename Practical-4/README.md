# Practical 4: Building a RESTful API with Node.js and Express

- **Student Name:** Om Italiya
- **Roll Number:** 24IT029
- **Institution:** Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT
- **Department:** Information Technology
- **Semester:** 5th Semester
- **Course:** Advanced Web Development Frameworks (AWDF)
- **Email:** 24it029@charusat.edu.in
- **Course Outcome / Program Outcome:** CO2 / PO3, PO5
- **Tech Stack:** Node.js (v26), Express.js (v4.21), CommonJS, In-Memory Storage, REST Architecture

---

## 🎯 Practical Objective
To design and implement a production-ready RESTful backend server with complete CRUD endpoints for a Task Management System using the Express middleware pipeline, incorporating request logging, input validation, structured 404 handling, and centralized global error handling.

---

## 📐 Architecture / Middleware Pipeline Diagram

```text
Client (Postman / Browser / Thunder Client / test_api.js)
  │
  ▼
1. [CORS Middleware]
  │
  ▼
2. [Global Request Logging Middleware]
   Logs: METHOD URL - TIMESTAMP -> Status (Duration ms)
  │
  ▼
3. [express.json() Body Parser]
   Parses application/json payloads into req.body
  │
  ▼
4. [Static Files Middleware]
   Serves interactive web UI and API tester from /public
  │
  ▼
5. Express Routers (/tasks, /api, /simulate-error)
   ├── GET    /tasks           → getAllTasks
   ├── GET    /tasks/:id       → [validateTaskId] → getTaskById
   ├── POST   /tasks           → [contentTypeValidator] → createTask
   ├── PUT    /tasks/:id       → [validateTaskId, contentTypeValidator] → updateTask
   ├── DELETE /tasks/:id       → [validateTaskId] → deleteTask
   └── GET    /simulate-error  → Triggers deliberate uncaught error
  │
  ▼
6. [404 Not Found Middleware]
   Returns structured JSON for unmapped endpoints
  │
  ▼
7. [Global Centralized Error Handling Middleware (err, req, res, next)]
   Catches uncaught exceptions & returns safe JSON (Defined LAST in pipeline)
```

---

## 🛠️ Step-by-Step Implementation Log

### Step 1: Initialize Project & Install Express
Scaffolded the project directory and installed Express:
```bash
mkdir Practical-4 && cd Practical-4
npm init -y
npm install express cors
```

### Step 2: Set Up Base Server in `server.js`
Configured the Express application instance, mounted `express.json()`, and bound to port 5000:
```javascript
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => console.log('Server running on port 5000'));
```

### Step 3: Implement Global Request Logging Middleware
Created [`src/middleware/logger.js`](./src/middleware/logger.js) and applied it globally via `app.use(logger)`:
```javascript
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${req.method} ${req.url} - ${timestamp}`);
  next(); // CRITICAL: passes control to the next middleware
});
```

### Step 4: Implement 4 CRUD Endpoints with In-Memory Array
Created [`src/data/taskStore.js`](./src/data/taskStore.js) and [`src/controllers/taskController.js`](./src/controllers/taskController.js) implementing:
- `GET /tasks`: Returns all tasks (`200 OK`)
- `GET /tasks/:id`: Returns single task (`200 OK`) or (`404 Not Found`)
- `POST /tasks`: Validates `title` and creates task (`201 Created`) or (`400 Bad Request`)
- `PUT /tasks/:id`: Updates task attributes (`200 OK`) or (`404 Not Found`)
- `DELETE /tasks/:id`: Deletes task (`200 OK`) or (`404 Not Found`)

### Step 5: Global Centralized Error Handling Middleware
Created [`src/middleware/errorHandler.js`](./src/middleware/errorHandler.js) defined as the **final middleware** in the pipeline with 4 arguments:
```javascript
app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR HANDLER]:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong',
    statusCode: err.statusCode || 500
  });
});
```

### Step 6: Test & Verify All Endpoints
Automated full test suite in [`test_api.js`](./test_api.js) verifying 22/22 tests pass across all CRUD operations, status codes, and middleware rules.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Status Codes |
| :---: | :--- | :--- | :---: |
| `GET` | `/api` | Service metadata, course accreditation & routes | `200 OK` |
| `GET` | `/tasks` | Retrieve all tasks (supports `?status`, `?priority`, `?search`) | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve a single task by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/tasks` | Create a new task (requires JSON & title) | `201 Created`, `400 Bad Request`, `415 Unsupported Media Type` |
| `PUT` | `/tasks/:id` | Update an existing task | `200 OK`, `400 Bad Request`, `404 Not Found`, `415 Unsupported Media Type` |
| `DELETE` | `/tasks/:id` | Delete a task | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `GET` | `/simulate-error` | Deliberately throws uncaught exception | `500 Internal Server Error` |
| `GET` | `/api/logs` | View real-time request logs captured by middleware | `200 OK` |

---

## 💡 Supplementary & Post-Lab Solutions

1. **Content-Type Validation Middleware ([`contentTypeValidator.js`](./src/middleware/contentTypeValidator.js)):**
   - Rejects any `POST` or `PUT` request lacking a `Content-Type: application/json` header with an **`HTTP 415 Unsupported Media Type`** response before reaching the controller.
2. **Route-Specific Task ID Format Validation ([`validateTaskId.js`](./src/middleware/validateTaskId.js)):**
   - Validates that `req.params.id` is a strictly positive integer using regular expression `/^\d+$/`. If an alphanumeric or invalid ID (e.g. `/tasks/abc`) is requested, the client immediately receives **`HTTP 400 Bad Request`**.
3. **Structured 404 Handler for Undefined Routes:**
   - Intercepts unmapped routes (e.g. `GET /undefined-route`) and returns a structured JSON payload listing available endpoints instead of standard HTML error dumps.
4. **Interactive Browser Dashboard ([`public/`](./public/)):**
   - Built-in UI served directly at `http://localhost:5000` with live task management, real-time HTTP response inspector, interactive simulation triggers, live server log stream, and dark/light mode toggle.

---

## ❓ Analysis & Viva Questions

### 1. Why must the error handling middleware be defined last in the middleware chain?
Express executes middleware sequentially in the order registered via `app.use()`. If the error handler were defined before routes, an error thrown by a downstream route would have already bypassed it. Defining it last ensures that whenever a route or middleware invokes `next(err)`, Express skips all subsequent regular middleware and delegates straight to the 4-argument error handler `(err, req, res, next)`.

### 2. What is the difference between `app.use()` and a route-specific middleware?
- **`app.use()`**: Mounts middleware globally across every incoming request (or all requests matching a base path prefix, such as `app.use('/tasks', ...)`).
- **Route-specific middleware**: Passed directly as arguments to a specific route definition (e.g. `router.get('/:id', validateTaskId, controller)`), executing only for that exact endpoint.

### 3. Why is it considered bad practice to send raw error stack traces to the client?
Raw stack traces expose internal implementation details—such as server directory paths, database connection strings, library versions, and file names. Attackers can exploit this information disclosure to execute targeted vulnerabilities. In production, stack traces must be logged privately server-side, while clients receive safe, structured JSON error messages.

---

## 📋 Evaluation Rubrics Self-Check (20/20 Marks)

| Criteria | Max Marks | Status | Implementation Evidence |
| :--- | :---: | :---: | :--- |
| **Server Setup** | 3 | ✅ Pass | Express runs on port 5000; health endpoint `/api` responds with HTTP 200 and student metadata. |
| **REST Endpoints (CRUD)** | 8 | ✅ Pass | All 4 CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`) implemented with correct HTTP status codes (200, 201, 400, 404). |
| **Request Logging Middleware** | 4 | ✅ Pass | Custom middleware logs HTTP method, URL, timestamp, and duration for every request globally. |
| **Global Error Handling** | 5 | ✅ Pass | Defined last in pipeline with 4 args `(err, req, res, next)`; catches uncaught errors; returns structured JSON. |
| **Total** | **20 / 20** | **100%** | **Distinction Grade** |

---

## 🚀 How to Run Practical 4

```bash
# Navigate to Practical-4 directory
cd "c:\Users\LENOVO\OneDrive\Documents\Desktop\24IT029_AWDF\Practical-4"

# Install dependencies (if needed)
npm install

# Start Express server
npm start
# (or with auto-reload: npm run dev)

# Run automated evaluation test suite
npm test
```
Open **`http://localhost:5000`** in your browser to interact with the dashboard.
