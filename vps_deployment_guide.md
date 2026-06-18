# VPS Production Deployment Guide

This guide outlines the step-by-step process to deploy your Dockerized monorepo (`web`, `portal`, `api`, `postgres`, `redis`, `nginx`) to a Virtual Private Server (VPS) running Ubuntu.

---

## Architecture Overview

On your production VPS, Docker Compose will orchestrate the following services:
*   **nginx**: Acts as the reverse proxy (exposes port `80` and `443` to the internet).
*   **web** & **portal**: Standalone Next.js production builds.
*   **api**: Express backend running under Bun.
*   **postgres**: Database server storing persistent data in a Docker volume.
*   **redis**: In-memory store for session/cache.

---

## Step 1: VPS Server Setup

### 1. Update the System
SSH into your VPS and update the package index:
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Docker & Docker Compose
Install Docker Engine and Docker Compose on Ubuntu:
```bash
# Install Docker
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Enable Docker service
sudo systemctl enable docker
sudo systemctl start docker

# Add your user to the docker group (optional, to run docker without sudo)
sudo usermod -aG docker $USER
newgrp docker
```

---

## Step 2: Prepare Project & Environment

### 1. Clone the Project on VPS
```bash
git clone <YOUR_REPOSITORY_URL> /var/www/fch-portal
cd /var/www/fch-portal
```

### 2. Create the Production `.env` File
Create a `.env` file in the root directory:
```bash
nano .env
```
Add the following configuration (replace placeholders with secure values):
```env
# System environments
NODE_ENV=production

# URLs & Domains (Change to your domains)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_PORTAL_URL=https://portal.yourdomain.com
FRONTEND_URL=https://yourdomain.com
PORTAL_URL=https://portal.yourdomain.com

# Database Configurations
DATABASE_USER=postgres
DATABASE_PASSWORD=YOUR_VERY_SECURE_PASSWORD
DATABASE_DB=fch_portal
DATABASE_URL=postgresql://postgres:YOUR_VERY_SECURE_PASSWORD@postgres:5432/fch_portal?sslmode=disable

# Authentication Secrets (Generate secure random strings)
JWT_SECRET=YOUR_SECURE_JWT_SECRET
JWT_REFRESH_SECRET=YOUR_SECURE_JWT_REFRESH_SECRET
BETTER_AUTH_SECRET=YOUR_SECURE_BETTER_AUTH_SECRET
BETTER_AUTH_URL=https://api.yourdomain.com

# Cors & Access Control
TRUSTED_ORIGINS=https://yourdomain.com,https://portal.yourdomain.com
CORS_ORIGIN=https://yourdomain.com,https://portal.yourdomain.com
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
LOG_FORMAT=combined

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Third-Party OAuth Providers (If used)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

---

## Step 3: Nginx & SSL Configuration (Certbot Let's Encrypt)

To serve your sites securely over HTTPS, you should configure SSL certificates for your domains (e.g., `yourdomain.com`, `portal.yourdomain.com`, `api.yourdomain.com`).

### 1. Update Local Nginx Config
Ensure your [nginx.conf](file:///c:/Users/S%20M%20Masrafi/Desktop/NEXT/FCH_PORTAL/nginx/nginx.conf) on the VPS has standard routing. For production, you will mount certificate paths from the host.

### 2. Install Certbot on VPS Host
```bash
sudo apt install -y certbot
```

### 3. Generate Certificates (DNS or Webroot challenge)
Generate certificates using Certbot stand-alone on the host (temporary stop of Nginx container if it's running):
```bash
sudo certbot certonly --standalone -d yourdomain.com -d portal.yourdomain.com -d api.yourdomain.com
```
Your certificate files will be generated at `/etc/letsencrypt/live/yourdomain.com/`.

### 4. Mount Certificates into Docker Nginx
Update your `docker-compose.yml` to mount the Let's Encrypt certificates to the `nginx` container:
```yaml
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
```

---

## Step 4: Run & Manage Production

### 1. Build and Run Container Services
Build the images and run them in the background (detached mode):
```bash
docker compose up -d --build
```

### 2. Verify Running Services
```bash
docker compose ps
```

### 3. View Logs
```bash
# Monitor api service logs
docker compose logs -f api

# Monitor nginx logs
docker compose logs -f nginx
```

---

## Step 5: Database Backups (Cron Job)

To prevent data loss, set up a daily automated cron job to backup your Postgres database.

1. Create a script `/var/www/fch-portal/backup.sh`:
   ```bash
   #!/bin/bash
   BACKUP_DIR="/var/www/fch-portal/backups"
   mkdir -p $BACKUP_DIR
   FILENAME="$BACKUP_DIR/db_backup_$(date +%F_%T).sql"
   docker exec -t postgres pg_dumpall -U postgres > $FILENAME
   find $BACKUP_DIR -type f -mtime +7 -name "*.sql" -delete # Delete backups older than 7 days
   ```
2. Make it executable:
   ```bash
   chmod +x /var/www/fch-portal/backup.sh
   ```
3. Add a daily cron job:
   ```bash
   sudo crontab -e
   ```
   Add this line to run backup every day at midnight:
   ```text
   0 0 * * * /var/www/fch-portal/backup.sh
   ```
