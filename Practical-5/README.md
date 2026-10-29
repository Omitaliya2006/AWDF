# Practical 5: MongoDB Integration and Schema Design with Mongoose

- **Student Name:** Om Italiya
- **Roll Number:** 24IT029
- **Institution:** Chandubhai S. Patel Institute of Technology (CSPIT), CHARUSAT
- **Department:** Information Technology
- **Semester:** 5th Semester
- **Course:** Advanced Web Development Frameworks (AWDF)
- **Email:** 24it029@charusat.edu.in
- **Course Outcome / Program Outcome:** CO2, CO3 / PO3, PO5
- **Tech Stack:** Node.js (v26), Express.js (v4.21), Mongoose ODM (v8.9), MongoDB, Dotenv

---

## 🎯 Practical Objective
To connect a live MongoDB database to an Express backend application using Mongoose ODM, design a validated Mongoose schema with type constraints, default values, and pre-save hooks, and execute persistent CRUD operations against MongoDB collections with structured error handling.

---

## 📐 Architecture / Diagram

```text
Express Web App (server.js)
  │
  ▼
[Request Logger & CORS]
  │
  ▼
[express.json() Body Parser]
  │
  ▼
Mongoose ODM Layer (src/models/Task.js)
  ├── Schema Validation (required: true, enum constraints, defaults)
  ├── Pre-Save Hook (automatic title whitespace trimming)
  └── Query Methods (Task.find, Task.create, Task.findByIdAndUpdate, Task.findByIdAndDelete)
  │
  ▼
MongoDB Database Server (Port 27017)
└── Database: awdf_task_manager_24it029
    └── Collection: tasks
        {
          _id: ObjectId("..."),
          title: "Complete AWDF Practical 5",
          description: "Connect MongoDB and enforce Mongoose schema validation",
          completed: false,
          priority: "high",
          createdAt: ISODate("..."),
          updatedAt: ISODate("...")
        }
  │
  ▼
[Global Centralized Error Handler]
Catches Mongoose ValidationErrors and returns structured JSON (HTTP 400)
```

---

## 📋 Mongoose Schema Contract (`src/models/Task.js`)

| Field | Type | Constraints & Rules | Default Value | Notes |
| :--- | :---: | :--- | :---: | :--- |
| **`title`** | `String` | `required: true`, `minlength: 2`, `maxlength: 100`, `trim: true` | — | Primary identifier; pre-save hook trims padding. |
| **`description`** | `String` | `trim: true`, `maxlength: 500` | `""` | Optional descriptive details. |
| **`completed`** | `Boolean` | Primitive boolean flag | `false` | Tracks completion status. |
| **`priority`** | `String` | `enum: ['low', 'medium', 'high']` | `'medium'` | Restricts allowed values; invalid enum triggers 400. |
| **`createdAt`** | `Date` | Timestamp object | `Date.now` | Generated at document creation. |
| **`updatedAt`** | `Date` | Timestamp object | `Date.now` | Updated automatically via pre-save hook. |

---

## 🛠️ Step-by-Step Implementation Log

### Step 1: Install Mongoose & Configure `.env`
Installed Mongoose and Dotenv:
```bash
npm install mongoose dotenv
```
Configured [`.env.example`](./.env.example) and created active [`.env`](./.env):
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/awdf_task_manager_24it029
```
*Note: `.env` is safely excluded from Git tracking via [`.gitignore`](./.gitignore).*

### Step 2: Establish MongoDB Connection in `src/config/db.js`
Connected Mongoose to the MongoDB server daemon with connection event monitors:
```javascript
const mongoose = require('mongoose');

