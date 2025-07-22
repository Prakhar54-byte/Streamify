FROM node:24.4.1-alpine

# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 5001
# Start the app
CMD ["npm", "run", "dev"]