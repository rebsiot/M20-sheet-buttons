# Changelog

## v0.1.0 — 2026-10-15
- Added a compact Dodge icon directly below the native dice icon on WoD20 v14 PC sheets.
- Preselects native Dexterity + Dodge, falling back to Athletics.
- Opens the unmodified native WoD20 roll dialog, labels the chat roll Dodge.
- Matches the displayed native button color; preserves all existing toolbar actions.
- Includes keyboard Enter/Space activation and no-op handling on unrelated Actor sheets.
- No Actor schema changes, no ChatMessage listener and no automatic combat effects.
- Automated tests: 8 passed; syntax check passed.
- Live Foundry tests: not yet run.
- Known limit: WoD20 upstream API/template changes require retesting; legacy sheets are not targeted.