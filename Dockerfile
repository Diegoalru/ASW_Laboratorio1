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
COPY --from=builder /app/dist/*/browser/ /usr/share/nginx/html/

# Copy custom Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
