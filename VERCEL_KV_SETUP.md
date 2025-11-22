# Vercel KV Setup Guide

## Overview
This app now uses **Vercel KV** (Redis) for persistent storage on Vercel, with automatic fallback to `/tmp/santa.json` for local development.

## Local Development (Unchanged)
```bash
yarn dev
```
Works exactly as before — data is stored in `/tmp/santa.json` and persists within a dev session.

## Production Deployment to Vercel

### Step 1: Create a Vercel KV Database
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Storage"** → **"KV"**
3. Click **"Create Database"** (choose any region)
4. Once created, you'll see connection details with `KV_URL`, `KV_REST_API_URL`, etc.

### Step 2: Connect to Your Vercel Project
1. In the KV database details, click **"Connect"**
2. Select your project (if not shown, create one)
3. Vercel will automatically add environment variables to your project

### Step 3: Deploy
```bash
git add .
git commit -m "Add Vercel KV support"
git push origin main
```

Vercel will automatically deploy. Check the deployment logs to confirm.

### Step 4: Test
1. Visit your Vercel deployment URL
2. Go to `/admin` and generate links with restrictions
3. Click "Show Store Contents" to verify data is persisted
4. Open a pick link in a private window (to test fresh session)
5. The assignment should display immediately (from KV storage)

## How It Works
- **Local (`yarn dev`)**: Uses `/tmp/santa.json` (filesystem)
- **Vercel Production**: Uses Vercel KV Redis (automatically via `KV_URL` env var)
- The app detects which storage backend to use based on `process.env.KV_URL`

## Troubleshooting

### Data not persisting on Vercel
- Check that `KV_URL` is set in your Vercel project settings (it should be auto-added)
- Check deployment logs for errors
- Verify KV database status in Vercel dashboard

### Local dev still works after deployment
Yes! Local dev always uses `/tmp/santa.json` regardless of environment variables.

## Free Tier Limits
Vercel KV free tier includes:
- 100 commands/day
- Enough for a small Secret Santa (~10 participants)
- If you need more, check [Vercel Pricing](https://vercel.com/pricing)
