import type { ProductOption, QuantityPrice } from "@/components/ShopGrid";

/**
 * Pris från en prislista. Listade antal får exakt listpriset. Mellan två nivåer räknas
 * totalpriset rakt mellan dem (linjärt), t.ex. ligger 375 st mitt emellan 250 och 500 st.
 * Över högsta nivån används dess styckpris. Under lägsta nivån finns inget pris.
 */
export function quantityPrice(prices: QuantityPrice[], quantity: number) {
  const tiers = [...prices].sort((a, b) => a.quantity - b.quantity);
  if (tiers.length === 0 || quantity < tiers[0].quantity) return null;
  const upperIndex = tiers.findIndex((tier) => tier.quantity >= quantity);
  let total: number;
  if (upperIndex === -1) {
    const last = tiers[tiers.length - 1];
    total = (last.total / last.quantity) * quantity;
  } else if (tiers[upperIndex].quantity === quantity) {
    total = tiers[upperIndex].total;
  } else {
    const lower = tiers[upperIndex - 1];
    const upper = tiers[upperIndex];
    total = lower.total + ((upper.total - lower.total) * (quantity - lower.quantity)) / (upper.quantity - lower.quantity);
  }
  total = Math.round(total * 100) / 100;
  return { unit: total / quantity, total };
}

export type ProductSelections = Record<string, number>;

export function availableChoices(option: ProductOption, options: ProductOption[], selected: ProductSelections) {
  const print = options.find((item) => item.id === "tryck");
  const color = options.find((item) => item.id === "farg");
  const method = print?.choices[selected.tryck]?.label;
  const colorName = color?.choices[selected.farg]?.label;
  const bottlePrintMethod = options.find((item) => item.id === "trycktyp")?.choices[selected.trycktyp]?.label;
  return option.choices
    .map((choice, index) => ({ choice, index }))
    .filter(({ choice }) => {
      if (choice.label === "Screentryck" && colorName === "Svart") return false;
      if (option.id === "tryckstorlek") {
        const dependencyId = bottlePrintMethod ? "trycktyp" : "antal-farger";
        if (choice.dependsOn?.optionId !== dependencyId) return false;
      }
      if (choice.dependsOn) {
        const dependency = options.find((item) => item.id === choice.dependsOn?.optionId);
        const dependencyLabel = dependency?.choices[selected[choice.dependsOn.optionId]]?.label;
        if (!dependencyLabel || !choice.dependsOn.choiceLabels.includes(dependencyLabel)) return false;
      }
      if (choice.excludedChoiceLabels) {
        const dependency = options.find((item) => item.id === choice.excludedChoiceLabels?.optionId);
        const dependencyLabel = dependency?.choices[selected[choice.excludedChoiceLabels.optionId]]?.label;
        if (dependencyLabel && choice.excludedChoiceLabels.choiceLabels.includes(dependencyLabel)) return false;
      }
      return !choice.printMethod || choice.printMethod === method;
    });
}

export function selectProductChoice(options: ProductOption[], selected: ProductSelections, id: string, index: number): ProductSelections {
  const next = { ...selected, [id]: index };
  if (id === "antal-farger") {
    delete next.trycktyp;
    delete next.tryckstorlek;
  }
  if (id === "trycktyp") {
    delete next["antal-farger"];
    delete next.tryckstorlek;
  }
  if (id === "tryck" && selected.tryck !== index) {
    for (const option of options) {
      if (option.choices.some((choice) => choice.printMethod)) delete next[option.id];
    }
    const coloring = options.find((option) => option.id === "fargning");
    if (coloring) {
      const choices = availableChoices(coloring, options, next);
      if (choices.length === 1) next.fargning = choices[0].index;
    }
  }
  for (const option of options) {
    if (option.choices.some((choice) => choice.dependsOn?.optionId === id || choice.excludedChoiceLabels?.optionId === id)) {
      delete next[option.id];
      const choices = availableChoices(option, options, next);
      if (choices.length === 1) next[option.id] = choices[0].index;
    }
  }
  if (id === "farg") {
    const print = options.find((option) => option.id === "tryck");
    const selectedColor = options.find((option) => option.id === "farg")?.choices[index]?.label;
    const selectedPrint = print?.choices[next.tryck]?.label;
    if (selectedColor === "Svart" && selectedPrint === "Screentryck") {
      delete next.tryck;
      delete next.fargning;
    }
  }
  return next;
}

export function configurationPrice(options: ProductOption[], selected: ProductSelections, quantity: number, productPrices?: QuantityPrice[]) {
  const isBottle = options.some((option) => option.id === "trycktyp");
  const bottlePrintChoice = selected["antal-farger"] !== undefined || selected.trycktyp !== undefined;
  const bottlePrintChoiceIsExclusive = (selected["antal-farger"] !== undefined) !== (selected.trycktyp !== undefined);
  const complete = isBottle
    ? options.filter((option) => !["antal-farger", "trycktyp"].includes(option.id)).every((option) =>
        availableChoices(option, options, selected).some(({ index }) => index === selected[option.id]),
      ) && bottlePrintChoice && bottlePrintChoiceIsExclusive
    : options.length > 0 && options.every((option) =>
        availableChoices(option, options, selected).some(({ index }) => index === selected[option.id]),
      );
  const validQuantity = Number.isInteger(quantity) && quantity > 0;
  if (!complete || !validQuantity) return null;
  const tieredChoice = options.map((option) => option.choices[selected[option.id]]).find((choice) => choice?.quantityPrices);
  if (tieredChoice?.quantityPrices) {
    const variant = tieredChoice.quantityPriceVariants?.find(({ optionId, choiceLabel }) =>
      options.find((option) => option.id === optionId)?.choices[selected[optionId]]?.label === choiceLabel,
    );
    return quantityPrice(variant?.prices ?? tieredChoice.quantityPrices, quantity);
  }
  if (productPrices) return quantityPrice(productPrices, quantity);
  const base = options.find((option) => option.id === "format")?.choices[selected.format]?.price ?? 0;
  const print = options.find((option) => option.id === "tryck")?.choices[selected.tryck]?.price ?? 0;
  const coloring = options.find((option) => option.id === "fargning")?.choices[selected.fargning]?.price ?? 0;
  const sides = selected.motiv === 0 ? 1 : 2;
  const unit = base + (print + coloring) * sides;
  return { unit, total: unit * quantity };
}
