# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Copy the .env file
COPY .env .

# Expose the port Render expects (default: 5000)
EXPOSE 5000

# Command to start the app
CMD ["node", "server.js"]