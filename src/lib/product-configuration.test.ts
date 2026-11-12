import { describe, expect, it } from "vitest";
import { findProduct } from "@/components/ShopGrid";
import { availableChoices, configurationPrice, selectProductChoice } from "./product-configuration";

const options = findProduct("medium-bomullskasse")?.item.options ?? [];
const lipBalmOptions = findProduct("basic-lappbalsam")?.item.options ?? [];
const bottleOptions = findProduct("basic-vattenflaska")?.item.options ?? [];
const pen = findProduct("basic-kulspetspenna")?.item;
const matchbox = findProduct("basic-tandsticksask")?.item;

describe("Tändsticksaskens pris", () => {
  it("kostar 14 789 kr för 2 500 st och säljs bara i det antalet", () => {
    expect(matchbox?.minQuantity).toBe(2500);
    expect(matchbox?.maxQuantity).toBe(2500);
    expect(configurationPrice(matchbox?.options ?? [], { farg: 0 }, 2500, matchbox?.quantityPrices)?.total).toBe(14789);
  });
});

describe("Kulspetspennans prislista", () => {
  const penOptions = pen?.options ?? [];
  const selected = { hylsa: 2, trim: 4, black: 0, tryckfarg: 0 }; // svart hylsa, svart trim
  it("ger listpris oavsett val", () => {
    expect(configurationPrice(penOptions, selected, 150, pen?.quantityPrices)?.total).toBe(3275);
    expect(configurationPrice(penOptions, selected, 400, pen?.quantityPrices)?.total).toBe(4641.87);
    expect(configurationPrice(penOptions, selected, 500, pen?.quantityPrices)?.total).toBe(4966.88);
    expect(configurationPrice(penOptions, selected, 2500, pen?.quantityPrices)?.total).toBe(11398.13);
  });
  it("ger inget pris under 150 st eller innan alla val är gjorda", () => {
    expect(configurationPrice(penOptions, selected, 149, pen?.quantityPrices)).toBeNull();
    expect(configurationPrice(penOptions, { hylsa: 2 }, 500, pen?.quantityPrices)).toBeNull();
  });
});

describe("Vattenflaskans prislista", () => {
  // farg, antal-farger (0–3), trycktyp (0 laser, 1 fullfärg, 2 otryckt), tryckstorlek
  const pick = (id: string, index: number, start = { farg: 0 }) => selectProductChoice(bottleOptions, start, id, index);
  const size = (selected: Record<string, number>, label: string) =>
    ({ ...selected, tryckstorlek: bottleOptions[3].choices.findIndex((choice) => choice.label === label) });
  it("skiljer på 1 färg 70 × 30 och 150 × 120", () => {
    const oneColor = pick("antal-farger", 0);
    expect(configurationPrice(bottleOptions, size(oneColor, "70 × 30 mm"), 10)?.total).toBe(2060.8);
    expect(configurationPrice(bottleOptions, size(oneColor, "150 × 120 mm"), 10)?.total).toBe(2227.15);
  });
  it("följer listan för fler färger och övriga tryckalternativ", () => {
    expect(configurationPrice(bottleOptions, size(pick("antal-farger", 3), "70 × 30 mm"), 2500)?.total).toBe(124552.28);
    expect(configurationPrice(bottleOptions, size(pick("antal-farger", 3), "150 × 120 mm"), 2500)?.total).toBe(146573.69);
    expect(configurationPrice(bottleOptions, size(pick("antal-farger", 1), "150 × 120 mm"), 10)?.total).toBe(3085.57);
    expect(configurationPrice(bottleOptions, size(pick("antal-farger", 2), "150 × 120 mm"), 500)?.total).toBe(31918.94);
    expect(configurationPrice(bottleOptions, size(pick("trycktyp", 0), "35 mm"), 100)?.total).toBe(5314.6);
    expect(configurationPrice(bottleOptions, size(pick("trycktyp", 1), "205 × 140 mm"), 500)?.total).toBe(25313.15);
    expect(configurationPrice(bottleOptions, size(pick("trycktyp", 2), "Inget tryck"), 1000)?.total).toBe(31363.28);
  });
  it("räknar 375 st mitt emellan 250 och 500 st", () => {
    // Otryckt: 250 st = 8 152,51, 500 st = 15 889,44
    expect(configurationPrice(bottleOptions, size(pick("trycktyp", 2), "Inget tryck"), 375)?.total).toBe(12020.98);
  });
  it("ger inget pris under 10 st", () => {
    expect(configurationPrice(bottleOptions, size(pick("trycktyp", 2), "Inget tryck"), 9)).toBeNull();
  });
});

