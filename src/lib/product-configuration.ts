import type { ProductOption } from "@/components/ShopGrid";

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
      return !choice.printMethod || choice.printMethod === method;
    });
}

export function selectProductChoice(options: ProductOption[], selected: ProductSelections, id: string, index: number): ProductSelections {
  const next = { ...selected, [id]: index };
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
    if (option.choices.some((choice) => choice.dependsOn?.optionId === id)) {
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

export function configurationPrice(options: ProductOption[], selected: ProductSelections, quantity: number) {
  const complete = options.length > 0 && options.every((option) =>
    availableChoices(option, options, selected).some(({ index }) => index === selected[option.id]),
  ) && Number.isInteger(quantity) && quantity > 0;
  if (!complete) return null;
  const base = options.find((option) => option.id === "format")?.choices[selected.format]?.price ?? 0;
  const print = options.find((option) => option.id === "tryck")?.choices[selected.tryck]?.price ?? 0;
  const coloring = options.find((option) => option.id === "fargning")?.choices[selected.fargning]?.price ?? 0;
  const sides = selected.motiv === 0 ? 1 : 2;
  const unit = base + (print + coloring) * sides;
  return { unit, total: unit * quantity };
}