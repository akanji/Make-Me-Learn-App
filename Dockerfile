# Use a Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Example production deployment step
RUN npm run build
ENV PORT=8080
EXPOSE 8080

# Use preview or a static server instead of 'npm run dev'
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "8080"]