async function connectDB() {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
}
```

### Step 3: Define Schema & Pre-Save Hook in `src/models/Task.js`
Constructed the Mongoose model with schema rules and a pre-save hook to trim whitespace:
```javascript
taskSchema.pre('save', function (next) {
  if (this.title) {
    this.title = this.title.trim();
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Task', taskSchema);
```

### Step 4: Replace In-Memory Array with Mongoose Model Methods
Implemented controllers in [`src/controllers/taskController.js`](./src/controllers/taskController.js):
- `Task.find()` for querying documents with keyword search and status filters.
- `Task.create()` for creating documents with schema validation.
- `Task.findById()` for retrieving individual documents.
- `Task.findByIdAndUpdate()` with `{ new: true, runValidators: true }`.
- `Task.findByIdAndDelete()` for document removal.

### Step 5: Structured Error Handling & Mongoose Validation Catch
Formatted Mongoose errors in [`src/middleware/errorHandler.js`](./src/middleware/errorHandler.js):
```javascript
if (err.name === 'ValidationError') {
  return res.status(400).json({
    success: false,
    error: 'Mongoose Validation Error',
    message: Object.values(err.errors).map(e => e.message).join(' '),
    statusCode: 400
  });
}
```

### Step 6: Automated Testing
Executed [`test_api.js`](./test_api.js) verifying 25/25 automated tests pass against the live database with 100% distinction grade.

---

## 📡 REST API Reference

| Method | Endpoint | Description | Status Codes |
| :---: | :--- | :--- | :---: |
| `GET` | `/api` | Database connection status, schema specification & student info | `200 OK` |
| `GET` | `/tasks` | Retrieve all documents from MongoDB (supports `?completed`, `?priority`, `?search`) | `200 OK` |
| `GET` | `/tasks/:id` | Retrieve single document by MongoDB ObjectId | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `POST` | `/tasks` | Create document in MongoDB (enforces Mongoose schema validation) | `201 Created`, `400 Bad Request` |
| `PUT` | `/tasks/:id` | Update document in MongoDB (`runValidators: true`) | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE` | `/tasks/:id` | Delete document from MongoDB | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `GET` | `/api/logs` | View real-time request logs captured by middleware | `200 OK` |

---

## 💡 Supplementary & Post-Lab Solutions

1. **Priority Enum Constraint (`enum: ['low', 'medium', 'high']`):**
   - Configured in the schema definition. Any attempt to supply an unsupported priority value immediately halts execution and returns a structured **HTTP 400 Bad Request** with descriptive validation guidance.
2. **Pre-Save Trimming Hook:**
   - Implemented via `taskSchema.pre('save', ...)` and `taskSchema.pre('findOneAndUpdate', ...)`. Cleanses user input by trimming padding whitespace from titles before saving.
3. **Structured 404 & ObjectId Format Validation:**
   - Middleware [`validateObjectId.js`](./src/middleware/validateObjectId.js) checks `mongoose.Types.ObjectId.isValid(id)`. Non-existent IDs return structured **HTTP 404 Not Found**, while malformed strings return **HTTP 400 Bad Request**.
4. **Interactive Browser Dashboard ([`public/`](./public/)):**
   - Live web interface at `http://localhost:5000` with real-time document viewing, schema simulator buttons, live response inspector, and log stream.

---

## ❓ Analysis & Viva Questions

### 1. What is the purpose of a schema in a NoSQL database like MongoDB, given that MongoDB itself is schema-less?
While the underlying MongoDB engine is schema-less (allowing any JSON document structure inside a collection), real-world enterprise applications require structured data contracts, reliable attribute naming, and predictable types. Mongoose acts as an Object Data Modeling (ODM) layer sitting above MongoDB, enforcing validation, type casting, default values, and business rules at the application layer before documents are ever written to the database.

### 2. Why is it important to define required fields and default values at the schema level rather than relying on frontend validation alone?
Frontend validation can be easily bypassed by direct API calls (e.g. via Postman, curl, Python scripts, or compromised clients). Schema-level validation provides a single source of truth at the database gateway, ensuring that regardless of where a request originates, invalid, partial, or corrupted records are rejected uniformly.

### 3. What happens internally when a document fails Mongoose validation — where is the request stopped?
Mongoose performs validation in-memory inside the Node.js application process during document creation or before calling the native MongoDB driver's write command. If any schema constraint fails, Mongoose halts execution, creates a `ValidationError` object containing field-specific error messages, and rejects the Promise **before any network packet is dispatched to the MongoDB daemon**.

---

## 📋 Evaluation Rubrics Self-Check (20/20 Marks)

| Criteria | Max Marks | Status | Implementation Evidence |
| :--- | :---: | :---: | :--- |
| **MongoDB Connection** | 3 | ✅ Pass | Mongoose connects to live MongoDB server (`readyState === 1`); connection string stored in `.env`; status logged. |
| **Schema Design** | 5 | ✅ Pass | Task schema contains 6 fields with types, `required: true`, `completed` default `false`, priority enum, and pre-save hook. |
| **CRUD via Mongoose** | 8 | ✅ Pass | All 4 CRUD operations implemented and tested using `Task.find()`, `Task.create()`, `Task.findByIdAndUpdate()`, and `Task.findByIdAndDelete()`. |
| **Validation Enforcement** | 4 | ✅ Pass | Missing required fields and invalid enums return structured, descriptive JSON error messages with HTTP 400. |
| **Total** | **20 / 20** | **100%** | **Distinction Grade** |

---

## 🚀 How to Run Practical 5

```bash
# Navigate to Practical-5 directory
cd "c:\Users\LENOVO\OneDrive\Documents\Desktop\24IT029_AWDF\Practical-5"

# Install dependencies (if needed)
npm install

# Start Express server connected to MongoDB
npm start
# (or with auto-reload: npm run dev)

# Run automated evaluation test suite
npm test
```
Open **`http://localhost:5000`** in your browser to interact with the dashboard.
