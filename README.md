# 🎸🎹 OCTAVIOUS — The Guitar & Piano Scale Explorer

**Hey, I'm Octavious.** Nice to meet you.

I live inside a single HTML file, and my whole reason for existing is to make music theory *visual* — so you can stop guessing at scales and start playing them. I show you every note on a fretboard and a keyboard at the same time, I work out key signatures for you, I build the chords for whatever key you pick, and if you tell me a song you love, I'll go find its key on the web and set everything up myself.

I'm free, I'm yours, and I want absolutely everyone to have me. **Download me. Open me up. Poke around. Break something and fix it. Remix me into whatever you need.** If any of that helps you write your first song, or your fiftieth — that's the whole point of me. 🎶

---

## Why you'll want me around

- **I show you, I don't just tell you.** Every note lights up on a real fretboard *and* a real keyboard side by side — no more translating theory into shapes in your head.
- **I know every key and every mode.** Major Pentatonic, Minor Pentatonic, Blues, and all seven modes (Ionian through Locrian) — just pick one and I'll draw it for you.
- **I speak in sharps or flats — your call.** Toggle between the two anywhere, and I'll relabel every note on the fretboard, the keyboard, the chords, and the key dropdown to match.
- **I do the key signature math so you don't have to.** Sharps, flats, all worked out the second you choose a key.
- **I build your chords for you.** See the diatonic chords for any key, click one to reveal its notes, and start jamming or writing progressions right away.
- **Triads or 7th chords — your call.** Flip a toggle to swap plain triads (I, ii, iii...) for full diatonic 7th chords (Imaj7, ii7, iii7, IV maj7, V7, vi7, viiø7), notes and all.
- **My favorite trick — Song Key Lookup.** Tell me a song you love and I'll search the web for its key, then set up the whole board myself. Bring your own API key from Anthropic, OpenAI, Groq, or Gemini, and I'll use it — your key stays on your machine.

I'm not just a reference chart sitting there looking pretty. I'm a launchpad. Pick a key with me, see its chords, hear how they sit together, and start building your own progressions and melodies from there.

---

## Two ways to run me

### Option A — Just open the HTML file (no setup)
Double-click `OCTAVIOUS_INTERACTIVE_APPLICATION.html` or open it in a browser. Every scale, chord, keyboard, and fretboard feature works immediately, no installs needed. The **Song Key Lookup** feature will only work here if you're viewing me inside a **Claude.ai** conversation as an artifact (more on that below).

### Option B — Run me locally with your own API key (recommended for Song Key Lookup)
This spins up a tiny local server on your computer that keeps your API key private and lets Song Key Lookup work anywhere, anytime.

**Windows:**
1. Double-click `start.bat`.
2. Your browser opens automatically to `http://localhost:8787`.

**Linux / macOS:**
1. Open a terminal in this folder and run `./start.sh` (or just double-click it, if your file manager runs shell scripts).
2. Your browser opens automatically to `http://localhost:8787`.

