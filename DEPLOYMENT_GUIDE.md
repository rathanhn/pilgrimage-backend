# 🚀 Vercel Deployment Guide for Pilgrimage Booking Backend

## Prerequisites
- ✅ MongoDB Atlas database setup (already done)
- ✅ Vercel account (create one at https://vercel.com)
- ✅ Git (to push your code)

---

## Step 1: Prepare Your Backend

All configuration files are already created:
- ✅ `vercel.json` - Vercel configuration
- ✅ `server.js` - Updated to work with Vercel
- ✅ `config.js` - Environment configuration
- ✅ `package.json` - Dependencies

---

## Step 2: Deploy via Vercel CLI (Recommended)

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Navigate to Backend Folder
```bash
cd backend
```

### 2.3 Login to Vercel
```bash
vercel login
```

### 2.4 Deploy
```bash
vercel
```

**Follow the prompts:**
- Set up and deploy? **Yes**
- Which scope? Select your account
- Link to existing project? **No**
- Project name? `pilgrimage-booking-backend`
- Directory? `./`
- Override settings? **No**

### 2.5 Set Environment Variables
After deployment, set your environment variables:

```bash
vercel env add MONGODB_URI
```
Paste your MongoDB connection string when prompted.

Add other environment variables:
```bash
vercel env add JWT_SECRET
vercel env add ADMIN_USERNAME
vercel env add ADMIN_PASSWORD
```

### 2.6 Deploy to Production
```bash
vercel --prod
```

---

## Step 3: Alternative - Deploy via GitHub

### 3.1 Push Code to GitHub
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 3.2 Import to Vercel
1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Framework Preset**: Other
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

### 3.3 Add Environment Variables
In Vercel dashboard:
- Go to **Settings** → **Environment Variables**
- Add these variables:
  - `MONGODB_URI` = Your MongoDB connection string
  - `JWT_SECRET` = Your JWT secret
  - `ADMIN_USERNAME` = Admin username
  - `ADMIN_PASSWORD` = Admin password
  - `NOTIFICATION_ADMIN_EMAIL` = admin@pilgrimage.com

### 3.4 Deploy
Click **"Deploy"**

---

## Step 4: Update Frontend Configuration

After deployment, you'll get a URL like: `https://pilgrimage-booking-backend.vercel.app`

Update `js/config.js`:
```javascript
const config = {
    API_BASE_URL: 'https://pilgrimage-booking-backend.vercel.app',
    // ... rest of config
};
```

---

## Step 5: Update CORS in Backend Config

In `backend/config.js`, update:
```javascript
CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500,http://127.0.0.1:5500,http://localhost:3000,https://your-frontend-domain.com'
```

**Set this environment variable in Vercel** with your frontend domain(s).

---

## Step 6: Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Check MongoDB connection by visiting: `https://your-app.vercel.app/admin/stats`
3. Test a booking endpoint

---

## Troubleshooting

### Issue: Environment Variables Not Working
**Solution**: Make sure you added them in Vercel dashboard and redeployed.

### Issue: MongoDB Connection Error
**Solution**: Check your MongoDB Atlas IP whitelist (add `0.0.0.0/0` for Vercel).

### Issue: CORS Errors
**Solution**: Update `CORS_ORIGIN` environment variable with your frontend domain.

### Issue: Routes Not Found
**Solution**: Verify `vercel.json` configuration is correct.

---

## Quick Reference Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View logs
vercel logs

# Remove deployment
vercel remove
```

---

## Environment Variables Checklist

- ✅ `MONGODB_URI` - Your MongoDB connection string
- ✅ `JWT_SECRET` - Random secret string
- ✅ `ADMIN_USERNAME` - Admin login username
- ✅ `ADMIN_PASSWORD` - Admin login password
- ✅ `NOTIFICATION_ADMIN_EMAIL` - Admin email for notifications
- ✅ `CORS_ORIGIN` - Frontend domain(s)

---

## Your Backend URL
After deployment, your backend will be available at:
```
https://your-app-name.vercel.app
```

Update this in your frontend configuration!

---

## Need Help?
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
