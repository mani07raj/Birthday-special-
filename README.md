# 🎂 Birthday Celebration Website

A personal, production-ready birthday celebration website built with pure HTML, CSS, and vanilla JavaScript — no frameworks, no build tools. Deploys instantly on GitHub Pages.

🌐 **Live Site:** [https://mani07raj.github.io/Birthday-special-/](https://mani07raj.github.io/Birthday-special-/)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎈 Hero Section | Full-screen animated entrance with floating balloons & confetti |
| 💌 Heartfelt Message | Personal letter in an elegant card with flickering candle glow |
| 📸 Photo Gallery | Responsive grid with hover zoom & overlay effects |
| 💛 Wishes Section | 5 elegantly styled birthday wish cards in colour variants |
| 🎂 Cake Cutting | Cinematic interactive experience — candles blow, cake cuts, hearts float |
| 🎊 Confetti Engine | Custom canvas-based confetti (no CDN needed) |
| 🎵 Music Player | Fixed floating button, loops background music |
| ⏱️ Birthday Banner | Auto-detects today's date — shows countdown, "It's Your Day!", or belated banner |
| 📱 Fully Responsive | Works beautifully at 375px mobile all the way to desktop |

---

## 🎬 Cake Cutting Sequence

1. Cake appears with 5 animated flickering candles + floating balloons
2. "Make a wish…" prompt fades in
3. User clicks **"Cut the Cake!"**
4. Candles blow out one by one 🕯️
5. Knife swings in and cake shakes 🔪
6. Cake splits apart with shine effect
7. Hearts burst across the screen ❤️💕💖
8. Birthday reveal with confetti blast 🎉

---

## 📁 File Structure

```
Birthday-special-/
├── index.html           ← All sections & content
├── style.css            ← Full design, animations, responsive styles
├── script.js            ← Confetti engine, cake logic, music, countdown
├── README.md            ← This file
└── assets/
    ├── images/
    │   ├── photo1.png
    │   ├── photo2.png
    │   ├── photo3.png
    │   ├── photo4.png
    │   └── photo5.png
    └── audio/
        └── bday-music.mp3
```

---

## 🛠️ Quick Edit Guide

| What to change | Where |
|---|---|
| Name | Search the name in `index.html` |
| Birthday date (for countdown/banner) | Line 1 of `script.js` → `BIRTHDAY_DATE` |
| Heartfelt message | `#message` section in `index.html` |
| Photos | Replace files in `assets/images/` |
| Music | Replace `assets/audio/bday-music.mp3` |
| Footer credit | Search `Maniraj` in `index.html` |

---

## 🚀 Deploy on GitHub Pages

1. Push this repo to GitHub (already done ✅)
2. Go to **Settings → Pages**
3. Set Source → **main branch → / (root)**
4. Save — live in ~2 minutes

---

## 🎨 Design

- **Fonts:** Playfair Display (headings) + Poppins (body) via Google Fonts
- **Palette:** Blush pink · Gold · Cream · Deep maroon
- **Animations:** CSS keyframes + IntersectionObserver scroll reveals
- **No dependencies** — zero npm, zero build step, zero CDN for logic

---

Made with ❤️ by **Maniraj**
