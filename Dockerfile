# ---------- Development Stage ----------
FROM node:20

WORKDIR /app

# Install dependencies
COPY app/package*.json ./
RUN npm install

# Copy the rest of the source code
COPY app .

# Expose Vite dev server port (or Vue CLI port)
EXPOSE 5173

# Start Vite with hot reload on 0.0.0.0 so host can access it
CMD ["npm", "run", "dev", "--", "--host"]