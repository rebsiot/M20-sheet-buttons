# WoD20 Dodge Button — v0.1.0

**For:** Foundry VTT v14 with the `worldofdarkness` (WoD20) system v7.3.1+.
**Module ID:** `wod20-dodge-button`  
**Source:** https://github.com/rebsiot/M20-sheet-buttons

Adds one **Dodge** icon immediately **below the native dice icon** in the vertical toolbar of WoD20 PC character sheets. It uses the same 30 x 30 pixel square as the native icons, extracts the existing native icon's color, and includes a Dodge tooltip and keyboard support. It appears on applicable sheet tabs, without rearranging Roll, Soak, initiative or casting icons.

Clicking Dodge opens **WoD20's native General Roll dialog** with:

- **Attribute:** Dexterity.
- **Ability:** the Actor's distinct `dodge` Ability, if present; otherwise `athletics`.
- **Difficulty:** system default (normally 6), adjustable in the native dialog.
- **Action name:** Dodge in the native chat card.
- **Other native controls:** wound penalties, Willpower, situational bonus, specialty, and native chat/dice resolution stay in the system's hands.

The button is a roll shortcut, **not a permission to dodge every firearm attack**. Whether a character can reactively evade an attack, find cover, or split actions is determined by the Storyteller and the relevant WoD20 combat rules. The shortcut does not auto-roll against attacks or apply damage/soak, and it does not handle Paradox.

## Installation

**Foundry module manifest:** `https://github.com/rebsiot/M20-sheet-buttons/releases/latest/download/module.json`

Once the GitHub release has been published, use **Foundry Setup > Add-on Modules > Install Module** and paste that manifest URL. Alternatively, manually install the release ZIP:

1. Back up the world. This module does not migrate or overwrite world documents, but retaining a world backup is normal deployment practice.
2. Stop Foundry on Ubuntu before copying module files through Samba.
3. Extract the ZIP so that **`Z:\Data\modules\wod20-dodge-button\module.json`** is at the module folder root. On Ubuntu, install in the Foundry user-data `Data/modules/wod20-dodge-button` directory.
4. Start Foundry, enter the intended world, and enable **WoD20 Dodge Button** under Manage Modules.
5. Hard-refresh the browser. Open a Mage PC character sheet, locate the native Roll/Soak column and click the new icon immediately under the dice.

No modification to Foundry's `worldofdarkness` system folder, Player Actions, Dice Improvements, or Paradox is necessary.

## First live verification

Use a test/copy of a PC Actor with Dexterity and Athletics. Open the character sheet, click Dodge, confirm the native dialog shows **Dexterity + Athletics**, then roll. Verify exactly **one** native WoD20 **Dodge** result in Chat, including normal difficulty, wound penalty and specialty behavior where applicable. If the Actor has a custom Dodge ability, repeat and confirm **Dexterity + Dodge** is selected instead. Switch sheet tabs and rerender: there must not be duplicate Dodge buttons. Verify a player can use the button on a character they own and can view the chat card.

## Rollback

Disable **WoD20 Dodge Button** in Manage Modules and hard-refresh. You can then remove the folder. No Actor, chat, setting, or world data migration is run by the module. Existing rolls are normal WoD20 chat messages and are not removed by disabling this feature.

## Limitations / compatibility

- The code is built against the public `worldofdarkness` **v7.3.1** implementation, including `macro_icons.hbs`, `renderActorSheetV2`, and `module/dialogs/dialog-generalroll.js`. The *installed* WoD20 version was not directly inspected.
- Works only on the PC (`type: PC`) ActorSheetV2 toolbar, not the older legacy `.html` sheet templates or NPC/Creature custom sheets.
- An Actor with neither a `dodge` nor an `athletics` Ability receives a warning; the module does not invent ratings.
- Native-system file paths/API and styling could change in later upstream WoD20 versions; check after updates.
- No live Foundry/browser verification has been performed in the user's environment.

## Source/tests

`src/main.js` provides the toolbar hook and native-dialog shortcut. `tests/dodge.test.js` provides Node mock/contract tests. Run `npm test` and `npm run check` from the module root on a development machine with Node.js 22+ (npm is not required to install the module on Foundry).

## GitHub release process

This repository publishes an independent module using GitHub Actions. Changes pushed to `main` that affect module source or packaging run syntax and mock tests, package a ZIP with the `wod20-dodge-button/` top-level folder, and publish a versioned GitHub Release. The release attaches `module.json` for Foundry manifest installation. Releases are immutable: to publish updated code, increment `version` and both `download`/manifest metadata in `module.json`. A successful automated release does **not** establish live Foundry compatibility.