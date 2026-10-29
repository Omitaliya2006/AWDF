# Practical 7: Authentication and Middleware Pipeline

- **Student Name:** Om Italiya
- **Roll Number:** 24IT029
- **Institution:** Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT
- **Department:** Information Technology
- **Semester:** 5th Semester
- **Course:** Advanced Web Development Frameworks (AWDF)
- **Course Outcome / Program Outcome:** CO2, CO6 / PO3, PO5
- **Email:** 24it029@charusat.edu.in
- **Tech Stack:** Node.js (v26), Express.js (v4.21), MongoDB, Mongoose ODM (v8.9), bcryptjs (v2.4), jsonwebtoken (v9.0), React 19, Vite, CSS3

---

## 🎯 Practical Objective
To design and implement a secure authentication and authorization pipeline using **JSON Web Tokens (JWT)** and **bcryptjs** password hashing, integrate server-side input validation middleware to reject malformed requests before they reach the database, protect all task CRUD routes via an Express authentication middleware, and build an interactive full-stack client with session lifecycle and token expiry handling.

---

## 📐 Architecture / Middleware Pipeline Diagram

```text
POST /auth/register ───► Validate Input ───► Hash Password (bcrypt 10 rounds) ───► Save User ───► 201 Created + JWT
POST /auth/login    ───► Validate Input ───► Verify Password (bcrypt.compare) ───► Sign JWT ────► 200 OK + JWT
GET  /auth/me       ───► [Auth Middleware] (Verify Token) ───────────────────────► Return User Profile

Protected Route Flow (/tasks):
Client Request (Headers: Authorization: Bearer <token>)
   │
   ▼
1. [CORS Middleware]
   │
   ▼
2. [Request Logger Middleware] (Records method, URL, timestamp, duration)
   │
   ▼
3. [express.json() Body Parser]
   │
   ▼
4. [JWT Authentication Middleware]
   ├── Checks 'Authorization: Bearer <token>' header
   ├── Calls jwt.verify(token, process.env.JWT_SECRET)
   ├── Handles expired / invalid tokens -> HTTP 401 Unauthorized
   └── Populates req.user = decoded
   │
   ▼
5. [Input Validation Middleware]
   ├── Rule 1: Email format regex (/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
   ├── Rule 2: Minimum password length (>= 6 characters)
   ├── Rule 3: Non-empty user name
   ├── Rule 4: Task title presence & minlength (>= 2 characters)
   ├── Rule 5: Priority enum constraint (['low', 'medium', 'high'])
   └── Rejects malformed requests -> HTTP 400 Bad Request
   │
   ▼
6. [Task Controllers (MongoDB / Mongoose)]
   └── Scoped to user ID: Task.find({ user: req.user.id })
   │
   ▼
7. [Global Centralized Error Handler]
   └── Formats clean JSON (HTTP 400, 401, 404, 500) with NO stack traces exposed!
```

---

## 📁 Directory Structure

