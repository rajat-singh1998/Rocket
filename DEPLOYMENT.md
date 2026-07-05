# Rocket VPS Deployment

This project is deployed as:

- Next.js static frontend served by Nginx from `/var/www/rocket/dist`
- Express backend managed by PM2 from `/var/www/rocket/backend`
- Admin-managed content stored in MongoDB when `MONGODB_URI` is configured
- JSON runtime files in `/var/www/rocket-storage/data` are used as the migration source and local fallback
- Uploaded images stored outside the repo in `/var/www/rocket-storage/uploads`
- Generated `sitemap.xml` and `robots.txt` written to `/var/www/rocket/dist`

## 1. Upload Project

Place the project on the VPS:

```bash
sudo mkdir -p /var/www/rocket
sudo chown -R $USER:$USER /var/www/rocket
```

Copy the project files into `/var/www/rocket`.

Create a separate runtime storage directory so live content edits do not modify Git-tracked files:

```bash
sudo mkdir -p /var/www/rocket-storage/data
sudo mkdir -p /var/www/rocket-storage/uploads
sudo chown -R $USER:$USER /var/www/rocket-storage
```

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
ROCKET_STORAGE_ROOT=/var/www/rocket-storage
ROCKET_PUBLIC_WRITE_DIR=/var/www/rocket/dist
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=rocket_rubbish
```

These runtime paths are important:

- `ROCKET_STORAGE_ROOT` keeps CMS content and uploads outside the Git repo
- `ROCKET_PUBLIC_WRITE_DIR` writes generated `sitemap.xml` and `robots.txt` into the live frontend output instead of the source `public` folder
- `MONGODB_URI` enables MongoDB storage for site content, blogs, city pages, contact inquiries, admin users, permissions, profile data, and password hashes

Before switching a live site to MongoDB, import the current JSON runtime data:

```bash
cd /var/www/rocket/backend
npm run migrate:json-to-mongo
```

## 4. Build Frontend

Use the public domain as the frontend API base because Nginx proxies `/api` and `/uploads` to the backend.

```bash
cd /var/www/rocket
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com npm run build
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
/var/www/rocket-storage/data/siteContent.json
/var/www/rocket-storage/data/admin.json
/var/www/rocket-storage/uploads
```

## 9. Safe Update Flow

With runtime storage outside the repo, regular Git updates stop conflicting with live CMS changes:

```bash
cd /var/www/rocket
git pull origin main
npm install

cd /var/www/rocket/backend
npm install

cd /var/www/rocket
NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com npm run build
pm2 restart rocket-backend
sudo systemctl restart nginx
```
