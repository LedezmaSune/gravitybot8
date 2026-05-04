FROM node:20-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm install

COPY . .

# Compile nextjs for production performance
RUN npm run build

# Expose Next.js default port
EXPOSE 8000

ENV PORT=8000

CMD ["npm", "start"]
