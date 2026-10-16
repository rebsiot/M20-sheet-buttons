import test from "node:test";
import assert from "node:assert/strict";

const hooks = new Map();
const warnings = [];
const errors = [];
globalThis.Hooks = { on(name, fn) { hooks.set(name, fn); } };
globalThis.game = { system: { id: "worldofdarkness" } };
globalThis.ui = { notifications: { warn(message) { warnings.push(message); }, error(message) { errors.push(message); } } };

class MockElement {
  constructor(tag) {
    this.tag = tag;
    this.className = "";
    this.style = {};
    this.attributes = {};
    this.listeners = {};
    this.innerHTML = "";
    this.parentElement = null;
    this.after = [];
    this.title = "";
  }
  setAttribute(key, value) { this.attributes[key] = value; }
  addEventListener(key, fn) { this.listeners[key] = fn; }
  insertAdjacentElement(position, element) {
    assert.equal(position, "afterend");
    element.parentElement = this.parentElement;
    this.after.push(element);
  }
  querySelector(query) {
    if (query === "svg path[fill]") return { getAttribute: () => "#9b49a5" };
    if (query === ".macroBtn.wod20-dodge-button") {
      return this.children?.find(x => x.className.includes("wod20-dodge-button"))
        ?? this.children?.flatMap(x => x.after).find(x => x.className.includes("wod20-dodge-button"));
    }
    return null;
  }
}
globalThis.document = { createElement: tag => new MockElement(tag) };

const { preferredDodgeAbility, openDodgeDialog, addDodgeButtons } = await import("../src/main.js");
function actor(abilities = { athletics: { name: "Athletics" } }) {
  return { type: "PC", api: { getAbility: key => abilities[key] }, system: { abilities: {} }, items: [] };
}
function mockRoot() {
  const toolbar = new MockElement("div");
  const dice = new MockElement("a");
  dice.parentElement = toolbar;
  toolbar.children = [dice];
  return { dice, root: { querySelectorAll: selector => selector === '.macroBtn[data-rolldices="true"]' ? [dice] : [] } };
}

test("registers the v14 ActorSheetV2 render hook", () => {
  assert.equal(typeof hooks.get("renderActorSheetV2"), "function");
});
test("prefers Dodge ability, otherwise uses Athletics; never fabricates ratings", () => {
  assert.equal(preferredDodgeAbility(actor({ dodge: {}, athletics: {} })), "dodge");
  assert.equal(preferredDodgeAbility(actor()), "athletics");
  assert.equal(preferredDodgeAbility(actor({})), null);
});
test("adds one button immediately after the native Roll icon and on rerender none", () => {
  const { dice, root } = mockRoot();
  const app = { actor: actor() };
  assert.equal(addDodgeButtons(app, root), 1);
  assert.equal(dice.after.length, 1);
  assert.equal(dice.after[0].style.backgroundColor, "#9b49a5");
  assert.match(dice.after[0].innerHTML, /modules\/wod20-dodge-button\/icons\/dodge\.svg/);
  assert.match(dice.after[0].innerHTML, /width="30" height="30"/);
  assert.equal(dice.after[0].title, "Dodge — Dexterity + Dodge/Athletics");
  assert.equal(addDodgeButtons(app, root), 0);
});
test("matches native WoD20 rgb(...) SVG button colors", () => {
  const { dice, root } = mockRoot();
  const nativeQuerySelector = dice.querySelector.bind(dice);
  dice.querySelector = selector => selector === "svg path[fill]"
    ? { getAttribute: () => "rgb(83, 33, 89)" }
    : nativeQuerySelector(selector);
  assert.equal(addDodgeButtons({ actor: actor() }, root), 1);
  assert.equal(dice.after[0].style.backgroundColor, "rgb(83, 33, 89)");
});
test("sheet type/system guards do not touch other sheets", () => {
  const { dice, root } = mockRoot();
  assert.equal(addDodgeButtons({ actor: { type: "NPC" } }, root), 0);
  game.system.id = "other-system";
  assert.equal(addDodgeButtons({ actor: actor() }, root), 0);
  game.system.id = "worldofdarkness";
  assert.equal(dice.after.length, 0);
});
test("opens native WoD20 dialog with Dexterity + Athletics and Dodge action label", async () => {
  const calls = [];
  class GeneralRoll {
    constructor(key, type, actorValue) { this.abilityKey = key; this.type = type; this.actor = actorValue; if (type === "attribute") this.attributeName = "Dexterity"; }
  }
  class DialogGeneralRoll {
    constructor(actorValue, roll) { this.actor = actorValue; this.object = roll; }
    async getData() { this.object.name = "Athletics"; return { object: this.object }; }
    render(force) { calls.push(force); }
  }
  const a = actor();
  let result;
  const load = async () => ({ GeneralRoll, DialogGeneralRoll: class extends DialogGeneralRoll {
    constructor(actorValue, roll) { super(actorValue, roll); result = this; }
  } });
  assert.equal(await openDodgeDialog(a, load), true);
  assert.equal(result.object.attributeKey, "dexterity");
  assert.equal(result.object.attributeName, "Dexterity");
  assert.equal(result.object.abilityKey, "athletics");
  assert.equal(result.object.type, "ability");
  assert.equal(result.object.name, "Dodge");
  await result.getData();
  assert.equal(result.object.name, "Dodge");
  assert.deepEqual(calls, [true]);
});
test("uses custom Dodge when present", async () => {
  let selected;
  class GeneralRoll { constructor(key, type) { if (type === "ability") selected = key; } }
  class DialogGeneralRoll { constructor(a, r) { this.object = r; } getData() { return {}; } render() {} }
  assert.equal(await openDodgeDialog(actor({ dodge: {}, athletics: {} }), async () => ({ GeneralRoll, DialogGeneralRoll })), true);
  assert.equal(selected, "dodge");
});
test("missing traits warn rather than rolling arbitrary zero dice", async () => {
  warnings.length = 0;
  assert.equal(await openDodgeDialog(actor({}), async () => { throw Error("should not load"); }), false);
  assert.match(warnings.at(-1), /Dodge or Athletics/);
});
test("native module import errors do not mutate Actors", async () => {
  errors.length = 0;
  const a = actor();
  assert.equal(await openDodgeDialog(a, async () => { throw Error("system file missing"); }), false);
  assert.match(errors.at(-1), /Cannot open Dodge/);
});