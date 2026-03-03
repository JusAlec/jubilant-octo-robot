# QR8 — AI-Powered Web Development Agency

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Deploy to GitHub Pages

### Option A: Automatic (Recommended)

The included GitHub Actions workflow auto-deploys on every push to `main`.

1. Create a new GitHub repository
2. Push this code to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. In your repo, go to **Settings → Pages**
4. Under **Source**, select **GitHub Actions**
5. The workflow will run automatically — your site will be live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Option B: Manual

```bash
npm run build
```

Upload the contents of the `dist/` folder to your hosting provider.

## Build for Production

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Project Structure

```
qr8-site/
├── .github/workflows/deploy.yml   # Auto-deploy workflow
├── public/                         # Static assets
├── src/
│   ├── App.jsx                     # Main QR8 page component
│   └── main.jsx                    # React entry point
├── index.html                      # HTML template
├── package.json
└── vite.config.js
```
