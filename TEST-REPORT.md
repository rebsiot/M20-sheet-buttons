# Test report — v0.1.0 — 2026-10-15

## Automated/mock-tested

- JavaScript syntax: `node --check src/main.js` — PASS.
- Node `node --test tests/*.test.js` — **8/8 PASS**:
  - Foundry v14 `renderActorSheetV2` hook registered.
  - Dodge trait preferred over Athletics; athletics fallback.
  - Button inserted under the existing dice icon and not duplicated on rerender.
  - PC/system filtering prevents modifications to unrelated sheets.
  - Native roll dialog gets Dexterity + Athletics; action remains Dodge.
  - Custom Dodge chosen when the Actor has that Ability.
  - Missing abilities warn rather than silently rolling invalid dice.
  - Native dialog import error handled without Actor writes.

## Source verification

Compared with public WoD20 system **v7.3.1** templates (`templates/actor/parts/macro_icons.hbs`), PC ActorSheetV2 hook architecture, `DialogGeneralRoll` and `GeneralRoll` methods. The dialog retains system-owned difficulty/wound/roll/chat handling, and the new control does not touch Paradox listeners.

## Not yet live verified

- Appearance, sizing, position, and repeated render behavior in the *installed* version of Foundry v14.
- Actual native dialog interaction with real PC Actor Ability Items.
- Wound penalty / Willpower / specialty behavior in chat.
- Player permissions, Dice So Nice animations, and any custom sheet skin.

Nothing here claims deployment or live Foundry success.