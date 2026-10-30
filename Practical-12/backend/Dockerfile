# Practical 11: Backend Dockerfile
# Base Image: Lightweight Node.js 18 on Alpine Linux
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies inside the container environment
RUN npm install --omit=dev

# Copy application source code into the container
COPY . .

# Inform Docker that the container listens on port 5000
EXPOSE 5000

# Container entry command
CMD ["node", "server.js"]
