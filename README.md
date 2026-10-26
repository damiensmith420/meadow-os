# 🌿 Meadow OS

A personal downloads hub for my projects, built to look and feel like a classic early-2000s desktop operating system — running entirely in your browser, hosted for free on GitHub Pages.

Browse and download my releases through a retro desktop UI complete with draggable windows, a taskbar, a built-in terminal, Snake, and more.

---

## 🖥 Visit the Site

**[damiensmith420.github.io/meadow-os](https://damiensmith420.github.io/meadow-os)**

No installation. Just open it in any browser.

---

## What's Available

| Project | Description |
|---------|-------------|
| **SaveVault** | Back up your game saves to your own Google Drive |

More projects coming soon.

---

## How to Use

**On desktop:**
- Double-click the **Downloads** folder icon to browse all projects
- Open a project folder to see its releases
- Click any release asset to download it directly from GitHub
- Right-click files or folders for a **Properties** dialog with size, date, and download counts
- Try the **Terminal** — type `help` for available commands
- Hit the green **Meadow** button in the bottom-left for the app menu
- Change the colour theme via **Display Properties** (right-click the desktop or use the menu)

**On mobile:**
- The site switches automatically to a clean expandable list layout

---

## About This Site

Meadow OS is a fully static site — plain HTML, CSS, and vanilla JavaScript with no frameworks and no build step. It runs entirely in your browser and is hosted for free on GitHub Pages.

Release data is kept fresh by a GitHub Actions workflow that runs every 6 hours and caches the latest release info from the GitHub API.

---

## Want to Run a Copy Yourself?

Meadow OS is open source. Fork the repo, swap out the project list, and have your own retro downloads hub live in minutes.

### Quick setup

1. **Fork** this repository on GitHub
2. Go to **Settings → Pages** → Source: **Deploy from branch** → `main` / `/ (root)` → Save
3. Edit `data/repos.json` to list your own GitHub repos (see format below)
4. Go to **Actions → Update Releases Cache → Run workflow** to pull in release data
5. Your site is live at `https://<your-username>.github.io/<repo-name>/`

### Adding a project to the downloads list

Open `data/repos.json` and add an entry:

```json
{
  "repo": "your-username/your-repo",
  "label": "Display Name",
  "description": "One line description shown in the UI.",
  "icon": "folder-code"
}
```

Push the change — the workflow triggers automatically and your project appears in the Downloads window.

### Editing the About Me page

Open `data/about.md` and write whatever you like. It renders as Markdown in the in-app Notepad window.

### Running locally

`fetch()` can't load local JSON files over `file://`, so use a simple server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

---

## License

MIT — fork it, reskin it, make it your own.
