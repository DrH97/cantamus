# Custom display fonts

Two local faces, declared in `app/globals.css`. Both are committed here as
WOFF2 — the only format modern browsers need.

| Family     | File                | CSS variable                      | Used for                                            |
| ---------- | ------------------- | --------------------------------- | --------------------------------------------------- |
| Gilgongo   | `gilgongo.woff2`    | `--font-display`, `--font-accent` | headings (`h1`–`h6`), eyebrow labels, buttons, wordmark |
| Bête Noire | `bete-noire.woff2`  | —                                 | **currently unused** (see below)                    |

Bête Noire held `--font-display` at first, but its inline outline detail is
illegible at the sizes headings actually render at — `text-xl` and down, often
faux-bolded, since the face has no real bold. Headings moved to Gilgongo. The
face is still declared in `app/globals.css` and the file is still here, so it
can be reinstated for large display type without re-converting; nothing
references it, so browsers never download it.

Body copy still uses Geist (`--font-sans`), loaded by `next/font`.

## Provenance

- **Bête Noire** — "Bete Noir NF" by Nick's Fonts, from 1001fonts. Converted
  from `BeteNoirNF.otf`. Licensed under the 1001Fonts *Free For Commercial Use*
  (FFC) terms, which name "websites for companies" as permitted commercial use.
  The EULA ships in the original download; keep a copy with the source files.
- **Gilgongo** — the base "Gilgongo" face (`GILGON__.ttf`), a Ray Larabie
  design. The download carries a designer's note rather than a formal EULA.

Both were converted TTF/OTF → WOFF2 with Google's `woff2` encoder (via the
`wawoff2` npm package), which is a lossless repack of the same outlines.

## Notes

- The original download for Gilgongo contains **eight stylistic variants**, not
  weights: Gilgongo (base, in use), Doro, Kaps, Mutombo, Ombre, Pap, Sledge and
  Tiki. To switch, convert a different one to `gilgongo.woff2` — no code change.
  Doro was tried and reverted: at the small uppercase sizes with wide tracking
  that the accent face is used at, its titles were not readable enough.
- Each family is declared `font-weight: 100 900`, so the single static face
  covers every weight and `font-bold` headings **synthesise** bold rather than
  falling back to Georgia. Neither family ships a real bold, so this is the
  intended behaviour; if a genuine weight is ever added, split it into its own
  `@font-face` block with the actual `font-weight`.
- Georgia remains the fallback on both stacks, so a failed or slow font load
  degrades to a serif rather than to sans-serif.