```text
Practical-7/
├── backend/
│   ├── node_modules/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   ├── authController.js     # User registration, bcrypt hash, JWT login, /me
│   │   │   └── taskController.js     # Task CRUD scoped to req.user.id
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT Bearer token verification
│   │   │   ├── validationMiddleware.js # Input validation rules (email, password, title)
│   │   │   ├── logger.js             # Request logging with duration and user tracking
│   │   │   └── errorHandler.js       # Consistent JSON error handler (no stack traces)
│   │   ├── models/
│   │   │   ├── User.js               # Validated User schema with password hiding
│   │   │   └── Task.js               # Validated Task schema referencing User ObjectId
│   │   └── routes/
│   │       ├── authRoutes.js         # /auth/register, /auth/login, /auth/me
│   │       └── taskRoutes.js         # Protected /tasks routes (authMiddleware applied)
│   ├── .env                          # Local credentials (JWT_SECRET, MONGO_URI)
│   ├── .env.example                  # Environment configuration template
│   ├── package.json                  # Backend dependencies (bcryptjs, jsonwebtoken)
│   └── server.js                     # Express server entry point & pipeline assembly
├── frontend/
│   ├── dist/                         # Vite production build artifacts
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx         # Sign in & Register tabbed modal
│   │   │   ├── AuthModal.css
│   │   │   ├── Navbar.jsx            # User profile pill, logout button, HUD trigger
│   │   │   ├── Navbar.css
│   │   │   ├── PipelineHUD.jsx       # Interactive pipeline diagram & JWT inspector
│   │   │   ├── PipelineHUD.css
│   │   │   ├── StatsDashboard.jsx    # Metric cards for user's tasks
│   │   │   ├── StatsDashboard.css
│   │   │   ├── TaskFilter.jsx        # Search, status pills, priority dropdown
│   │   │   ├── TaskFilter.css
│   │   │   ├── TaskForm.jsx          # Protected task creation & editing modal
│   │   │   ├── TaskForm.css
│   │   │   ├── TaskItem.jsx          # Task card with lock badge & actions
│   │   │   ├── TaskItem.css
│   │   │   ├── TaskList.jsx          # Auth-required card, skeleton loader, list view
│   │   │   ├── TaskList.css
│   │   │   ├── Toast.jsx             # Auto-dismiss notifications
│   │   │   ├── Toast.css
│   │   │   ├── VivaGuideModal.jsx    # Oral exam preparation modal
│   │   │   └── VivaGuideModal.css
│   │   ├── services/
│   │   │   └── api.js                # Authenticated client (attaches Bearer token, 401 handling)
│   │   ├── App.jsx                   # Central state management & view assembly
│   │   ├── App.css
│   │   ├── index.css                 # Global theme styling
│   │   └── main.jsx                  # React 19 root bootstrap
│   ├── index.html                    # HTML5 shell with Google Fonts
│   ├── package.json                  # Frontend dependencies
│   └── vite.config.js                # Vite build configuration
├── .gitignore                        # Git exclusion rules (.env excluded)
├── package.json                      # Workspace scripts
├── test_auth.js                      # Automated 37-test evaluation suite
└── README.md                         # Comprehensive documentation
```

---

## 🛠️ Step-by-Step Implementation Log

### Step 1: Install Dependencies & Configure `.env`
Installed authentication packages:
```bash
npm install bcryptjs jsonwebtoken express mongoose cors dotenv
```
Created [`.env.example`](./backend/.env.example) and configured active [`.env`](./backend/.env):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/awdf_auth_taskmanager_24it029
JWT_SECRET=awdf_jwt_secret_key_24it029_secure_random_token_2026
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
```
*Note: `.env` is safely excluded from Git tracking via [`.gitignore`](./.gitignore).*

### Step 2: Create User & Task Mongoose Models
- **[`User.js`](./backend/src/models/User.js):**
  - Fields: `name`, `email` (unique, lowercase, regex-validated), `password` (hashed string), `role` (`'user' | 'admin'`).
  - `toJSON` transform: Automatically deletes `password` and `__v` from all JSON responses to prevent credential exposure.
- **[`Task.js`](./backend/src/models/Task.js):**
  - Fields: `title`, `description`, `completed`, `priority` (`'low' | 'medium' | 'high'`), and `user` (ObjectId referencing `User`, `required: true`).
  - Includes pre-save hook for title whitespace trimming and timestamp refreshing.

### Step 3: Implement User Registration with bcrypt Hashing
In [`authController.js`](./backend/src/controllers/authController.js):
```javascript
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

const newUser = await User.create({
  name: name.trim(),
  email: email.toLowerCase().trim(),
  password: hashedPassword
});
```
Passwords are salted automatically and hashed before saving to MongoDB. Returns HTTP 201 Created and signed JWT token.

### Step 4: Implement JWT Login Flow
In [`authController.js`](./backend/src/controllers/authController.js):
```javascript
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ success: false, error: 'Unauthorized', message: 'Invalid email or password.' });

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(401).json({ success: false, error: 'Unauthorized', message: 'Invalid email or password.' });

