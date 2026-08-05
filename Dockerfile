# 1. Aşama: Build (Node.js kullanarak projeyi derle)

FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build



# 2. Aşama: Production (Nginx ile sun)

FROM nginx:alpine

# React build dosyalarını Nginx'in html klasörüne kopyala

COPY --from=build /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/conf.d/default.conf


# React Router kullanıyorsan 404 hatası almamak için özel nginx ayarı gerekebilir.

# Basit kurulum için varsayılanı kullanıyoruz ama gerekirse nginx.conf eklenmeli.

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
