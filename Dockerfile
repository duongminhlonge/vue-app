# ---------- Build Stage ----------
FROM node:20 AS build-stage

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine AS production-stage

# Copy cấu hình nginx vào container
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy file build vào thư mục Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]