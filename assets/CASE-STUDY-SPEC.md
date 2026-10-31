# Case-study page spec for janagramlich.com

Taken from the 4 live project pages (WordPress CMS `cms.janagramlich.com`, post type `projects`). Use it for every new project.

## Page anatomy (rendered by the bottom sheet on index.html)

| Order | Element | Source ACF field | Rule |
|---|---|---|---|
| 1 | Hero | `hero_image` or `_video_file_desktop` / `_video_file_mobile` | One 16:9 image or a looping video |
| 2 | Title | `title` | Shape: "Brand + topic", e.g. "About You Design System" |
| 3 | Short facts | `shortfacts[]` (label/value) | Always `Year`, `Brand`, then `Agency` and/or `Position` |
| 4 | Intro | `text` (HTML `<p>`) | 2–3 paragraphs, first person: context → goal → result. The first 1–2 sentences become the card teaser. |
| 5 | My role | `my_role` | 1–2 sentences, first person, starting "I …" |
| 6 | CTAs | `call_to_action[]` | 1–2 links to the live product or app store |
| 7 | Body | `section[]` flexible content | Mainly `image`, plus 2× `kpi-numbers`, optionally `video` / `prototype` (Figma embed) / `title_and_text` |

## Rhythm used on live pages

`image, image, kpi-numbers, 5–12 images, kpi-numbers, 4–12 images`

- Each KPI row has 2 values: `unit-left`/`label-left` and `unit-right`/`label-right`. Keep the number short (`13M`, `+15%`, `250+`) and the label 1–3 words.
- 15–33 sections per page.

## Image spec

| Property | Value |
|---|---|
| Ratio | 16:9 |
| Size | 2554×1437 (preferred) or 1920×1080. Older pages use 2400 px wide. |
| Format | PNG for UI and slides, JPG for photos |
| Style | Style-guide slides: black left sidebar (eyebrow, title, Usage / Restriction bullets) and content on white. Each slide makes one point. |
| Background | Matches the project's `background_color` (`#f2f2f2` / `#f5f5f5` by default, or a brand tint such as Douglas `#edd3de`) |
| Naming | `NN-topic.png`, in the order it appears on the page |

## Workflow for a new project (≈30 min)

1. **Sources**: Figma files and the deck. List the pages and frames (`get_metadata`) and pick slides that are already 1920×1080.
2. **Select**: one slide per decision (logo, color, type, components, applications). The outcome comes first; process slides are optional.
3. **Confidentiality check**: leave out costs and licenses, colleague and executive names, internal URLs and tickets, unreleased plans, and harsh audit quotes.
4. **Export**: use Figma `get_screenshot` on each frame (1920×1080 max) and save to `assets/<slug>/NN-topic.png`.
5. **Copy**: fill in the `CONTENT.md` template (header fields, `text`, `my_role`, section table, left-out list).
6. **Upload**: add the media in WordPress → create the project → add the ID to `WP_PROJECT_IDS` in `index.html`.

## Automation opportunities

- Script steps 4–5: give it a list of Figma frame IDs and get back the exported PNGs plus the section table.
- Push straight to the CMS with the WP REST API (`POST /wp/v2/media`, `POST /wp/v2/projects` with `acf`). This needs an application password.
- Make `WP_PROJECT_IDS` dynamic (`GET /wp/v2/projects`) so new projects appear without editing the code.
