# Stage 1: Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend ./frontend/
RUN cd frontend && npm run build

# Stage 2: Build backend
FROM python:3.9-slim as backend-builder
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.9-slim
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Copy backend
COPY backend ./backend
COPY --from=backend-builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages

# Environment variables
ENV FLASK_APP=backend/app.py
ENV FLASK_ENV=production
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Expose port
EXPOSE 5000

# Run command
CMD ["flask", "run"]