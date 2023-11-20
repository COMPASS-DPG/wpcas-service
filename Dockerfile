
# Use the official Node.js 18 image as a base
FROM node:18.16.1-alpine

# Install bash for debugging purposes (optional)
RUN apk add --no-cache bash

# Install global Node.js packages for NestJS development
RUN npm i -g @nestjs/cli typescript ts-node

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy the Prisma configuration and migration files
# This line copies the "prisma" directory from your project's root into the Docker container's working directory.
COPY prisma ./prisma/
COPY env-example ./.env
# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build your Nest.js application
RUN npm run build

# Expose the PORT environment variable (default to 4000 if not provided)
ARG PORT=4000
ENV PORT=$PORT
EXPOSE $PORT

# Start the Nest.js application using the start:prod script
CMD ["npm", "run", "start:prod"]
