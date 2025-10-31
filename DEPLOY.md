# Deployment Guide

## Quick Start: Deploy to Vercel

### Step 1: Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/swim-hub.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `swim-hub` repository
4. Vercel will auto-detect Next.js configuration

### Step 3: Configure Environment Variables

In the Vercel dashboard, add these environment variables:

**Required Variables:**

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `FIREBASE_PROJECT_ID` | `inspired-swim-platform` | Firebase Console → Project Settings |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-*@*.iam.gserviceaccount.com` | Service Account JSON file |
| `FIREBASE_PRIVATE_KEY` | `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` | Service Account JSON file |

**Important:** 
- Keep the quotes around `FIREBASE_PRIVATE_KEY`
- Keep the `\n` characters in the private key
- Copy the entire key including BEGIN/END markers

### Step 4: Deploy

Click "Deploy" - Vercel will:
1. Install dependencies
2. Build the Next.js dashboard
3. Deploy to production

Your dashboard will be live at: `https://your-project.vercel.app/operations`

## Alternative: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? swim-hub
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
vercel env add FIREBASE_PRIVATE_KEY

# Deploy to production
vercel --prod
```

## Verify Deployment

After deployment, visit:
- `https://your-project.vercel.app/operations`

You should see:
- Business Overview metrics
- Performance alerts
- Revenue tracking
- Location table with real data

## Troubleshooting

### Build Fails

Check Vercel logs for errors. Common issues:
- Missing environment variables
- Invalid Firebase credentials
- TypeScript errors

### Dashboard Loads But No Data

1. Check environment variables are set correctly
2. Verify Firebase credentials have read access
3. Check Vercel function logs for Firebase errors

### Need to Update

```bash
# Make changes locally
git add .
git commit -m "Update dashboard"
git push

# Vercel will automatically redeploy
```

## Sharing with Team

Share your Vercel dashboard URL:
- Production: `https://your-project.vercel.app/operations`
- Preview: Each PR gets a unique preview URL

## Next Steps

After deployment:
1. Share URL with team for feedback
2. Monitor usage in Vercel dashboard
3. Set up custom domain (optional)
4. Configure Vercel alerts (optional)
