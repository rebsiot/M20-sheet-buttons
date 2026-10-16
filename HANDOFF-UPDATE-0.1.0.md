# Dodge Toolbar Handoff — v0.1.0

**Owner:** WoD20 PC sheet micro-action extension. This is packaged as independent module `wod20-dodge-button`, not as a change to Player Actions / Dice Improvements / Paradox.

**Status:** Automated/mock-tested, not live verified. GitHub repository: `rebsiot/M20-sheet-buttons`; publishing workflow is new and requires remote verification. Versioned ZIP `wod20-dodge-button-0.1.0.zip`.

**Contract:** `renderActorSheetV2` injects a 30x30 SVG `macroBtn` immediately after native `data-rolldices` button; click opens WoD20 native `DialogGeneralRoll` with `GeneralRoll` type `ability`, attribute `dexterity`, ability `dodge` when available else `athletics`, and action `Dodge`. No ChatMessage or Paradox hooks. No persistent data writes.

**Preserved:** Existing four-button native control order and operation; native roller, chat, system calculations, Actor documents, original system files, and other modules.

**Next step:** In the user's live Foundry v14/WoD20 install, click the Dodge icon with one real Mage PC and verify a native Dodge chat card. Check both Mage and Vampire if desired. If behavior deviates, collect console error / installed system version before changing code.

**Shared handoff coordination:** Record the add-on and native-roll-only contract in the owning sheet/Dice Improvements handoff, and review `GLOBAL-02` (Actor sheet/dice contract), `GLOBAL-03` (test status), `GLOBAL-04` (completed only after live test). The authoritative system ZIP/current installed version is not in this chat.