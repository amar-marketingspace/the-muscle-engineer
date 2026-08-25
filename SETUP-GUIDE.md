# The Muscle Engineer — Setup Guide

Everything you need to get your new site live and receiving leads. No coding knowledge needed — every step is copy-paste. Total time: about 20 minutes.

---

## 1. What is in this folder

```
index.html                  Your homepage (everything is inside this one file)
blog.html                   The blog listing page with category filters
blogs/
  data.json                 The blog's "database" — one entry per article
  post-1.html               Article: The Science of Fat Loss
  post-2.html               Article: Building Muscle Naturally
  post-3.html               Article: PCOS and Fitness
assets/blog/                Put article cover images here (see README.txt inside)
google-apps-script/
  Code.gs                   The code that connects your form to Google Sheets
SETUP-GUIDE.md              This file
```

One extra file you should add: **logo.png** — your round red/white logo — placed right next to index.html. Download it from your current Wix site (right-click the logo, Save Image As, rename to `logo.png`). Until you do, the site automatically loads the logo from Wix's servers, so nothing looks broken either way.

---

## 2. Connect the contact form to Google Sheets (the important one)

Right now the form is built but not connected — this is the 10-minute job that turns it on. When finished, every enquiry will: appear as a row in your Google Sheet, land in your email inbox instantly, and show the visitor a "Chat on WhatsApp" button.