describe("Bomullskassens anpassning", () => {
  it("har rätt format och elva grundfärger", () => {
    expect(options[0].choices.map((choice) => choice.label)).toEqual(["40 x 10 x 35", "38 x 10 x 42"]);
    expect(options[1].choices).toHaveLength(11);
  });
  it("har sjutton grundfärger för läppbalsam", () => {
    expect(lipBalmOptions[0].choices).toHaveLength(17);
    expect(lipBalmOptions[0].choices.map((choice) => choice.label)).toContain("Rosé-champagne metallic");
  });
  it("visar bara fyra färger för digitalt tryck och väljer det automatiskt", () => {
    const selected = selectProductChoice(options, {}, "tryck", 0);
    expect(selected.fargning).toBe(0);
    expect(availableChoices(options[4], options, selected).map(({ choice }) => choice.label)).toEqual(["4 färger"]);
  });
  it("nollställer färgning vid byte av tryck och visar screenalternativen", () => {
    const selected = selectProductChoice(options, { tryck: 0, fargning: 0 }, "tryck", 1);
    expect(selected.fargning).toBeUndefined();
    expect(availableChoices(options[4], options, selected).map(({ choice }) => choice.label)).toEqual(["1 färg", "2 färger", "3 färger", "4 färger"]);
  });
  it("döljer screentryck för svart men visar det för andra färger", () => {
    const black = selectProductChoice(options, { tryck: 1 }, "farg", 2);
    expect(availableChoices(options[3], options, black).map(({ choice }) => choice.label)).toEqual(["Digital transfertryck"]);

    const red = selectProductChoice(options, { tryck: 1 }, "farg", 4);
    expect(availableChoices(options[3], options, red).map(({ choice }) => choice.label)).toEqual(["Digital transfertryck", "Screentryck"]);
  });
  it("döljer pris vid ofullständiga eller ogiltiga val och antal", () => {
    expect(configurationPrice(options, {}, 100)).toBeNull();
    const selected = { format: 0, farg: 0, motiv: 0, tryck: 0, fargning: 0 };
    for (const quantity of [0, -1, 1.5]) expect(configurationPrice(options, selected, quantity)).toBeNull();
    expect(configurationPrice(options, { ...selected, tryck: 1 }, 100)).toBeNull();
  });
  it("har två motivval", () => {
    expect(options[2].choices.map((choice) => choice.label)).toEqual(["Ett motiv på framsidan", "Samma motiv fram och bak"]);
  });
  it("följer prislistan oavsett format", () => {
    const selected = { format: 0, farg: 0, motiv: 0, tryck: 0, fargning: 0 };
    expect(configurationPrice(options, selected, 100)?.total).toBe(6749.98);
    expect(configurationPrice(options, { ...selected, format: 1 }, 100)?.total).toBe(6749.98);
    expect(configurationPrice(options, { ...selected, tryck: 1, fargning: 1 }, 50)?.total).toBe(3715.36);
    expect(configurationPrice(options, { ...selected, tryck: 1, fargning: 4 }, 1000)?.total).toBe(63761.77);
    expect(configurationPrice(options, selected, 49)).toBeNull();
  });
  it("använder egen prislista för samma motiv fram och bak", () => {
    const bothSides = { format: 0, farg: 0, motiv: 1, tryck: 0, fargning: 0 };
    expect(configurationPrice(options, bothSides, 100)?.total).toBe(9045.5);
    expect(configurationPrice(options, { ...bothSides, tryck: 1, fargning: 1 }, 50)?.total).toBe(4429.41);
    expect(configurationPrice(options, { ...bothSides, tryck: 1, fargning: 2 }, 75)?.total).toBe(6898.28);
    expect(configurationPrice(options, { ...bothSides, tryck: 1, fargning: 4 }, 1000)?.total).toBe(91191.2);
  });
});

describe("Läppbalsamets prislista", () => {
  const tampo = { farg: 0, tryck: 0 };
  const digital = { farg: 0, tryck: 1, tryckfarger: 3 };
  it("ger exakt listpris vid listade antal", () => {
    expect(configurationPrice(lipBalmOptions, { ...tampo, tryckfarger: 0 }, 250)?.total).toBe(4240.49);
    expect(configurationPrice(lipBalmOptions, { ...tampo, tryckfarger: 1 }, 1000)?.total).toBe(13649.19);
    expect(configurationPrice(lipBalmOptions, { ...tampo, tryckfarger: 2 }, 2500)?.total).toBe(36411.29);
    expect(configurationPrice(lipBalmOptions, digital, 750)?.total).toBe(11443.92);
  });
  it("räknar fram pris mellan nivåer och använder sista styckpriset över listan", () => {
    // 275 st ligger mitt emellan 250 (4 240,49) och 300 (4 848,95)
    expect(configurationPrice(lipBalmOptions, { ...tampo, tryckfarger: 0 }, 275)?.total).toBe(4544.72);
    expect(configurationPrice(lipBalmOptions, digital, 3000)?.unit).toBeCloseTo(31911.6 / 2500);
  });
  it("ger inget pris under 250 st", () => {
    expect(configurationPrice(lipBalmOptions, digital, 249)).toBeNull();
  });
});
