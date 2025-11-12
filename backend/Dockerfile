# Backend API Server Dockerfile
# Includes Python for code execution

FROM node:20-alpine

# Install Python and required packages
RUN apk add --no-cache \
    python3 \
    py3-pip \
    && ln -sf python3 /usr/bin/python

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create temp directory for code execution
RUN mkdir -p temp && chmod 777 temp

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the application
CMD ["npm", "start"]
