# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Declarar variables directamente
ENV VITE_API_URL=http://localhost:8000
ENV VITE_GOOGLE_CLIENT_ID=395832852196-dmo7tvcbi8acsutcf7s7a2cpcqv21298.apps.googleusercontent.com

RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
RUN printf "server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files \$uri \$uri/ /index.html;\n\
  }\n\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]