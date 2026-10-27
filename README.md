# 🌿 Meadow OS

A personal downloads hub for my projects, built to look and feel like a classic early-2000s desktop operating system — running entirely in your browser, hosted for free on GitHub Pages.

Browse and download my releases through a retro desktop UI complete with draggable windows, a taskbar, a built-in terminal, a Classic Games folder, a fake internet browser, and more.

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
- Open **Classic Games** for Snake, Breakout, and Frog Crossing
- Launch **MeadowExplorer** to browse the fake `.mow` internet
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

## Built-in Apps

| App | Description |
|---|---|
| **Downloads** | Browse and download all GitHub releases |
| **About Me** | Markdown viewer for your personal `about.md` |
| **Terminal** | Command-line interface — type `help` for commands |
| **Classic Games** | Folder containing Snake, Breakout, and Frog Crossing |
| **MeadowExplorer** | Fake internet browser — see below |
| **Recycle Bin** | It's a recycle bin |
| **Display Properties** | Change the colour theme |

---

## MeadowExplorer — The `.mow` Internet

MeadowExplorer is a built-in fake web browser that routes `.mow` domains to six fully hand-coded fictional websites. Type any address into the address bar, use the Favourites bar for quick access, or navigate back and forward like a real browser.

### The `.mow` Web

| URL | Site | Description |
|---|---|---|
| `www.grassknoll.mow` | **Grass Knoll** | Parody search engine — returns hilariously wrong results for anything you type, complete with "People also ask" questions like "Should I be worried?" |
| `www.notabird.mow` | **NotABird** | Parody social media — a full dark-mode timeline of absurd posts from users like `@WormMagnate`, `@pigeon_witness`, and `@fog_investigator`, with trending topics, chirp counts, and a compose box |
| `www.meadowpedia.mow` | **MeadowPedia** | Parody encyclopedia — nine full fake articles including *Birds* (government drones since 1987), *The Great Worm War of 2003*, *The Invisible Sandwich*, *Shadow Sentience*, and more |
| `www.frogtube.mow` | **FrogTube** | Parody video platform — a grid of fake videos; clicking any opens a player where the "video" is a bouncing DVD logo animation, with fake comments, progress bar, and an "Up Next" sidebar |
| `www.shoppe.mow` | **The Shoppe** | Parody e-commerce — sells things that shouldn't exist: *A Jar of Ambient Noise*, *Pre-Tangled Headphones (Mystery Length)*, *Yesterday's Air (2019 Vintage)*, *Confident Currency*, and more. Fully browsable with product pages, reviews, and a working cart |
| `www.doomscroll.mow` | **Doomscroll** | Parody news/Reddit feed — posts escalate from mildly weird to fully unhinged; click any headline to expand fake comments; infinite scroll loads more the further down you go |

### Browser features
- Back / Forward / Refresh / Home buttons with full history stack
- Favourites bar with one-click shortcuts to all six sites
- Animated loading bar
- Status bar
- Friendly 404 page for unknown `.mow` addresses

---

## License

MIT — fork it, reskin it, make it your own.

---

## Classic Games — Intellectual Property Notice

The **Classic Games** folder contains three browser games: **Snake**, **Breakout**, and **Frog Crossing**. All three are fully original, independently written implementations. The following points apply to each:

- **No proprietary source code was copied, ported, or adapted.** Every line was written from scratch in vanilla JavaScript.
- **No proprietary artwork, sprites, sounds, or trade dress was reproduced.** All visuals are drawn programmatically using the HTML5 Canvas API with no external assets.
- **Game mechanics are not protected by copyright.** The general concepts of a snake eating food and growing, a ball bouncing off bricks to destroy them, and a character hopping across lanes of traffic are well-established, unpatentable game mechanics that exist across countless independent implementations. Copyright law does not protect ideas, concepts, or game rules — only specific creative expression such as code and artwork.
- **The name "Frogger" is a registered trademark of Konami Holdings Corporation.** This project deliberately does not use that name. The equivalent game in this project is titled **Frog Crossing** to avoid any trademark association.
- **This project is non-commercial.** No revenue is generated, no ads are shown, and no fees are charged. It is a personal portfolio site hosted for free on GitHub Pages.

### Original rights holders and credits

| Game in this project | Inspired by | Original rights holder |
|---|---|---|
| Snake | Snake (Nokia, ~1998) | Nokia Corporation |
| Breakout | Breakout (Atari, 1976) | Atari SA |
| Frog Crossing | Frogger (Konami, 1981) | Konami Holdings Corporation |

All trademarks, trade names, and intellectual property referenced above belong solely to their respective owners. Their mention here is for attribution purposes only and does not imply any affiliation, endorsement, or sponsorship.

A more detailed disclaimer is included inside the app at `data/classic-games/DISCLAIMER.txt`.
