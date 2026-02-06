# Deploying to Cloudflare Pages

This guide will help you deploy the Yes Scholarship website to Cloudflare Pages.

## Prerequisites

- A [Cloudflare Account](https://dash.cloudflare.com/sign-up)
- Access to the GitHub repository

## Step 1: Push Changes to GitHub

Ensure all your latest changes, including the new map feature and build scripts, are pushed to GitHub.

```bash
git add .
git commit -m "feat: ready for cloudflare deployment"
git push origin main
```

## Step 2: Create Project in Cloudflare Pages

1.  Log in to the **Cloudflare Dashboard**.
2.  Go to **Compute (Workers & Pages)** > **Pages**.
3.  Click **Connect to Git** and select your GitHub repository (`yes-scholarship`).
4.  Click **Begin setup**.

## Step 3: Configure Build Settings

Use the following settings:

-   **Framework Preset**: `Next.js (Static HTML Export)` (or select `None` and manually enter settings below if that preset is slightly different)
-   **Build command**: `npm run pages:build`
-   **Build output directory**: `.vercel/output/static`
-   **Node.js Version**: Set to `20` or higher (Cloudflare usually defaults to a recent version, but good to check).

## Step 4: Add Environment Variables

Go to the **Environment variables** section and add the following keys. You can find these values in your local `.env.local` file or Sanity management dashboard.

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity Project ID | `xyz123` |
| `NEXT_PUBLIC_SANITY_DATASET` | Your Sanity Dataset | `production` |
| `NPM_FLAGS` | Force legacy peer deps | `--legacy-peer-deps` |

> [!IMPORTANT]
> The `NPM_FLAGS` variable with value `--legacy-peer-deps` is **crucial** because we are using Next.js 16, which is newer than what some Cloudflare adapters expect.
> The `NEXT_PUBLIC_` prefix is required for these variables to be available to the browser-side code.

## Step 5: Save and Deploy

Click **Save and Deploy**. Cloudflare will start building your site.

## Troubleshooting

-   **Build Errors**: Check the build logs. If you see errors about `Node.js` version, add a `NODE_VERSION` environment variable set to `20`.
-   **Sanity Connection**: If data doesn't load, double-check your Environment Variables and ensure your Sanity dataset is public or the token is correct (though for public reads, the project ID is usually enough configured in the text).