**Step 1 — Create the Sheet.**
Go to [sheets.google.com](https://sheets.google.com) while signed in as founder.themuscleengineer@gmail.com and create a blank spreadsheet. Name it anything, e.g. `TME Leads`. Leave it empty — the script creates its own "Leads" tab with headers on the first submission.

**Step 2 — Add the script.**
In that Sheet, open the menu: **Extensions > Apps Script**. A code editor opens with a few lines of starter code. Select everything there, delete it, and paste the entire contents of `google-apps-script/Code.gs` from this folder. Press the save icon.

**Step 3 — Deploy it.**
Click the blue **Deploy** button > **New deployment**. Click the gear icon and choose **Web app**. Set:
- Execute as: **Me**
- Who has access: **Anyone**

Click **Deploy**. Google will ask you to authorize — choose your account, and if it shows a "Google hasn't verified this app" warning, click **Advanced > Go to (project name)** and allow. That warning is normal: "this app" is your own 150-line script, and you are the only one authorizing it.

When it finishes, Google shows a **Web app URL** ending in `/exec`. **Copy it.**

**Step 4 — Paste the URL into the website.**
Open `index.html` in any text editor (Notepad works). Press Ctrl+F and search for:

```
PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
```

You will land on this line:

```js
var SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

Replace only the placeholder text between the quotes with your copied URL, so it looks like:

```js
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
```

Save the file. That is the entire connection.

**Step 5 — Test it.**
Once the site is online (next section), fill in your own form and submit. Within seconds you should see: the success panel with the WhatsApp button on the site, a new row in the "Leads" tab of your Sheet, and an email in your inbox with a "Reply on WhatsApp" button. If a submission ever fails, the visitor is shown your WhatsApp link as a backup — no lead is left stranded.

**If you ever edit Code.gs later:** saving is not enough. Go to **Deploy > Manage deployments > pencil icon > Version: New version > Deploy**. The URL stays the same.

---

## 3. Put the site online (free, with GitHub Pages)

1. Create a free account at [github.com](https://github.com).
2. Click **New repository**, name it (e.g. `muscle-engineer`), keep it **Public**, create.
3. Click **uploading an existing file** and drag in everything from this folder — `index.html`, `blog.html`, the `blogs`, `assets` and `google-apps-script` folders, and your `logo.png`. Commit.
4. Go to **Settings > Pages**. Under "Branch", pick `main` and `/ (root)`, then Save.
5. After a minute, your site is live at `https://yourusername.github.io/muscle-engineer/`.

To update the site later, just upload the changed file again on GitHub — it replaces the old one.

**Important:** the blog loads its articles from `blogs/data.json`, which browsers only allow when the site is served from a real address. If you double-click `index.html` on your computer, everything works **except** the blog cards, which will show a "run from a server" message. On GitHub Pages (or any hosting), it all works. Judge the blog on the live site, not the local file.

---

## 4. Add your article cover images

Drop three images into `assets/blog/`, named exactly `post-1-thumb.jpg`, `post-2-thumb.jpg`, `post-3-thumb.jpg` (1200x675px works best). Until then, cards show a clean red dumbbell placeholder — nothing breaks. Details in `assets/blog/README.txt`.

---

## 5. How to add blog post #4 (4 steps, ~10 minutes)

1. **Duplicate an article file.** Copy `blogs/post-3.html`, rename the copy `blogs/post-4.html`.
2. **Edit the copy.** Open it and change: the `<title>` and description at the top, the category chip, the big `<h1>`, the date and read time, and the article text between `<article class="article">` and `</article>`. Near the bottom, find `var POST_ID = 3;` and change it to `4` (this keeps it out of its own "related posts").
3. **Register it in the database.** Open `blogs/data.json` and add a new block at the top, inside the outer `[ ]`, with a comma after it:

```json
{
  "id": 4,
  "title": "Your New Article Title",
  "slug": "your-new-article",
  "excerpt": "One or two sentences shown on the card.",
  "category": "Fat Loss",
  "date": "2026-07-15",
  "readTime": "6 min read",
  "thumbnail": "assets/blog/post-4-thumb.jpg",
  "file": "blogs/post-4.html",
  "author": "Coach Amar",
  "tags": ["tag one", "tag two"]
},
```

4. **Add its thumbnail** as `assets/blog/post-4-thumb.jpg` and upload the three changed files to GitHub.

That single `data.json` entry automatically updates the homepage "latest 3" section, the blog page grid, its category filter, and every article's "related posts" — no other edits anywhere.

Tip: if the blog ever shows "Could not load articles" after an edit, you most likely have a stray or missing comma in `data.json`. Paste the file into [jsonlint.com](https://jsonlint.com) and it will point at the exact line.

---

## 6. Common edits (find & replace in index.html)

- **WhatsApp number** — search `919788966664` and replace every occurrence (it appears in the contact card, success button, error link and footer). Format: country code + number, no plus, no spaces.
- **Email** — search `founder.themuscleengineer@gmail.com`. Also change `NOTIFY_EMAIL` in Code.gs if lead emails should go elsewhere (then redeploy a new version).
- **Stats** — search `data-count` to find the five animated numbers.
- **Testimonial videos** — each story card contains an HTML comment starting `VIDEO-READY SLOT` showing exactly what to paste (a YouTube iframe or a video tag) in place of the photo. The frame and styling adapt automatically.
- **YouTube icon** — your old site's YouTube icon pointed to a placeholder, so it was left out. When you have a real channel, paste this inside the `<div class="socials">` block (it appears in the footer of every page), with your channel URL:

```html
<a class="soc" href="https://youtube.com/@yourchannel" target="_blank" rel="noopener" aria-label="YouTube">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
</a>
```

- **Photos** — every image currently loads from your Wix account's CDN, with graceful placeholders if any link dies. That is fine for launch, but for long-term safety download your photos from Wix, put them in an `assets/img/` folder, and swap the `src="https://static.wixstatic.com/..."` addresses for `assets/img/yourfile.jpg`. Do it any time; nothing is urgent.

---

## 7. Pre-launch checklist

- [ ] `logo.png` placed next to index.html
- [ ] Apps Script deployed and URL pasted into index.html (section 2)
- [ ] Test submission shows in Sheet + email + WhatsApp button works
- [ ] Site uploaded to GitHub Pages and blog cards load on the live URL
- [ ] Three thumbnails added to `assets/blog/`
- [ ] Phone test: open the live URL on your phone, tap the menu, submit the form

You are live. Ignite · Improve · Inspire.
