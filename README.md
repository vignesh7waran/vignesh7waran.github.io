# vigneshwarans.me

My personal website. One page, black and white, with a tiny scripted model (v-mini) that answers questions about me.

## Files

| File | What it does |
|---|---|
| `index.html` | The page content |
| `style.css` | Colors, fonts, layout (light + dark) |
| `script.js` | Theme toggle, name intro, v-mini chat |
| `assets/resume.pdf` | **Add your resume here** (the resume icon links to it) |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Tells GitHub Pages to serve files as they are |

## Run locally

```bash
cd vigneshwarans.me
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy on GitHub Pages (free)

1. Create a new repo on GitHub and push these files.
2. Repo → Settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. In Namecheap → Domain → Advanced DNS, add:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www`: `<your-github-username>.github.io`
4. Back in Settings → Pages, enter `vigneshwarans.me` as the custom domain and tick **Enforce HTTPS** once it appears.

## Edit content

- Text and projects: `index.html`
- v-mini questions and answers: the `questions` list in `script.js`
- Colors: the variables at the top of `style.css`

Fonts: Archivo, Source Serif 4 and Geist Mono from Google Fonts.
