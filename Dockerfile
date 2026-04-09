# Build stage
FROM oven/bun:latest AS builder

WORKDIR /app
COPY . .

# Install dependencies pakai bun
RUN bun install

# Build project
RUN bun run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]