# S MUSIC OFFICIAL v2

Responsive maroon/white music-label website with:
- Dynamic Sri Lanka release countdown for **MARAYUM ETHIROZHI — 01 Sep 2026, 4:00 PM**
- Automatic release state after 4 PM Sri Lanka time
- Dynamic "X days ago" release age for released songs
- Separate **Our Album Songs** and **Film Songs** catalogues
- Home recently-uploaded horizontal swipe carousel
- Persistent in-page music player with previous/next/auto-next controls
- MP3 download section
- YouTube links
- Updates/news
- One-time 6-digit admin PIN registration + PIN login
- Forgot PIN email recovery (requires SMTP environment variables)
- Admin song add/edit/delete, MP3/image upload, release date/time, YouTube URL
- Admin logo upload and contact/website settings

## Run locally
```bash
npm install
npm start
```
Open `http://localhost:3000` and `/admin.html`.

## Admin email recovery
The server sends the registered PIN to `settings.email` (seeded as `darkmusic101012@gmail.com`) only when SMTP is configured. Set:
- `SMTP_HOST`
- `SMTP_PORT` (usually 587)
- `SMTP_SECURE` (`true` or `false`)
- `SMTP_USER`
- `SMTP_PASS`
- optional `SMTP_FROM`

Also set a strong `ADMIN_KEY` in production. The default `smusic-admin` is for local development only.

## GitHub/Codespaces note
Do not upload the ZIP as the final project. Extract it, then make the repository root contain `package.json`, `server.js`, `data/`, and `public/`. This app needs Node/Express hosting; GitHub Pages alone cannot run the backend.
