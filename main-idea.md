# Main Idea
- This is a demo project used in university lectures

1. We fetch a character from external API
2. Right now we have "Save" if we like some character and then
3. Click on the saved.html if we wan't to like some character
4. Click on liked.html to see the liked characters

As seen from this flow it's total stupidity. The correct flow is:
1. We fetch a character from external API
2. We show the character info, but
  -  we don't need the episodes in the character info
  - "Save" button should be replaced with "Like"
3. saved.html is deleted as it is not needed. Instead liked.html will be used
  - if user like a character, then we store this in the characters.json (there is one record for reference how the data should look like and how should be stored)
4. clicking on liked.html should load a table as now, which will have a pagination and option to delete character

There is another one requirement. As this is a demo project, firstly it shows how we store data in file, and as second it will show how this data is retrieved from database.
This second part will be situated in Vagrant example and you should suggest me how to approach this, so we can extend a bit the app to check if there is available data source, and if not - to stick to writing in characters.json

One bug noted: when fetching character and pages reload - the background goes to light theme, then goes back to dark-theme if dark theme is set.
One UEX failure - right now the character profile section is kind of a boring
Navbar - remove saved.html

---

## Implementation Flow

### Phase 1 — Core flow corrections (30 min)

1. Navbar cleanup — remove "Saved" link from both index.html and liked.html. Keep only Home + Liked.
2. Remove Episodes badge — delete the heroEpisodes hero-badge div from index.html and the corresponding DOM read in processResponseData() / clearElements() in fetch.js.
3. Rename Save → Like — rename the button in index.html, rename saveData() → likeData() in the inline script, and repurpose saveIt() in fetch.js to store the full character payload (same shape as characters.json) to the API primary / localStorage fallback. The separate likeIt() (which currently increments a like counter on an already-saved character) becomes redundant — merge it into the single "like" action.
4. Delete saved.html.

### Phase 2 — liked.html upgrades (45 min)

5. Delete column — add a Delete column, render a trash button per row that calls a deleteIt(id) function (API DELETE + localStorage fallback).
6. Pagination — add a Bootstrap pagination strip below the table. Store pageSize = 10 and a currentPage variable; slice the rendered array accordingly. Update _renderLikedTable() to accept the sliced subset and re-render both the table and pagination on page change.

### Phase 3 — Bug fix (15 min)

7. Theme flicker — theme.js is loaded at the end of body, so the page renders light before the dark class is applied. Fix: move the bare-minimum theme-detection logic (read localStorage, set document.documentElement.className) into an inline script inside head, before any CSS. Keep the full theme.js where it is for the toggle button behavior.

### Phase 4 — UX polish (open-ended)

8. Character card — the badges are functional but flat. Options: add a subtle radial glow behind the avatar, color-code the status badge (already partially done), or add a thin animated border on the card entrance.

### Phase 5 — Vagrant/DB extension (design decision)

The app already has a 2-layer fallback: API → characters.json. For the Vagrant demo, add a probeDataSource() function that does a fetch to the Vagrant URL with a short timeout (1.5 s). If it responds, set activeApiUrl = vagrantUrl; otherwise fall through to Azure, then characters.json. This teaches environment-aware data source selection without changing the rest of the logic.

Suggested order to implement: 1 → 2 → 3 → 4 → 7 → 5 → 6 → 8 → Vagrant