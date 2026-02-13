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

-   **Framework Preset**: `Next.js (Static HTML Export)`
-   **Build command**: `npm run build`
-   **Build output directory**: `out`

> [!IMPORTANT]
> **If you already created the project**:
> Go to **Settings** > **Builds & deployments** > **Build configuration** > **Edit**.
> Change **Build command** to `npm run build` and **Build output directory** to `out`.
> Then go to **Deployments** and trigger a new deployment (or push a new commit).

## Step 4: Add Environment Variables

Go to the **Environment variables** section and add the following keys. You can find these values in your local `.env.local` file or Sanity management dashboard.

| Variable Name | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity Project ID | `xyz123` |
| `NEXT_PUBLIC_SANITY_DATASET` | Your Sanity Dataset | `production` |

> [!IMPORTANT]
> The `NEXT_PUBLIC_` prefix is required for these variables to be available to the browser-side code.

## Step 5: Save and Deploy

## Step 6: Automate Content Updates (Deploy Hooks)

Since the site is static, it needs to be rebuilt to show new content from Sanity. You can automate this:

1.  **In Cloudflare Pages**:
    -   Go to **Settings** > **Builds & deployments** > **Deploy hooks**.
    -   Click **Add deploy hook**. Name it "Sanity Update".
    -   Copy the generated URL.

2.  **In Sanity Management** (https://www.sanity.io/manage):
    -   Select your project > **API** > **Webhooks**.
    -   Create a new webhook:
        -   **Name**: Cloudflare Build
        -   **URL**: Paste the Cloudflare Hook URL.
        -   **Trigger**: On "Create", "Update", "Delete".
    -   Save.

## Step 7: Allow Studio Access (CORS)

For the `/studio` page to work on your production site, you must whitelist your Cloudflare domain in Sanity.

1.  Go to **Sanity Management** (https://www.sanity.io/manage).
2.  Select your project > **API** > **CORS Origins**.
3.  Click **Add CORS Origin**.
4.  Enter your production URL (e.g., `https://yes-scholarship.pages.dev`).
5.  Check **Allow credentials**.
6.  Save.

Now, refresh your production `/studio` page, and you should be able to log in normally.

## Troubleshooting

-   **Studio 401 Error**: If you see "User is missing grants" or "Register" instead of Login, it means you missed **Step 7** (CORS).
-   **Build Errors**: Check the build logs.
-   **Sanity Connection**: If data doesn't load, double-check your Environment Variables and ensure your Sanity dataset is public or the token is correct (though for public reads, the project ID is usually enough configured in the text).
