import React, { useState } from 'react';
import './VivaGuideModal.css';

const VIVA_QA = [
  {
    q: '1. Why does the backend container need to reference the MongoDB container by its service name (e.g., mongodb) rather than localhost?',
    a: `Each Docker container runs inside its own isolated network namespace with its own loopback interface (localhost / 127.0.0.1).
• If the backend container attempts to connect to "mongodb://localhost:27017", it is looking for MongoDB running inside the backend container itself, where no database exists!
• In Docker Compose, all services attached to a user-defined bridge network (app-network) share Docker's built-in internal DNS resolver.
• Docker automatically assigns the service name defined in docker-compose.yml ("mongodb") as the container's hostname. Therefore, connecting to "mongodb://mongodb:27017/taskdb" correctly routes traffic across the virtual bridge network to the MongoDB container.`
  },
  {
    q: '2. What is the difference between EXPOSE in a Dockerfile and the ports mapping in docker-compose.yml?',
    a: `• EXPOSE 5000 (Dockerfile): Acts as metadata and documentation informing humans and container engines that the container listens on port 5000 at runtime. It does NOT publish or bind the port to the host machine's external network interfaces.
• ports: ["5000:5000"] (docker-compose.yml): Actually creates a port-forwarding rule (using iptables / Docker proxy) mapping port 5000 of the host machine to port 5000 of the container. This makes the service accessible from the host browser at http://localhost:5000.`
  },
  {
    q: '3. Why is it considered bad practice to copy node_modules into a Docker image instead of running npm install inside the container?',
    a: `1. Binary Incompatibilities: Host machines often run macOS or Windows on x86_64/ARM, whereas production Docker images typically run Linux (e.g. Alpine Linux). Native C++ modules compiled on the host will fail or crash inside Linux containers.
2. Build Context Bloat: Local node_modules can be hundreds of megabytes. Copying it across the Docker daemon socket drastically slows down build time.
3. Architecture Mismatch: Running "RUN npm install" inside the container guarantees modules are built specifically for the container's OS, kernel, and libc (musl/glibc).
That is why .dockerignore must always exclude node_modules.`
  },
  {
    q: '4. What is the benefit of a multi-stage Docker build for the React frontend?',
    a: `A multi-stage build separates the build environment from the runtime environment:
• Stage 1 (Build): Uses Node.js with all devDependencies (Vite, Rollup, Babel, compilers ~400MB) to produce the static production dist/ bundle.
• Stage 2 (Runner): Discards the heavy build environment and copies only the lightweight production bundle (~500KB) into a clean, minimal container image.
• Result: Reduces final image size by 70% - 90%, reduces container attack surface, and speeds up deployment transfers.`
  },
  {
    q: '5. How does a named volume (mongo-data) guarantee data persistence across container restarts?',
    a: `Containers are ephemeral by default: when a container is removed (docker-compose down or container crash), its writable layer is destroyed and all data is lost.
• A named volume (e.g. mongo-data:/data/db) creates a managed directory stored directly on the host machine filesystem, independent of any container lifecycle.
• When the MongoDB container restarts or is rebuilt, Docker re-mounts the existing volume to /data/db, ensuring zero data loss across restarts.`
  },
  {
    q: '6. What does docker-compose up --build execute in a single command?',
    a: `Executing "docker-compose up --build":
1. Reads docker-compose.yml and builds both Dockerfiles (frontend and backend) using their cached or fresh layers.
2. Creates the named bridge network (app-network) and named volume (mongo-data).
3. Respects dependency ordering (depends_on: mongodb -> backend -> frontend).
4. Launches all 3 containers with the specified port bindings and environment variables in parallel, eliminating manual startup steps.`
  }
];

export default function VivaGuideModal({ isOpen, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container viva-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-box">
            <span className="header-icon">🎓</span>
            <div>
              <h3>Practical 11 Oral Viva & Docker Defense Guide</h3>
              <p className="header-sub">Dockerfiles, Compose Orchestration, Networking DNS, and Volumes</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="viva-modal-body">
          <div className="viva-tabs">
            {VIVA_QA.map((item, idx) => (
              <button
                key={idx}
                className={`viva-tab-btn ${activeIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                Q{idx + 1}: {item.q.split('?')[0].replace(/^\d+\.\s*/, '').slice(0, 36)}...
              </button>
            ))}
          </div>

          <div className="viva-content-box">
            <h4 className="viva-question">{VIVA_QA[activeIdx].q}</h4>
            <div className="viva-answer">
              {VIVA_QA[activeIdx].a.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <span className="footer-meta">Prepared by Om Italiya (24IT029) • AWDF Lab</span>
          <button className="btn-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
