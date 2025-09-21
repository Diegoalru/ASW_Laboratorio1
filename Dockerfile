# ---- Build stage ----
FROM node:22.19-alpine AS builder
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the source and build
COPY . .
# Build Angular app (production by default per angular.json)
RUN npm run build

# ---- Runtime stage ----
FROM nginx:alpine AS runtime

# Copy built app to Nginx public folder
# Angular v17+ outputs to dist/<project>/browser by default with @angular/build
COPY --from=builder /app/dist/Laboratorio1/browser/ /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Default command
CMD ["nginx", "-g", "daemon off;"]