const token = jwt.sign(
  { id: user._id, email: user.email, name: user.name, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);
```

### Step 5: Construct JWT Authentication Middleware
In [`authMiddleware.js`](./backend/src/middleware/authMiddleware.js):
```javascript
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({ success: false, error: 'Unauthorized', message: 'Bearer token missing or malformed.', statusCode: 401 });
}

const token = authHeader.split(' ')[1];
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  return res.status(401).json({ success: false, error: 'Unauthorized', message: err.message, statusCode: 401 });
}
```

### Step 6: Construct Input Validation Middleware
In [`validationMiddleware.js`](./backend/src/middleware/validationMiddleware.js):
- **`validateRegister`:** Validates non-empty name, email matching regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, and password length $\ge 6$.
- **`validateLogin`:** Checks email and password presence.
- **`validateTask`:** Checks task title length $\ge 2$ and priority enum `['low', 'medium', 'high']`.
- Malformed inputs return structured **HTTP 400 Bad Request** before reaching controllers.

### Step 7: Protect Task Routes & User Scoping
In [`taskRoutes.js`](./backend/src/routes/taskRoutes.js):
- Applied `router.use(authMiddleware)` to protect all task endpoints.
- Task controllers restrict operations to the logged-in user:
  `Task.find({ user: req.user.id })`
  `Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })`

### Step 8: Build Interactive React Client with Token Lifecycle
- Attached `Authorization: Bearer <token>` automatically in [`api.js`](./frontend/src/services/api.js).
- Added `setUnauthorizedHandler()`: If any protected request returns HTTP 401 Unauthorized (e.g. token expired), the client clears the token and prompts the user to log in again.
- Developed [`PipelineHUD.jsx`](./frontend/src/components/PipelineHUD.jsx) allowing students and faculty to inspect the decoded JWT token payload, expiration countdown, and live server logs.

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description | Status Codes |
| :---: | :--- | :---: | :--- | :---: |
| `POST` | `/auth/register` | Public | Register new user with bcrypt-hashed password | `201 Created`, `400 Bad Request`, `409 Conflict` |
| `POST` | `/auth/login` | Public | Authenticate credentials and return signed JWT | `200 OK`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/auth/me` | **Protected** | Retrieve currently authenticated user profile | `200 OK`, `401 Unauthorized` |
| `GET` | `/tasks` | **Protected** | Retrieve tasks belonging to logged-in user | `200 OK`, `401 Unauthorized` |
| `POST` | `/tasks` | **Protected** | Create new task scoped to user (validated) | `201 Created`, `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/tasks/:id` | **Protected** | Retrieve specific task document by ID | `200 OK`, `401 Unauthorized`, `404 Not Found` |
| `PUT` | `/tasks/:id` | **Protected** | Update task document (validated) | `200 OK`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `DELETE`| `/tasks/:id` | **Protected** | Delete task document by ID | `200 OK`, `401 Unauthorized`, `404 Not Found` |
| `POST` | `/tasks/seed` | **Protected** | Seed sample tasks for logged-in user | `201 Created`, `401 Unauthorized` |

---

## 🧪 Automated Evaluation Test Suite (`test_auth.js`)

