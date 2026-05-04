# 🐳 Docker Setup Guide

## Overview

This project includes Docker configuration for easy deployment and development.

## Files

- **Dockerfile**: Multi-stage build for production
- **docker-compose.yml**: Local development with MongoDB and Redis
- **.dockerignore**: Files to exclude from Docker context

---

## 🚀 Quick Start with Docker Compose

### Prerequisites
- Docker installed
- Docker Compose installed

### Run Development Environment

```bash
# Start all services (app + MongoDB + Redis)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

The app will be available at: `http://localhost:3000`

### Access Services

**App**: http://localhost:3000
**MongoDB**: mongodb://admin:password@localhost:27017
**Redis**: redis://localhost:6379

---

## 🏗️ Build Production Docker Image

### Build Image

```bash
docker build -t chat-app:latest .
```

### Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  --name chat-app \
  chat-app:latest
```

### With Environment File

```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name chat-app \
  chat-app:latest
```

---

## 📋 Docker Commands Reference

### View Running Containers

```bash
docker ps
```

### View Container Logs

```bash
# Real-time logs
docker logs -f chat-app

# Last 100 lines
docker logs --tail 100 chat-app
```

### Stop Container

```bash
docker stop chat-app
```

### Remove Container

```bash
docker rm chat-app
```

### Remove Image

```bash
docker rmi chat-app:latest
```

### Execute Command in Container

```bash
docker exec -it chat-app sh
```

### Check Container Health

```bash
docker inspect chat-app --format='{{.State.Health.Status}}'
```

---

## 🔧 Docker Compose Commands

### Start Services

```bash
# Foreground (see logs)
docker-compose up

# Background
docker-compose up -d

# Rebuild images
docker-compose up --build

# Specific service
docker-compose up app mongodb
```

### Stop Services

```bash
# Stop without removing
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove volumes too
docker-compose down -v
```

### View Services

```bash
# List running services
docker-compose ps

# View logs
docker-compose logs

# Follow logs
docker-compose logs -f

# Specific service logs
docker-compose logs app
```

### Execute Commands

```bash
# Shell into app container
docker-compose exec app sh

# Run npm command
docker-compose exec app npm test

# Execute MongoDB command
docker-compose exec mongodb mongosh
```

---

## 🔒 Security Considerations

### Current Docker Setup

✅ **Good Practices**:
- Non-root user (nodejs)
- Multi-stage build (smaller image)
- Health checks
- Volume mounts for data persistence
- Network isolation

⚠️ **For Production**:

1. **Use Secrets Management**:
```bash
# Create secret
echo "your-secret-key" | docker secret create app_secret -

# Use in compose
docker service update --secret-add app_secret service_name
```

2. **Limit Resources**:
```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

3. **Enable Network Security**:
```yaml
networks:
  chat-network:
    driver: bridge
    driver_opts:
      com.docker.network.bridge.enable_ip_masquerade: "true"
```

---

## 📊 Environment Variables

Create `.env` file for Docker:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb://admin:password@mongodb:27017/chatapp
MONGO_USER=admin
MONGO_PASS=password

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-super-secret-key-here

# CORS
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

---

## 🧪 Testing in Docker

### Run Tests

```bash
docker-compose exec app npm test
```

### Run Linting

```bash
docker-compose exec app npm run lint
```

### Interactive Node Shell

```bash
docker-compose exec app node
```

---

## 📦 Publishing to Registry

### Docker Hub

```bash
# Login
docker login

# Tag image
docker tag chat-app:latest yourusername/chat-app:latest

# Push
docker push yourUsername/chat-app:latest
```

### Private Registry

```bash
# Tag
docker tag chat-app:latest registry.example.com/chat-app:latest

# Push
docker push registry.example.com/chat-app:latest
```

---

## 🚀 Deploy on Docker Hosting Platforms

### Vercel with Docker

```bash
# Create vercel.json
{
  "buildCommand": "docker build -t chat-app .",
  "outputDirectory": "dist"
}
```

### Railway with Docker

```bash
# Push to GitHub
git add .
git commit -m "Add Docker support"
git push

# Railway auto-detects Dockerfile and deploys
```

### AWS ECS

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

docker tag chat-app:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/chat-app:latest

docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/chat-app:latest
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Create service
docker service create \
  --name chat-app \
  --publish 3000:3000 \
  chat-app:latest

# Scale service
docker service scale chat-app=3

# View services
docker service ls
```

### Kubernetes

```yaml
# kubernetes.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chat-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chat-app
  template:
    metadata:
      labels:
        app: chat-app
    spec:
      containers:
      - name: chat-app
        image: chat-app:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
---
apiVersion: v1
kind: Service
metadata:
  name: chat-app-service
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: chat-app
```

Deploy:
```bash
kubectl apply -f kubernetes.yaml
```

---

## 🐛 Troubleshooting

### Container Won't Start

```bash
# Check logs
docker logs chat-app

# Inspect container
docker inspect chat-app

# Check image
docker images
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
docker run -p 3001:3000 chat-app
```

### Database Connection Failed

```bash
# Check MongoDB is running
docker ps | grep mongodb

# Check network
docker network inspect chat-network

# Ping MongoDB from app
docker-compose exec app ping mongodb
```

### Out of Disk Space

```bash
# Clean up unused Docker resources
docker system prune -a

# Remove unused volumes
docker volume prune
```

---

## 📈 Performance Tips

### Optimize Image Size

```bash
# Check image size
docker images chat-app

# Use Alpine Linux (already in Dockerfile)
# Multi-stage build (already in Dockerfile)
# .dockerignore to exclude files (created)
```

### Speed Up Builds

```bash
# Use build cache
docker build --cache-from chat-app:latest .

# Parallel layers
DOCKER_BUILDKIT=1 docker build .
```

---

## 📚 Additional Resources

- **Docker Docs**: https://docs.docker.com
- **Docker Hub**: https://hub.docker.com
- **Docker Compose Docs**: https://docs.docker.com/compose
- **Best Practices**: https://docs.docker.com/develop/dev-best-practices
