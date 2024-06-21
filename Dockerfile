# Step 1: Base Image
FROM node:14

# Step 2: Set Working Directory
WORKDIR /app

# Step 3: Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Step 4: Copy the rest of your app
COPY . .

# Step 5: Build the App
RUN npm run build

# Step 6: Install 'serve' to serve the app on a container
RUN npm install -g serve

# Step 7: Define Start Command
CMD ["serve", "-s", "build", "-l", "3000"]

# Expose port 3000
EXPOSE 3000