```text
======================================================================
🔐 Running Practical 7: Authentication & Middleware Evaluation Suite
👤 Student: Om Italiya (24IT029) | CSPIT - CHARUSAT
======================================================================

--- SECTION 1: User Registration & bcrypt Hashing (3 Marks) ---
  ✅ [PASS] POST /auth/register returns HTTP 201 Created
  ✅ [PASS] Registration response includes signed JWT token
  ✅ [PASS] Registration returns correct user email
  ✅ [PASS] Password is NOT exposed in registration response
  ✅ [PASS] User document saved in MongoDB database
  ✅ [PASS] Password is NOT stored in plain text
  ✅ [PASS] Password is encrypted using bcrypt hash ($2a$/$2b$)
  ✅ [PASS] Registration with duplicate email returns HTTP 409 Conflict

--- SECTION 2: JWT Login Flow & Credentials Verification (5 Marks) ---
  ✅ [PASS] POST /auth/login returns HTTP 200 OK
  ✅ [PASS] Login returns valid JWT token string
  ✅ [PASS] Password is NOT exposed in login response
  ✅ [PASS] Login with incorrect password returns HTTP 401 Unauthorized
  ✅ [PASS] Login with non-existent email returns HTTP 401 Unauthorized
  ✅ [PASS] GET /auth/me with Bearer token returns HTTP 200 OK
  ✅ [PASS] /auth/me returns currently authenticated user details

--- SECTION 3: Auth Middleware & Protected Routes (5 Marks) ---
  ✅ [PASS] GET /tasks without Authorization header returns HTTP 401 Unauthorized
  ✅ [PASS] GET /tasks with invalid token signature returns HTTP 401 Unauthorized
  ✅ [PASS] Authorization without "Bearer " prefix returns HTTP 401
  ✅ [PASS] GET /tasks with valid Bearer token returns HTTP 200 OK
  ✅ [PASS] POST /tasks with valid JWT returns HTTP 201 Created
  ✅ [PASS] Task document in MongoDB is linked to authenticated user ID
  ✅ [PASS] POST /tasks/seed seeds tasks for logged-in user (HTTP 201)

--- SECTION 4: Input Validation Rules (4 Marks) ---
  ✅ [PASS] Validation Rule 1: Invalid email format rejected with HTTP 400
  ✅ [PASS] Validation Rule 2: Password < 6 characters rejected with HTTP 400
  ✅ [PASS] Validation Rule 3: Missing name rejected with HTTP 400
  ✅ [PASS] Validation Rule 4: Task title < 2 characters rejected with HTTP 400
  ✅ [PASS] Validation Rule 5: Unsupported priority enum rejected with HTTP 400

--- SECTION 5: Error Response Structure & Security (3 Marks) ---
  ✅ [PASS] Error response includes "success: false"
  ✅ [PASS] Error response includes human-readable "message"
  ✅ [PASS] Error response includes "statusCode"
  ✅ [PASS] Security check: No stack trace leaked in 400 response
  ✅ [PASS] Security check: No stack trace leaked in 401 response
  ✅ [PASS] Undefined route triggers structured HTTP 404 handler
  ✅ [PASS] Security check: No stack trace leaked in 404 response

--- SECTION 6: Frontend Build Verification ---
  ✅ [PASS] React production build file "frontend/dist/index.html" exists
  ✅ [PASS] Build index.html contains Practical 7 title metadata
  ✅ [PASS] Build index.html contains roll number 24IT029

======================================================================
📊 EVALUATION SUMMARY: 37 / 37 Checks Passed (100%)
🎉 ALL PRACTICAL 7 RUBRICS VERIFIED SUCCESSFULLY! 20/20 MARKS ACHIEVED
======================================================================
```

---

## ❓ Analysis & Viva Questions

### 1. Why must passwords be hashed before storage instead of saved as plain text, even in a lab/demo project?
Plain text storage violates fundamental security principles. If a database is breached, exposed in logs, or inspected by unauthorized personnel, plain text passwords immediately compromise user accounts across multiple services (due to widespread password reuse).
bcrypt protects against this through:
1. **Automatic Salt Generation:** A unique random cryptographic salt is generated for each password, rendering precomputed rainbow table attacks ineffective.
2. **Adaptive Cost Factor:** bcrypt is deliberately computationally slow (10 rounds = $2^{10} = 1024$ iterations), making high-speed GPU-based brute force cracking mathematically infeasible.

