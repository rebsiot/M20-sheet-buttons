/**
 * WoD20 Dodge Button 0.1.0 — Foundry v14 + worldofdarkness 7.3.1.
 * This is a sheet-only extension: the native WoD20 dialog and DiceRoller own every roll.
 */
const MODULE_ID = "wod20-dodge-button";
const NATIVE_DIALOG_PATH = "/systems/worldofdarkness/module/dialogs/dialog-generalroll.js";
const DODGE_SELECTOR = ".macroBtn.wod20-dodge-button";

function getNativeAbility(actor, key) {
  // WoD20 v7.3.1 uses PC Ability Items with system.id (not name alone).
  try {
    const ability = actor?.api?.getAbility?.(key);
    if (ability) return ability;
  } catch (err) {
    console.debug(`${MODULE_ID} | Could not resolve ${key} via Actor API`, err);
  }
  const fromSystem = actor?.system?.abilities?.[key];
  if (fromSystem?.isvisible !== false) return fromSystem ?? actor?.items?.find?.(
    item => item.type === "Ability" && String(item.system?.id ?? "").toLowerCase() === key
  );
  return undefined;
}

export function preferredDodgeAbility(actor) {
  if (getNativeAbility(actor, "dodge")) return "dodge";
  if (getNativeAbility(actor, "athletics")) return "athletics";
  return null;
}

function nativeSplatColor(diceButton) {
  const fill = diceButton.querySelector?.("svg path[fill]")?.getAttribute?.("fill") ?? "";
  return /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(fill) ? fill : "#7d3f84";
}

function dodgeIcon(color) {
  // Thirty-pixel icon: matches the native macro buttons' square silhouette.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30" aria-hidden="true" focusable="false" style="border-radius:3px;height:30px;width:30px">
    <rect width="30" height="30" fill="${color}"/>
    <g fill="none" stroke="#fff" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="19.7" cy="6.5" r="2" fill="#fff" stroke="none"/>
      <path d="m17.5 10-4 4-5 1.2m4.8-1.6 5 3.3 5-1.4m-5-5 2.8 5.6-4.8 5.1m0 0-6.3 3.5m6.3-3.5 5.6 2.2"/>
    </g>
  </svg>`;
}

export async function openDodgeDialog(actor, loadDialog = () => import(NATIVE_DIALOG_PATH)) {
  if (!actor || actor.type !== "PC") return false;
  const ability = preferredDodgeAbility(actor);
  if (!ability) {
    ui.notifications.warn("Dodge requires a Dodge or Athletics ability on this character.");
    return false;
  }

  try {
    const { GeneralRoll, DialogGeneralRoll } = await loadDialog();
    const roll = new GeneralRoll(ability, "ability", actor);
    // WoD20 only populates attributeName when the attribute is selected by hand.
    // Obtain its localized label from WoD20 itself for this preselected roll.
    const dexterity = new GeneralRoll("dexterity", "attribute", actor);
    roll.attributeKey = "dexterity";
    roll.attributeName = dexterity.attributeName || "Dexterity";
    roll.name = "Dodge";

    const dialog = new DialogGeneralRoll(actor, roll);
    // The system labels ability rolls with the ability name each time getData()
    // runs. Retain the native roll processing but label this action "Dodge".
    const nativeGetData = dialog.getData.bind(dialog);
    dialog.getData = async function (...args) {
      const data = await nativeGetData(...args);
      this.object.name = "Dodge";
      if (data?.object) data.object.name = "Dodge";
      return data;
    };
    dialog.render(true);
    return true;
  } catch (error) {
    console.error(`${MODULE_ID} | Cannot open the native WoD20 Dodge dialog`, error);
    ui.notifications.error("Cannot open Dodge. Check the WoD20 system version and browser console.");
    return false;
  }
}

export function addDodgeButtons(app, root) {
  if (game.system?.id !== "worldofdarkness" || app?.actor?.type !== "PC") return 0;
  if (!root?.querySelectorAll) return 0;
  let added = 0;
  // The native toolbar can occur in more than one rendered sheet part.
  for (const dice of root.querySelectorAll('.macroBtn[data-rolldices="true"]')) {
    const toolbar = dice.parentElement;
    if (!toolbar || toolbar.querySelector?.(DODGE_SELECTOR)) continue;
    const color = nativeSplatColor(dice);
    const btn = document.createElement("a");
    btn.className = "macroBtn pointer wod20-dodge-button";
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-label", "Dodge");
    btn.title = "Dodge — Dexterity + Dodge/Athletics";
    btn.innerHTML = dodgeIcon(color);

    const activate = event => {
      event.preventDefault();
      event.stopPropagation();
      void openDodgeDialog(app.actor);
    };
    btn.addEventListener("click", activate);
    btn.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") activate(event);
    });
    dice.insertAdjacentElement("afterend", btn);
    added++;
  }
  return added;
}

Hooks.on("renderActorSheetV2", (app, root) => {
  addDodgeButtons(app, root);
});