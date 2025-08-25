# Stage 1: Build the Angular app
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the app with a lightweight web server
FROM node:22-slim

WORKDIR /app

# Install a simple static server
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/dist/clipMods/browser /app/dist

EXPOSE 7081

CMD ["serve", "-s", "dist", "-l", "7081"]
