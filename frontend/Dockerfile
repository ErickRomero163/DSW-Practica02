FROM node:20.11.1-alpine AS builder
WORKDIR /app

COPY frontend/departamentos-admin/package*.json ./
RUN npm ci

COPY frontend/departamentos-admin/ ./
RUN npm run build -- --configuration production

FROM nginx:1.27.4-alpine
COPY --from=builder /app/dist/departamentos-admin/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]