# WhatsApp Screenshot Sorter

Drag & drop WhatsApp screenshots → AI reads the date from the header → groups by year/month.

## Deploy to Netlify (5 minutes)

### Step 1 — Upload to GitHub
1. Create a new repo on github.com
2. Upload all these files keeping the folder structure

### Step 2 — Deploy on Netlify
1. Go to netlify.com → "Add new site" → "Import from Git"
2. Connect your GitHub repo
3. Build settings are auto-detected from netlify.toml
4. Click Deploy

### Step 3 — Add your API key
1. In Netlify dashboard → Site settings → Environment variables
2. Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
3. Redeploy (Deploys tab → Trigger deploy)

Done! Your app is live.

## Folder structure
```
whatsapp-sorter/
├── netlify.toml
├── netlify/
│   └── functions/
│       └── read-date.js
└── public/
    └── index.html
```
