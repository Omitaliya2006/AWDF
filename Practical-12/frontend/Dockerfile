# Practical 11: Frontend Multi-Stage Dockerfile
# Stage 1: Build Stage (compiles React 19 SPA)
FROM node:18-alpine AS build

WORKDIR /app

# Copy dependency manifests first for build caching
COPY package*.json ./
RUN npm install

# Copy source code and produce optimized production bundle
COPY . .
RUN npm run build

# Stage 2: Production Serve Stage (Multi-stage build eliminates devDependencies and source code)
FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# Copy only the compiled dist assets from the build stage
COPY --from=build /app/dist ./dist

# Expose Vite preview port 5173
EXPOSE 5173

# Serve production assets with host binding for Docker networking
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
