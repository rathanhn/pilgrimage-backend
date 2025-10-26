# 🚀 GitHub + Vercel Deployment Steps

## Quick Start - Deploy Your Backend in 10 Minutes

---

## Step 1: Create GitHub Repository

### 1.1 Go to GitHub
1. Visit https://github.com
2. Click **"New Repository"** (green button)
3. Repository name: `pilgrimage-booking-backend`
4. Visibility: **Private** (recommended) or Public
5. ⚠️ **DO NOT** check "Add a README file"
6. Click **"Create repository"**

### 1.2 Copy Your Repository URL
You'll see something like:
```
https://github.com/YOUR_USERNAME/pilgrimage-booking-backend.git
```
**Copy this URL** - you'll need it in the next step!

---

## Step 2: Push Code to GitHub

Open PowerShell in your project folder and run these commands:

```powershell
# Navigate to backend folder
cd backend

# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - Ready for Vercel deployment"

# Rename branch to main
git branch -M main

# Add GitHub remote (replace YOUR_URL with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/pilgrimage-booking-backend.git

# Push to GitHub
git push -u origin main
```

### If you get authentication error:
1. Use Personal Access Token instead of password
2. Go to: https://github.com/settings/tokens
3. Generate new token with `repo` scope
4. Use token as password when prompted

---

## Step 3: Deploy to Vercel via GitHub

### 3.1 Go to Vercel
1. Visit https://vercel.com
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (recommended)

### 3.2 Import Your Repository
1. Click **"Add New Project"** (or "Import Project")
2. You'll see your GitHub repositories
3. Find and select: `pilgrimage-booking-backend`
4. Click **"Import"**

### 3.3 Configure Project
- **Framework Preset**: Other
- **Root Directory**: `backend` ⚠️ (IMPORTANT!)
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: `npm install` (default)

### 3.4 Click "Deploy" 
Wait for deployment to finish (2-3 minutes)

---

## Step 4: Add Environment Variables

### 4.1 Go to Vercel Dashboard
1. Click on your project
2. Go to **"Settings"** tab
3. Click **"Environment Variables"**

### 4.2 Add These Variables

Click **"Add"** for each:

| Name | Value | Environment |
|------|-------|-------------|
| `MONGODB_URI` | Your MongoDB connection string | Production, Preview, Development |
| `JWT_SECRET` | any-random-secret-string-12345 | Production, Preview, Development |
| `ADMIN_USERNAME` | Admin@booking.com | Production, Preview, Development |
| `ADMIN_PASSWORD` | admin123 | Production, Preview, Development |
| `NOTIFICATION_ADMIN_EMAIL` | admin@pilgrimage.com | Production, Preview, Development |
| `CORS_ORIGIN` | http://localhost:5500,https://your-frontend-domain.com | Production |

### 4.3 Redeploy
After adding variables, go to **"Deployments"** tab and click **"Redeploy"**

---

## Step 5: Get Your Backend URL

After deployment, you'll see:
```
✅ Production: https://pilgrimage-booking-backend.vercel.app
```

**Copy this URL** - you need it for the frontend!

---

## Step 6: Update Frontend Configuration

### 6.1 Update API URL
Open `js/config.js` and change:

```javascript
const config = {
    API_BASE_URL: 'https://pilgrimage-booking-backend.vercel.app', // Your Vercel URL
    // ... rest stays same
};
```

### 6.2 Test Your Deployment
Visit: `https://pilgrimage-booking-backend.vercel.app/admin/stats`

You should see: `{"success":true,"totalBookings":0,...}`

---

## ✅ Done! Your Backend is Live!

Your backend is now deployed at:
```
https://your-app-name.vercel.app
```

---

## 🔄 Updating Your Backend (Making Changes)

Whenever you make changes to your backend:

```powershell
cd backend

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

Vercel will **automatically** detect the change and redeploy! 🎉

---

## 📝 Quick Commands Reference

```bash
# Navigate to backend
cd backend

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull
```

---

## ❓ Troubleshooting

### Issue: "fatal: not a git repository"
**Solution**: Make sure you run `git init` in the backend folder

### Issue: Authentication failed
**Solution**: Use Personal Access Token from GitHub Settings

### Issue: Vercel can't find your repo
**Solution**: Make sure you click "Continue with GitHub" when signing up to Vercel

### Issue: Environment variables not working
**Solution**: Add them in Vercel dashboard → Settings → Environment Variables, then redeploy

### Issue: MongoDB connection error
**Solution**: Check your MongoDB Atlas Network Access (add `0.0.0.0/0`)

---

## 📞 Need Help?

- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

---

## 🎯 Next Steps

1. ✅ Backend deployed to Vercel
2. ✅ Frontend API URL updated
3. 🔄 Test your entire application
4. 🚀 Deploy frontend (optional)

---

**You're all set! Happy coding! 🎉**
