# My Deployment Guide for Share-a-Ride Backend

This is how I would deploy the Share-a-Ride backend in a way that reflects real-world, on-premises or cloud VM practices. I’ll walk you through my reasoning and the steps I’d take, so you can adapt or automate as needed.

---

## 1. Preparing the Server

First, I make sure I have a Linux server (Ubuntu is my go-to for Node.js). I either spin up a VM in Azure, AWS, or use a physical server. I always ensure SSH access is set up and that I can open the necessary ports (22 for SSH, 80/443 for web, and the app port, e.g., 4002).

## 2. Installing Dependencies

I install Node.js (I prefer the LTS version for stability), npm, git, and PM2 for process management. PM2 helps me keep the app running and makes restarts easy after code changes.

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
sudo npm install -g pm2
```

## 3. Cloning the Repo and Setting Up

I clone the project from my Git repository, then copy `.env-example` to `.env` and fill in all the secrets and configuration values (database, JWT, email, etc.).

```bash
git clone <your-repo-url>
cd share-a-ride-backend
cp .env-example .env
# Edit .env with your secrets and DB info
npm install
```

## 4. Database Setup

If I’m using a managed database (like Azure Database for PostgreSQL), I create the DB and user, then update my `.env`. If I want to run the DB locally, I install PostgreSQL and set it up myself.

## 5. Running Migrations and Seeders

I always run migrations and seeders to make sure the schema and initial data are in place:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## 6. Running the App with PM2

I use PM2 to start the app and keep it running in the background. I also set it up to restart on reboot:

```bash
pm2 start app.js --name share-a-ride
pm2 save
pm2 startup
```

## 7. (Optional) Setting Up Nginx

For production, I like to use Nginx as a reverse proxy. It handles HTTPS, can serve static files, and makes it easy to scale later. I configure it to forward requests to my Node.js app on port 4002.

## 8. (Optional) Firewall

I secure the server with UFW, only allowing the ports I need:

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 4002
sudo ufw enable
```

---

## Why This Approach?

- It’s portable: I can use the same steps on Azure, AWS, DigitalOcean, or on-prem.
- It’s transparent: I know exactly what’s running and can debug easily.
- It’s production-ready: With PM2 and Nginx, I get reliability and scalability.

If I wanted to automate this, I’d use Ansible or a CI/CD pipeline to run these steps on every deploy. 