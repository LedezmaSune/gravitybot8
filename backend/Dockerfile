FROM node:20-bullseye-slim

# Install wait-for or other minimal required packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose backend port
EXPOSE 3001

CMD ["npm", "start"]
