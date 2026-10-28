# Abandoned, Not Forgotten — Space Legacy Archive

A bilingual (English/Arabic) static website starter for an educational NASA Space Apps Challenge project.

## Pages
1. `index.html` — landing page
2. `explorer.html` — Moon/Mars destination explorer
3. `archive.html` — searchable/filterable artifact archive
4. `story.html?id=...` — dynamic mission story page (six story records)
5. `lab.html` — interactive science quiz
6. `sources.html` — primary source directory and verification notes

## Run locally
**Simplest:** extract the ZIP, then double-click `index.html`.

**Recommended:** open the folder in VS Code and use the Live Server extension, or run:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.

No build step, backend, API key, or package install is required. Google Fonts may require internet access; the site falls back to system fonts.

## Language
Use the `عربي` / `English` toggle in the header. The preference is saved in localStorage.

## Scientific accuracy notes
- Mission descriptions are short educational summaries and must be reviewed against the linked primary source before submission.
- The visual rover/planet artwork is CSS illustration, not a reconstruction or NASA photograph.
- Some NASA mission page URLs may change; confirm all links during final review.
- Verify image licensing and attribution before adding real photographs.
- This is an independent educational project and is not affiliated with or endorsed by NASA.

## Suggested final checks
- Test all six pages in Chrome, Firefox, and mobile layout.
- Try archive search and Moon/Mars/type filters.
- Complete all three quiz questions and restart the quiz.
- Toggle Arabic and English on every page.
- Check every source link and verify dates/statuses.
