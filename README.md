# 华文小乐园 · Huawen Xiao Le Yuan

A Primary-school Chinese revision web app for students, parents, and teachers.
Static site — no build step. Deploys directly to GitHub Pages or Netlify.

## What's built right now

- **Level 1B, Lessons 11–19** — fully populated: 词语 (words), 生字 (characters),
  偏旁部首 (radicals), ✍️ 笔顺 stroke-order animation (via the open-source
  [Hanzi Writer](https://hanziwriter.org) library, bundled locally in
  `js/vendor/`), and an auto-generated 小测验 (quiz) per lesson.
- **12 level tabs (1A–6B)** are already in the navigation. Only 1B is unlocked;
  the rest show a friendly "being planted 🌱" placeholder until content is added.
- **Demo login** — Teacher / Parent / Student roles, no password. Progress is
  saved in the browser's `localStorage` only (see "About demo mode" below).
- **"Garden" progress model** — each lesson is a plot that grows 🌱→🌿→🌼→🌸→🌻
  as the student's best quiz score for that lesson improves.

## File structure

```
index.html          entry point
css/style.css        all styling (design tokens at the top)
js/data-1b.js         Level 1B lesson content (words, chars, radicals, pinyin, meanings)
js/icons.js           custom SVG flashcard illustrations (CSS-animated for verbs)
js/app.js              app logic: routing, login, flashcards, quiz, dashboards
js/vendor/hanzi-writer.min.js   stroke-order animation engine (MIT licensed)
```

## Deploying

**Netlify:** drag-and-drop this folder onto app.netlify.com, or connect the
GitHub repo and set the publish directory to the project root (no build command needed).

**GitHub Pages:** push this folder to a repo, then in Settings → Pages, set the
source to the `main` branch, root folder.

## Adding the next level (e.g. 1A, 2A…)

1. Duplicate `js/data-1b.js` as `js/data-1a.js` and fill in that level's lessons
   using the same structure (words / recognizeChars / writeChars / radicals /
   strokeRule / a `CHAR_INFO`-style dictionary — merge new characters into a
   shared dictionary or keep a separate one per level, your call).
2. In `index.html`, add a `<script src="js/data-1a.js">` before `app.js`.
3. In `js/app.js`, add `"1A": LEVEL_1A` to the `BUILT_LEVELS` object.
That's it — the level tab unlocks automatically and the garden/flashcard/quiz/
stroke-order machinery all just works against the new data.

## Adding more flashcard icons

`js/icons.js` is a simple lookup: `ICONS["词语"] = "<svg>...</svg>"`. Any word
without an entry just shows the character itself on the flashcard (no broken
images). Add an `class="icon-anim ..."` and a matching `@keyframes` block in
`style.css` to animate a new verb icon, the same way `唱歌`, `打扫`, `刷牙` etc. work.

## About demo mode (login & progress)

GitHub Pages / Netlify only serve static files — there's no real database or
authentication behind this demo. Right now:

- Teacher / Parent / Student are just role buttons; "logging in" picks a demo
  student profile (小明 / 小华 / 小丽) rather than a real account.
- Quiz scores save to that browser's `localStorage` only — they won't sync
  across devices, and clearing browser data resets progress.
- Three demo students are pre-seeded with sample progress so the Teacher and
  Parent dashboards have something to show immediately.

**To make this production-ready** (real accounts, progress that syncs across
devices, a parent seeing only their real child), the site needs a backend —
Firebase Authentication + Firestore is the most common free-tier pairing with
a static site like this. Happy to wire that up when you're ready; it mainly
means replacing the functions in `js/app.js` marked with `STORE_KEY` /
`localStorage` with calls to Firestore, plus a real sign-up/sign-in screen.

## Content source

Lesson 11–19 vocabulary, characters, radicals, and stroke-order rules were
provided by the teacher, based on《欢乐伙伴 2.0》1B, 我会认 / 我会写 lists (2026-07-22).
