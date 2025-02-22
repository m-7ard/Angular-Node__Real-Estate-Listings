# frontend
FROM node:18 AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./ 
RUN npm install
COPY frontend/ ./ 
RUN npm run build

# backend
FROM node:18
WORKDIR /app/backend
COPY backend/package*.json ./ 
RUN npm install
COPY backend/ ./ 
RUN npm run export:docker
# in /app/backend/dist

# Assuming the build output from frontend is correct
COPY --from=frontend-builder /app/frontend/dist/frontend/browser /app/backend/static

EXPOSE 3000
CMD ["node", "dist/index.mjs"]