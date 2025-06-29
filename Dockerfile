# ---------- Build Stage ----------
FROM node:20 AS build-stage

WORKDIR /app

# Copy only package files to install dependencies first
COPY app/package*.json ./
RUN npm install

# Copy the rest of the Vue source code
COPY app/ .

# Build the application
RUN npm run build


# ---------- Production Stage ----------
FROM nginx:alpine AS production-stage

# Optional: Copy full app source (for debugging)
WORKDIR /app
COPY --from=build-stage /app /app

# Copy built files into nginx public folder
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
