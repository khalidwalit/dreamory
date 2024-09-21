# Use Node.js 20
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose the backend port
EXPOSE 5001

# Start the application
CMD ["npm", "start"]
