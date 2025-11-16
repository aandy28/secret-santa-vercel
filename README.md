# Secret Santa Picker (Next.js)

This is a minimal Secret Santa picker built with Next.js (App Router) and TypeScript.

**Important**: This implementation uses an ephemeral JSON store in `/tmp` to persist picks. It works on serverless platforms (e.g. Vercel) for small, temporary events but will reset whenever the deployment is rebuilt or the serverless instance is recycled.

## How to deploy (no GitHub required)

1. Download the ZIP and extract.
2. Create a free account on Vercel.
3. In Vercel dashboard choose "New Project" → **Import** → Upload the project (choose the extracted folder).
4. Build & deploy. Vercel will give you a free `*.vercel.app` domain you can share.

## Usage

- Visit `/admin` to edit the default 10 names and click **Generate Links**.
- Share the generated links with participants via WhatsApp.
- Each participant opens their unique link and clicks **Pick Now** to receive an anonymous assignment.
