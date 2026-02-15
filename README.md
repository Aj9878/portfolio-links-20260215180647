# Portfolio Links

Simple static website that lists important portfolio links in a responsive card grid.

## Files

- `index.html`: page structure and script/style includes
- `styles.css`: visual design, responsive layout, and animations
- `data.js`: link data source (`window.PORTFOLIO_LINKS`)
- `app.js`: validation, normalization, and card rendering logic

## Link Data Contract

Edit links in `data.js` using this schema:

```js
window.PORTFOLIO_LINKS = [
  {
    id: "unique-id",
    title: "Card title",
    description: "Short one-line description",
    url: "https://example.com",
    category: "Profile"
  }
];
```

Rules:

1. `id` must be unique.
2. `title`, `description`, `url`, `category` must be non-empty strings.
3. `url` must resolve to an `https://` URL.

## Run Locally

Option 1:

1. Open `index.html` directly in your browser.

Option 2 (recommended local server):

1. Run:
   ```powershell
   python -m http.server 8000
   ```
2. Visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create or use a GitHub repository.
2. Put these files in the repository root:
   - `index.html`
   - `styles.css`
   - `data.js`
   - `app.js`
3. Push to the `main` branch.
4. In GitHub: `Settings` -> `Pages`.
5. Set source to `Deploy from a branch`, choose:
   - Branch: `main`
   - Folder: `/ (root)`
6. Save and wait for deployment.
7. Open the generated GitHub Pages URL and verify links/cards.

## Notes

- Empty or invalid entries are skipped and logged in the browser console.
- If no valid links exist, the page shows a friendly empty state message.
