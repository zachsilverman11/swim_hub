# Vercel Deployment Troubleshooting

## Current Issue: "Application Error - Server-Side Exception"

### Symptoms
- Main page (https://your-project.vercel.app) loads successfully
- Button on main page appears but may not navigate properly
- Operations page (https://your-project.vercel.app/operations) shows "Application error: a server-side exception has occurred"

### Root Cause
This error typically occurs when Firebase environment variables are not properly configured in Vercel or when there's a runtime error connecting to Firebase.

---

## Fix Step 1: Verify Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your `swim-hub` project
3. Go to **Settings** → **Environment Variables**
4. Verify all three required variables are set:

### Required Environment Variables

#### `FIREBASE_PROJECT_ID`
```
inspired-swim-platform
```
- **Type:** Plain text
- **Value:** Just the project ID, no quotes
- **Available to:** Production, Preview, Development

#### `FIREBASE_CLIENT_EMAIL`
```
firebase-adminsdk-fbsvc@inspired-swim-platform.iam.gserviceaccount.com
```
- **Type:** Plain text
- **Value:** Your Firebase service account email
- **Available to:** Production, Preview, Development

#### `FIREBASE_PRIVATE_KEY`
```
-----BEGIN PRIVATE KEY-----
YOUR_ACTUAL_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----
```

**CRITICAL FORMATTING:**
- Include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines
- The key should have actual newlines (not `\n` strings)
- When copying from JSON file, replace `\\n` with actual newlines
- Do NOT wrap in extra quotes in Vercel (Vercel handles this automatically)

**To get the correct format:**
```bash
# From your serviceAccountKey.json file, extract the private_key field
# It will look like: "-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"

# In Vercel, paste it with actual line breaks like this:
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...
(multiple lines of the actual key)
...ending line of key...
-----END PRIVATE KEY-----
```

---

## Fix Step 2: Check Vercel Function Logs

1. In your Vercel dashboard, go to your project
2. Click on the **Deployments** tab
3. Click on your latest deployment
4. Click on the **Functions** tab
5. Look for the `/operations` function
6. Check the logs for specific error messages

**Common error messages and fixes:**

### Error: "Unable to detect a Project Id"
**Fix:** `FIREBASE_PROJECT_ID` is not set or is incorrect

### Error: "Invalid service account credential"
**Fix:** Check `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` formatting

### Error: "Failed to parse private key"
**Fix:** `FIREBASE_PRIVATE_KEY` has incorrect formatting (likely needs proper newlines)

---

## Fix Step 3: Trigger a Redeploy

After fixing environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (•••) menu
4. Click **Redeploy**
5. Check "Use existing Build Cache" is UNCHECKED
6. Click **Redeploy**

Or push a small change to trigger automatic redeployment:

```bash
# Add a comment or whitespace to any file
echo "# Trigger redeploy" >> README.md
git add README.md
git commit -m "Trigger Vercel redeploy"
git push
```

---

## Fix Step 4: Test Using Vercel CLI (Advanced)

If the web dashboard isn't working, use the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Set environment variables
vercel env add FIREBASE_PROJECT_ID production
vercel env add FIREBASE_CLIENT_EMAIL production
vercel env add FIREBASE_PRIVATE_KEY production

# Pull environment variables to verify
vercel env pull .env.vercel

# Deploy
vercel --prod
```

---

## Verify the Fix

After redeploying, test:

1. Visit `https://your-project.vercel.app/`
   - Should show main page with button
2. Click "View Operations Dashboard →" button
   - Should navigate to /operations
3. Visit `https://your-project.vercel.app/operations`
   - Should show full dashboard with real data
   - Should see location metrics, revenue, utilization

---

## Still Not Working?

### Check Firebase Permissions

Ensure your Firebase service account has the correct permissions:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Verify the service account has **Firebase Admin SDK** role
3. Check Firestore Rules allow admin SDK access (they should by default)

### Check Vercel Build Logs

Look for warnings or errors during build:

1. Go to **Deployments** → Select deployment
2. Click **Building** to expand build logs
3. Look for:
   - `WARNING: environment variables missing from turbo.json` (should not appear - we fixed this)
   - Any TypeScript compilation errors
   - Module resolution errors

### Enable Debug Logging

Add to your environment variables in Vercel:

```
NODE_ENV=development
```

This will give you more detailed error messages. Remember to remove or change back to `production` after debugging.

---

## Working Local vs Broken Vercel?

If the app works locally but fails on Vercel:

1. **Environment variables are the most common cause**
   - Local uses `.env` file
   - Vercel uses dashboard environment variables
   - Verify they match exactly

2. **Check Node.js version**
   - Local: Check with `node --version`
   - Vercel: Set in project settings (should be 20.x or higher)

3. **Check build output**
   - Local build: `npm run build` (should succeed)
   - Vercel build logs should match local output

---

## Quick Checklist

- [ ] All three environment variables set in Vercel
- [ ] `FIREBASE_PRIVATE_KEY` has proper line breaks (not `\n` strings)
- [ ] Environment variables available to Production environment
- [ ] Redeployed after setting variables (with cache cleared)
- [ ] Vercel function logs show no Firebase errors
- [ ] Local build succeeds: `npm run build`
- [ ] Local test succeeds: operations page loads at http://localhost:3003/operations

---

## Contact Information

If you're still stuck after trying all of the above:

1. Share the Vercel function logs (screenshot or copy/paste)
2. Share the environment variable configuration (hide the actual private key value)
3. Confirm which steps you've completed from the checklist

The error message "server-side exception has occurred" is generic - the actual error details are in the Vercel function logs, which will tell us exactly what's wrong.
