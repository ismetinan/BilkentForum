<<<<<<< HEAD
# Stage 1: build React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy only package files first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:alpine

# Clean default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

=======
# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built files to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config (make sure nginx.conf exists in frontend/)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
>>>>>>> origin/main
CMD ["nginx", "-g", "daemon off;"]
