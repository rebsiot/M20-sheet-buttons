# M20 Sheet Buttons — icon patch handoff v0.1.1

**Owner:** `rebsiot/M20-sheet-buttons`, Foundry module ID `wod20-dodge-button` (independent from Player Magick, Dice Improvements and Paradox).

**Change:** User requested the Dodge button use an existing Game Icons SVG. Reused `icons/dodge.svg` by Felbrigg from `rebsiot/M20-player-actions` and removed only its opaque background to preserve native WoD20 splat color. Icon locally bundled; project attribution included in `ICONS-CREDITS.md` and `icons/LICENSE.txt`. Native RGB backgrounds are now recognized instead of defaulting to a guessed purple.

**Preserved:** Same sheet insertion, accessibility, native Dexterity + Dodge/Athletics dialog, ChatMessage routing and ownership. No Actor or world-data migrations. No other modules changed.

**Tests:** Node mock/contract tests and syntax/ZIP integrity checks run locally. GitHub publishing workflow outcome to be recorded separately. **Live Foundry v14/WoD20 verification pending.**

**Install:** Back up `Z:\Data\modules\wod20-dodge-button`, stop Foundry, upgrade through published manifest or extract complete ZIP to `Z:\Data\modules`, restart and hard-refresh. Verify appearance and one roll on a copied PC Actor. **Rollback:** disable v0.1.1 or restore prior v0.1.0 module folder/ZIP. Existing Actor and chat records unchanged by the upgrade.

**Shared coordination:** Note icon-only patch in owning module handoff; no cross-module data contract change or Paradox integration change.