Either launcher will:
- Check that you have [Node.js](https://nodejs.org) 18+ installed (and tell you where to get it if not),
- Create a `.env` file from `.env.example` the first time you run it,
- Start the local server,
- Open me in your default browser automatically.

Once I'm open, expand the **API Settings** panel near the top, pick your provider (Anthropic, OpenAI, Groq, or Gemini), paste your API key, and hit **Save to .env**. From then on, Song Key Lookup uses that key directly — no key ever touches the page's visible HTML or gets sent anywhere except straight to the provider you chose.

---

## Get started in 10 seconds

1. Open me up (see above).
2. Pick a **Key** and **Scale/Mode** from my dropdowns — watch the fretboard and keyboard light up instantly.
3. Prefer flats over sharps (or vice versa)? Flip the **Note Spelling** toggle next to the dropdowns and I'll relabel everything to match.
4. Scroll down and I'll show you the **Key Signature** and **Chords in the Key** — click any chord and I'll reveal its notes.
5. Or just type a song into my **Look Up a Song's Key** box up top and let me do the work for you!

---

## What I can do

- **Full chromatic reference** — every note on the fretboard (standard tuning, frets 0–12) and every key on a 2-octave piano, always visible so you never lose your place.
- **Key + Scale/Mode picker** — choose any root note (C–B) and one of:
  - Major Pentatonic, Minor Pentatonic, Blues
  - Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian
- **Sharp/Flat note spelling toggle** — switch between sharp names (C#, D#, F#, G#, A#) and flat names (Db, Eb, Gb, Ab, Bb) at any time. It relabels the key dropdown, both fretboards, both keyboards, the scale/chord titles, and the chord grid — purely a display preference, so it never changes the underlying key signature (which always uses the theoretically correct spelling for that key) or how Song Key Lookup parses results.
- **Interactive scale board** — I re-render the fretboard and keyboard to highlight the root note, scale tones, and (for Blues) the ♭5 "blue note."
- **Key signature panel** — I automatically work out how many sharps/flats your chosen key/mode takes, and list them.
- **Chords in the Key** — I build the diatonic triads (I, ii, iii, IV, V, vi, vii°, etc.) for your chosen key, with a click-to-reveal note breakdown for each chord and a "Show all / Hide all" toggle. A **Triads / 7th Chords** switch lets you swap to full diatonic 7th chords (maj7, m7, dominant 7, half-diminished ø7) whenever you want richer voicings.
- **API Settings** — an optional panel for choosing your AI provider (Anthropic / OpenAI / Groq / Gemini) and saving your API key locally, when running me via the local server.
- **Song Key Lookup** — tell me a song title (and artist, for accuracy) and I'll search the web for its commonly cited key, then set my Key and Scale dropdowns and refresh everything to match.

---

## Bringing your own API key — supported providers

| Provider | Live web search? | Get a key |
|---|---|---|
| **Anthropic (Claude)** | ✅ Yes | https://console.anthropic.com/ |
| **OpenAI** | ✅ Yes | https://platform.openai.com/api-keys |
| **Google Gemini** | ✅ Yes (via Google Search grounding) | https://aistudio.google.com/apikey |
| **Groq** | ❌ No — answers from the model's own knowledge | https://console.groq.com/keys |

You only need **one** key from **one** provider — pick whichever you already have or trust most. Keys are saved to a local `.env` file in this folder (never committed if you use git — `.gitignore` already excludes it) and are only ever sent directly from your machine to the provider you chose, via my local server. They're never written into the page's HTML or exposed to your browser's page source.

You can also skip all of this and just edit `.env` directly with a text editor — copy `.env.example` to `.env` and fill in the key(s) you want.

---

## Important: Where Song Key Lookup Works

| Setup | Fretboard / piano / key signature / chords | Song Key Lookup |
|---|---|---|
| Opened directly as a file, no local server | ✅ Yes | ❌ No |
| Running locally via `start.sh` / `start.bat`, with an API key saved | ✅ Yes | ✅ Yes |
| Viewed inside a Claude.ai artifact (no local server) | ✅ Yes | ✅ Yes, using claude.ai's own built-in authentication |

I automatically detect which situation I'm in: if my local server is reachable, I use whichever provider you've set as active in **API Settings**. If it's not reachable, I fall back to claude.ai's own artifact method — which only works while you're viewing me inside a Claude.ai conversation.

---

## What's inside me

```
OCTAVIOUS_INTERACTIVE_APPLICATION.html   The whole app: markup, styles, and all logic
server.js                                 Local server: serves the app, manages .env, proxies API calls
.env.example                              Template for your API keys — copy to .env and fill in
.gitignore                                Keeps your real .env (and node_modules) out of version control
start.sh                                  Launcher for Linux & macOS
start.bat                                 Launcher for Windows
README.md                                 This file
```

Inside the HTML file itself:

```
<style>            My theming (CSS variables), layout, and component styles
<body>
  API Settings panel            Provider picker + API key input, saved to .env via the local server
  Song Key Lookup panel         Textbox + button + status line
  Full Fretboard Reference      Static SVG, all notes, frets 0-12
  Full Piano Reference          Static SVG, all notes, 2 octaves
  Key / Scale controls          The two <select> dropdowns
  Note Spelling toggle          Sharp/flat display switch
  Key Signature panel           Sharps/flats for the current key
  Chords in the Key panel       Diatonic triads, click to reveal notes
  Triads / 7th Chords toggle    Swaps plain triads for full diatonic 7th chords
  Interactive Scale Board       SVG fretboard, highlights current key/scale
  Interactive Scale Piano       SVG keyboard, highlights current key/scale
<script>
  Note/scale/chord data + rendering logic (SVG drawing, key signature math, chord building)
  displayName()                  Returns a note's name as a sharp or flat, based on the current toggle
  wireAccidentalToggle()          Wires the Note Spelling toggle and re-renders everything on change
  buildDiatonicChords()            Stacks thirds on the current key's parent mode to build triads or 7th chords
  wireChordExtensionToggle()       Wires the Triads / 7th Chords toggle and re-renders the chord grid on change
  wireApiSettings()              Detects local server, renders provider badges, saves keys
  wireSongLookup()                Runs the lookup via the local server OR the claude.ai fallback
  init()                          Wires up controls and renders the default view (A Minor Pentatonic)
```

---

## Customizing my Song Key Lookup

Want to make me your own? Go for it — I'm meant to be tinkered with.

**Changing what I ask each provider** — see `SYSTEM_PROMPT` near the top of `server.js`. It's shared across all four providers and expects a strict JSON reply:
```json
{"song": "...", "artist": "...", "root": "C", "quality": "major", "source": "..."}
```
If you add fields here (tempo, capo suggestion, alternate keys), update the matching `call<Provider>()` function in `server.js` to parse them.

**Changing models** — each provider's function in `server.js` (`callAnthropic`, `callOpenAI`, `callGroq`, `callGemini`) has its model name hard-coded near the top of its `fetch` call — swap in whichever model you prefer from that provider.

**Changing the claude.ai fallback** — that logic lives in `lookupViaClaudeArtifact()` inside the HTML file's `<script>` block, and only ever runs when my local server isn't reachable.

Once I get a result, I map `quality` to a scale:
- `"major"` → **Ionian**
- `"minor"` → **Aeolian**

Want song lookups to default to pentatonic scales instead of full modes? Find this line in the HTML file (it appears twice — once per lookup path) and change it:
```js
scaleSelect.value = result.quality === "major" ? "ionian" : "aeolian";
```

---

## If something's not working

**Node.js not found when I run `start.sh` / `start.bat`**
Install Node.js 18 or newer from https://nodejs.org, then run the launcher again.

**My browser didn't open automatically**
Just visit `http://localhost:8787` manually — the server is still running in your terminal.

**"No API key configured for the selected provider"**
Open **API Settings**, pick your provider, paste a key, and click **Save to .env** — or edit `.env` by hand.

**I say "You're offline" even though you have internet**
I check the browser's `navigator.onLine` flag, which is occasionally wrong (e.g. on some VPNs or captive portals). Try again — I'll also fail gracefully with a connection error if the network request itself doesn't go through.

**I say "Couldn't find a reliable key for [song]"**
My search didn't turn up a confident, commonly-cited key. Try adding the artist name, or use the exact song title. (Groq in particular has no live web search, so it relies on what the model already knows.)

**"Got an unexpected key format"**
Rare — happens if a search turns up a key spelled with a flat (e.g. `Bb`) instead of the sharp-only format I expect. Try the search again; the `root` values I understand are limited to: `C, C#, D, D#, E, F, F#, G, G#, A, A#, B`. (This is separate from the Note Spelling toggle, which only changes how notes are *displayed* after a lookup succeeds — Song Key Lookup itself always parses sharp-only internally.)

**Nothing happens when you click "Find Key" and you're not running the local server**
You're viewing me as a plain file outside of claude.ai (see [Where Song Key Lookup Works](#important-where-song-key-lookup-works) above). Either run me via `start.sh` / `start.bat` with your own API key, or open me inside a Claude.ai conversation.

---

## Go make something with me 🎼

Pick a key, look at its chords, find a progression you like, and start writing. Look up a song you admire and see what key it's built in — then try writing your own melody in that same key. Pass me along to a friend who's learning guitar or piano. There's no gatekeeping here — just open me up and start making music.

---

## A few notes about me

- I assume standard guitar tuning: **e B G D A E** (high to low, top to bottom as drawn).
- My Pentatonic and Blues scales borrow their key signature and diatonic chords from their relative natural major/minor scale, since they're not traditionally notated with their own key signature.
- When the Triads / 7th Chords toggle is set to 7th chords, I label the diminished seventh built on scale degree 7 with the standard half-diminished symbol (m7♭5 / ø7) rather than a fully diminished 7th, since that's the chord that actually occurs in the major/natural-minor family of modes.
- Everything I draw is inline SVG — no external chart libraries required.
- My local server (`server.js`) uses only Node's built-in modules — no `npm install` required, ever.
- Never share your `.env` file, screenshots of it, or your API keys with anyone. `.gitignore` is already set up to keep `.env` out of version control if you use git.

— Octavious
