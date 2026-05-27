# Rocket VPS Deployment

This project is deployed as:

- Vite frontend served by Nginx from `/var/www/rocket/dist`
- Express backend managed by PM2 from `/var/www/rocket/backend`
- Admin-managed content stored on disk in `/var/www/rocket/backend/data`
- Uploaded images stored on disk in `/var/www/rocket/backend/uploads`

## 1. Upload Project

Place the project on the VPS:

```bash
sudo mkdir -p /var/www/rocket
sudo chown -R $USER:$USER /var/www/rocket
```

Copy the project files into `/var/www/rocket`.

## 2. Install Dependencies

```bash
cd /var/www/rocket
npm install

cd /var/www/rocket/backend
npm install
```

## 3. Configure Backend Env

```bash
cd /var/www/rocket/backend
cp .env.production.example .env
nano .env
```

Set the real domain and secrets:

```env
PORT=5000
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
PUBLIC_SITE_ORIGIN=https://yourdomain.com
SITE_ORIGIN=https://yourdomain.com
ADMIN_AUTH_SECRET=use-a-long-random-secret
ADMIN_DEFAULT_PASSWORD=change-before-first-run
```

## 4. Build Frontend

Use the public domain as the frontend API base because Nginx proxies `/api` and `/uploads` to the backend.

```bash
cd /var/www/rocket
VITE_API_BASE_URL=https://yourdomain.com npm run build
```

## 5. Start Backend With PM2

```bash
sudo mkdir -p /var/log/rocket
sudo chown -R $USER:$USER /var/log/rocket

cd /var/www/rocket
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Check backend:

```bash
curl http://127.0.0.1:5000/api/health
```

## 6. Configure Nginx

Copy the example config:

```bash
sudo cp /var/www/rocket/deploy/nginx/rocket-rubbish.conf.example /etc/nginx/sites-available/rocket-rubbish
sudo nano /etc/nginx/sites-available/rocket-rubbish
```

Replace `yourdomain.com` with the real domain, then enable:

```bash
sudo ln -s /etc/nginx/sites-available/rocket-rubbish /etc/nginx/sites-enabled/rocket-rubbish
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Enable SSL

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 8. Backup Important Data

Back up these folders/files regularly:

```text
/var/www/rocket/backend/data/siteContent.json
/var/www/rocket/backend/data/admin.json
/var/www/rocket/backend/uploads
```
