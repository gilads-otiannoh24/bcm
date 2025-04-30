# Project Setup Guide

This project consists of two separate applications: a **frontend** and a **backend**. Each must be run independently. The frontend depends on the backend, but the backend can operate independently.

---

## 🧩 Starting the Applications

Navigate into each app’s directory and run the following command to start the development server:

```bash
npm run dev
```

Run this command separately in both the frontend and backend directories.

## 🗂️ Backend Initialization

When the backend is started on a new or empty database, it will automatically create two users:
| Role | Email | Password |
|-------------|--------------------|---------------|
| Normal User | user@email.com | password123 |
| Admin User | admin@email.com | password123 |

## ⚙️ Environment Variables

Each app requires environment variables to be configured before running. Boilerplate .env files are provided in both the frontend and backend directories. Use these as templates to set up your environment.

```bash
cp env .env
```

After copying, make sure to update any necessary values such as API URLs, database URIs, and secret keys.