### 2. What does the authentication middleware actually verify, and what happens if the token is missing or expired?
The auth middleware inspects the incoming request headers for `Authorization: Bearer <token>` and invokes `jwt.verify(token, process.env.JWT_SECRET)`:
- **Signature Verification:** Verifies that the token was signed with the server's private secret and that its payload has not been modified.
- **Expiration Check:** Verifies that the current timestamp is less than the `exp` timestamp in the payload.
- **If missing:** The middleware halts the pipeline immediately and returns **HTTP 401 Unauthorized**.
- **If expired or tampered:** `jwt.verify()` throws `TokenExpiredError` or `JsonWebTokenError`. Wrapped in a `try/catch` block, the middleware returns **HTTP 401 Unauthorized** with a clear explanation rather than crashing the Express server.

### 3. Why should input validation happen on the server even if the frontend already validates the same fields?
Frontend validation exists exclusively for user experience (providing instant feedback without waiting for network latency). Because frontend JavaScript executes entirely on the client's machine, it can be bypassed effortlessly using Postman, curl, browser DevTools, or custom scripts. Server-side validation acts as the definitive security perimeter that rejects malformed requests before they consume backend resources or corrupt the database.

---

## 🔧 Troubleshooting Guide

| Symptom | Likely Cause | Fix |
| :--- | :--- | :--- |
| **401 Unauthorized on every request** | Authorization header missing or malformed in Postman/client. | Set header as `Authorization: Bearer <token>` exactly, including the space after `Bearer`. |
| **Server crashes on invalid token** | `jwt.verify()` not wrapped in `try/catch`. | Wrap token verification in `try/catch` and return HTTP 401 on failure instead of letting it throw uncaught. |
| **Login always fails even with correct password** | Comparing plain password to hashed password directly with `===`. | Use `bcrypt.compare(password, user.password)` rather than equality operators. |
| **`JWT_SECRET` is undefined** | `.env` file not loaded or variable name mismatch. | Confirm `require('dotenv').config()` runs before `JWT_SECRET` is accessed and verify variable naming. |

---

## 📋 Evaluation Rubrics Self-Check (20/20 Marks)

| Criteria | Max Marks | Status | Implementation Evidence |
| :--- | :---: | :---: | :--- |
| **User Registration** | 3 | ✅ Pass | Registration endpoint accepts name, email, password; password salted and hashed with bcrypt (10 rounds) before saving to MongoDB. |
| **JWT Login Flow** | 5 | ✅ Pass | Login endpoint validates credentials using `bcrypt.compare`; returns signed JWT token with 1-hour expiry; verified via test harness. |
| **Auth Middleware** | 5 | ✅ Pass | Protected task routes reject missing, invalid, or malformed tokens with HTTP 401; valid token grants access and sets `req.user`. |
| **Input Validation** | 4 | ✅ Pass | 5 validation rules enforced: email regex, password length $\ge 6$, name presence, task title $\ge 2$, priority enum; rejects with HTTP 400. |
| **Error Response Structure** | 3 | ✅ Pass | All errors returned as consistent JSON (`success`, `error`, `message`, `statusCode`); zero stack traces exposed. |
| **Total** | **20 / 20** | **100%** | **Distinction Grade** |

---

## 🚀 How to Run Practical 7

### 1. Start Express Backend
```bash
cd "c:\Users\LENOVO\OneDrive\Documents\Desktop\24IT029_AWDF\Practical-7"
npm run start:backend
```
*Backend runs on `http://localhost:5000` with MongoDB on port 27017.*

### 2. Start React Frontend
In a separate terminal:
```bash
cd "c:\Users\LENOVO\OneDrive\Documents\Desktop\24IT029_AWDF\Practical-7"
npm run start:frontend
```
*Open `http://localhost:5173` in your browser.*

### 3. Run Automated Evaluation Test Suite
```bash
cd "c:\Users\LENOVO\OneDrive\Documents\Desktop\24IT029_AWDF\Practical-7"
npm test
```
*Executes all 37 automated tests verifying 20/20 rubric marks.*
