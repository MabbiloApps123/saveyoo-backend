# Runtime (production) layer
FROM node:16-alpine

WORKDIR /app

# Copy dependencies files
COPY package*.json ./
RUN npm install --force

# Copy source files
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build
# Expose application port
EXPOSE 3000
# Start application
CMD ["npm", "run", "start:dev"]
