# YPO MENA FY26-27 Chapter KPI Scorecard

An interactive scorecard for tracking the 27 YPO MENA chapters against the FY26-27
Regional Chapter KPI Scheme.

## What it is

A single self-contained React component (`src/ScoreCard.jsx`) that renders:

- A sortable (A→Z by default, or by score) table of all 27 chapters
- Each row expands into a KPI breakdown styled like the FY26-27 Regional Chapter KPI
  Scheme table: **KPI / Pts / Max / Score / Comments**
- **+ Add comment** on any KPI: comments are saved in your browser only (localStorage),
  not shared with other viewers, and are included in that chapter's PDF
- A **Health Status** column (Platinum / Silver / Gold / Bronze) pulled from the
  Chapter Health Score report
- Mandatory-KPI tracking — a chapter can only reach a reward tier (Advanced /
  Master / Elite) once all five mandatory KPIs are confirmed met
- A **Download PDF** button in each chapter's breakdown, producing a shareable
  one-page KPI report for that chapter
- A manual "Last Updated" notice in the header, since this data is **not live** —
  it's refreshed by hand whenever a new report comes in

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Building for deployment

```bash
npm run build
```

Output goes to `dist/` — deployable to any static host (GitHub Pages, Netlify,
Vercel, S3, etc.).

## Updating the data

All chapter data lives in the `CHAPTERS` constant near the top of
`src/ScoreCard.jsx`, and the KPI definitions live in `KPI_META` just above it.
Each chapter object looks like:

```js
{
  "name": "YPO Morocco Integrated",
  "type": "Integrated",          // "Y" | "Integrated" | "Gold" — determines which
                                  // conditional KPI (Under-40 vs Champion Positions) applies
  "healthStatus": "Platinum",
  "healthScore": 36,
  "kpis": {
    "chapter_commitments_12_14": 3,   // points awarded, or null if not yet reported
    "mena_mastery_officers": null,
    ...
  },
  "totalScore": 3,                // sum of non-null kpi values
  "mandatoryMet": "No",           // "Yes" only once all 5 mandatory KPIs are confirmed met
  "tier": "In Progress",          // "Elite" | "Master" | "Advanced" | "In Progress"
  "status": "scored",
  "raw": {                        // the actual uploaded figures behind each score
    "chapter_commitments_12_14": "14 of 14 commitments met",
    ...
  }
}
```

To load a new report (e.g. an updated Chapter Commitments export), map each
chapter's real value into the appropriate `kpis` field, recompute `totalScore`,
and re-derive `mandatoryMet` / `tier`:

- `mandatoryMet = "Yes"` only if all of `chapter_commitments_12_14`,
  `mena_mastery_officers`, `elect_core_officer_training`, `playbook_signed`, and
  `cm_workshop_attendance`
  are all non-null and greater than 0
- Otherwise `mandatoryMet = "No"` and `tier = "In Progress"`
- If `mandatoryMet === "Yes"`, `tier` is Elite (25-26), Master (23-24), Advanced
  (20-22), based on `totalScore` (out of a potential 26)

Don't forget to update `LAST_UPDATED` (shown in the header and on chapter PDFs)
once new data is in.

## KPI scheme reference

Full point scheme: see the "View FY26-27 Regional Chapter KPI Scheme" link in
the app header (Canva).
