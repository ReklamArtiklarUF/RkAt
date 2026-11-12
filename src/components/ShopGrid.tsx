import { Link } from "react-router-dom";

export type ProductChoice = {
  label: string;
  price: number;
  image?: string;
  swatch?: string;
  printMethod?: string;
  dependsOn?: { optionId: string; choiceLabels: string[] };
  excludedChoiceLabels?: { optionId: string; choiceLabels: string[] };
  scale?: number;
  /** Totalpris för hela beställningen vid ett visst antal. Ersätter styckpriserna när valet är gjort. */
  quantityPrices?: QuantityPrice[];
  /** Andra prislistor som gäller i stället när ett annat val är gjort, t.ex. tryck på båda sidor. */
  quantityPriceVariants?: { optionId: string; choiceLabel: string; prices: QuantityPrice[] }[];
};

export type QuantityPrice = { quantity: number; total: number };

const priceList = (quantities: number[], totals: number[]): QuantityPrice[] =>
  quantities.map((quantity, index) => ({ quantity, total: totals[index] }));

const lipBalmQuantities = [250, 300, 350, 400, 500, 750, 1000, 1500, 2000, 2500];
const toteBagQuantities = [50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
const bottlePrices = (totals: number[]) => priceList([10, 30, 50, 100, 200, 250, 500, 1000, 2500], totals);
const bottleSmallPrint = (totals: number[]) => [{ optionId: "tryckstorlek", choiceLabel: "70 × 30 mm", prices: bottlePrices(totals) }];
const toteBagBothSides =(totals: number[]) => [
  { optionId: "motiv", choiceLabel: "Samma motiv fram och bak", prices: priceList(toteBagQuantities, totals) },
];

export type ProductOption = {
  id: string;
  label: string;
  kind: "image" | "button";
  choices: ProductChoice[];
};

export type Product = {
  name: string;
  image?: string;
  description?: string;
  options?: ProductOption[];
  minQuantity?: number;
  /** Högsta antal. Samma som minQuantity betyder att produkten bara säljs i exakt det antalet. */
  maxQuantity?: number;
  /** Prislista för hela produkten, används när inget val har en egen prislista. */
  quantityPrices?: QuantityPrice[];
};


const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/é/g, "e")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const productSlug = (columnTitle: string, name: string) =>
  `${slugify(columnTitle)}-${slugify(name)}`;

export function findProduct(slug?: string) {
  if (!slug) return null;
  for (const column of shopColumns) {
    for (const item of column.items) {
      if (productSlug(column.title, item.name) === slug) return { column, item };
    }
  }
  return null;
}

export const shopColumns: { title: string; items: Product[] }[] = [
  {
    title: "Premium",
    items: [
      { name: "Paraply" },
      { name: "Produkt 2" },
      { name: "Produkt 3" },
      { name: "Produkt 4" },
      { name: "Produkt 5" },
    ],
  },
  {
    title: "Medium",
    items: [
      {
        name: "Bomullskasse",
        image: "/images/bomullskasse.jpg",
        minQuantity: 50,
        description: "En bomullskasse med plats för ert motiv. Välj mellan två format och kombinera grundfärg, placering och tryck efter era önskemål.",
        options: [
          {
            id: "format",
            label: "Format",
            kind: "image",
            choices: [
              { label: "40 x 10 x 35", price: 0, image: "/images/40x10x35/image.png" },
              { label: "38 x 10 x 42", price: 0, image: "/images/38x10x42/image.png", scale: 0.8 },
            ],
          },
          {
            id: "farg",
            label: "Grundfärg",
            kind: "image",
            choices: [
              ...["Naturfärgad", "Vit", "Svart", "Gul", "Röd", "Ljusblå", "Blå", "Orange", "Rosa", "Mörkblå", "Ljusgrön"].map((label) => ({
                label,
                price: 0,
                image:
                  label === "Naturfärgad"
                    ? "/images/image copy 3.png"
                    : label === "Vit"
                      ? "/images/image copy 4.png"
                      : label === "Svart"
                        ? "/images/image copy 5.png"
                        : label === "Gul"
                          ? "/images/image copy 6.png?v=3"
                          : label === "Röd"
                            ? "/images/röd/image.png"
                            : label === "Ljusblå"
                              ? "/images/ljusblå/image copy 2.png"
                              : label === "Blå"
                                ? "/images/blå/blå box/grundfärg/image copy 3.png"
                                : label === "Orange"
                                  ? "/images/orange/orange box/grundfärg/image.png"
                                  : label === "Mörkblå"
                                      ? "/images/blå/blå box/grundfärg/image copy 2.png"
                                      : label === "Rosa"
                                        ? "/images/blå/blå box/grundfärg/rosa/image.png"
                                        : label === "Ljusgrön"
                                    ? "/images/ljusgrön/image.png"
                                    : undefined,
              })), 
            ],
          },
          {
            id: "motiv",
            label: "Motiv",
            kind: "button",
            choices: [
              { label: "Ett motiv på framsidan", price: 0 },
              { label: "Samma motiv fram och bak", price: 0 },
            ],
          },
          {
            id: "tryck",
            label: "Tryck",
            kind: "button",
            choices: [
              { label: "Digital transfertryck", price: 0 },
              { label: "Screentryck", price: 0 },
            ],
          },
          {
            id: "fargning",
            label: "Färgning",
            kind: "button",
            choices: [
              {
                label: "4 färger", price: 0, printMethod: "Digital transfertryck",
                quantityPrices: priceList(toteBagQuantities, [4082.89, 5568.28, 6749.98, 9945.14, 13180.64, 14781.65, 17309.11, 23034.61, 26938.69, 31628.64, 36989.82, 42351.45, 47041.4, 50865.46]),
                quantityPriceVariants: toteBagBothSides([5382.02, 7457.15, 9045.5, 12959.78, 17431.1, 19553.64, 23078.09, 30649.19, 36415.73, 43102.94, 50313.05, 57523.58, 64211.03, 68837.33]),
              },
              {
                label: "1 färg", price: 0, printMethod: "Screentryck",
                quantityPrices: priceList(toteBagQuantities, [3715.36, 4809.54, 6245.94, 8733.08, 11174.94, 14007.31, 14692.28, 19315.71, 21218.07, 25296.44, 29375.48, 33454.07, 37532.86, 40657.07]),
                quantityPriceVariants: toteBagBothSides([4429.41, 5837.25, 7413, 10354.71, 13179.08, 16461.81, 17324.19, 22824.62, 24778.44, 29569.28, 34360.13, 39150.96, 43941.81, 47441.63]),
              },
              {
                label: "2 färger", price: 0, printMethod: "Screentryck",
                quantityPrices: priceList(toteBagQuantities, [5232.54, 6600.51, 8309.07, 11193.57, 14023.28, 17386.49, 18164.4, 23670.36, 25602.68, 30393.51, 35184.14, 39975.21, 43565.6, 48208.22]),
                quantityPriceVariants: toteBagBothSides([5310.23, 6898.28, 10656.5, 14451.9, 18367.73, 22332.57, 23445.3, 30711.5, 32723.19, 38938.07, 45153.21, 51368.1, 57583.25, 61719.02]),
              },
              {
                label: "3 färger", price: 0, printMethod: "Screentryck",
                quantityPrices: priceList(toteBagQuantities, [6751.55, 8545.78, 10393.71, 13684.22, 17068.51, 20669.91, 21518.1, 27867.15, 29987.72, 35491.49, 40994.77, 46498.32, 52001.87, 56154.74]),
                quantityPriceVariants: toteBagBothSides([8851.26, 11419.1, 13943.67, 18611.45, 23638.67, 27969.83, 29334, 38287.49, 40683.69, 48326.42, 55968.92, 63611.87, 71254.82, 76789.4]),
              },
              {
                label: "4 färger", price: 0, printMethod: "Screentryck",
                quantityPrices: priceList(toteBagQuantities, [8268.96, 10187.26, 12445.55, 16130.97, 20056.56, 24071.97, 25004.18, 32240.44, 34343.26, 40552.4, 46761.98, 52970.9, 59180.68, 63761.77]),
                quantityPriceVariants: toteBagBothSides([11061.62, 14207.54, 17164.32, 22680.95, 28790.07, 33853.65, 35476.4, 46204.28, 48555.69, 57608.07, 66659.78, 75711.69, 84763.86, 91191.2]),
              },
            ],
          },
        ],
      },

      { name: "Produkt 2" },
      { name: "Produkt 3" },
      { name: "Produkt 4" },
      { name: "Produkt 5" },
    ],
  },
  {
    title: "Basic",
    items: [
      {
        name: "Läppbalsam",
        image: "/images/basic/lapbalsam_rkat.jpg",
        description: "Läppbalsam med valfri grundfärg och tryckmetod.",
        minQuantity: 250,
        options: [
          {
            id: "farg",
            label: "Grundfärg",
            kind: "image",
            choices: [
              { label: "Transparent", price: 0, swatch: "linear-gradient(135deg, #f5f5f5, #e5e7eb)" },
              { label: "Vit", price: 0, swatch: "#f8f8f6" },
              { label: "Svart", price: 0, swatch: "#111111" },
              { label: "Turkos", price: 0, swatch: "#0785b8" },
              { label: "Gul", price: 0, swatch: "#f4c334" },
              { label: "Röd", price: 0, swatch: "#f04446" },
              { label: "Grön", price: 0, swatch: "#8ac63f" },
              { label: "Blå", price: 0, swatch: "#203d78" },
              { label: "Orange", price: 0, swatch: "#f1844e" },
              { label: "Blå transparent", price: 0, swatch: "repeating-linear-gradient(135deg, #278cc5 0 8px, #369bd0 8px 16px)" },
              { label: "Röd transparent", price: 0, swatch: "repeating-linear-gradient(135deg, #e52d55 0 8px, #f04462 8px 16px)" },
              { label: "Orange transparent", price: 0, swatch: "repeating-linear-gradient(135deg, #f39325 0 8px, #f7a23a 8px 16px)" },
              { label: "Ljus röd transparent", price: 0, swatch: "repeating-linear-gradient(135deg, #b837a3 0 8px, #cf4db5 8px 16px)" },
              { label: "Blå metallic", price: 0, swatch: "linear-gradient(110deg, #159ce7 15%, #74c7f5 50%, #168dda 85%)" },
              { label: "Guld metallic", price: 0, swatch: "linear-gradient(110deg, #fffca8 15%, #fffef0 50%, #fff9a0 85%)" },
              { label: "Silver metallic", price: 0, swatch: "linear-gradient(110deg, #e5e7eb 15%, #ffffff 50%, #d1d5db 85%)" },
              { label: "Rosé-champagne metallic", price: 0, swatch: "linear-gradient(110deg, #ffe0b5 15%, #fff8ec 50%, #ffd19f 85%)" },
            ],
          },
          {
            id: "tryck",
            label: "Tryck",
            kind: "button",
            choices: [
              { label: "Tampongtryck", price: 0 },
              { label: "Digitaltryck", price: 0 },
            ],
          },
          {
            id: "tryckfarger",
            label: "Antal tryckfärger",
            kind: "button",
            choices: [
              {
                label: "1 färg", price: 0, printMethod: "Tampongtryck",
                quantityPrices: priceList(lipBalmQuantities, [4240.49, 4848.95, 5462.97, 6079.64, 6604.07, 9903.44, 11774.76, 17265.66, 22756.34, 27323.64]),
              },
              {
                label: "2 färger", price: 0, printMethod: "Tampongtryck",
                quantityPrices: priceList(lipBalmQuantities, [5273.6, 5954.79, 6636.45, 7330.5, 7918.14, 11531.07, 13649.19, 19719.74, 25790.04, 31075.4]),
              },
              {
                label: "3 färger", price: 0, printMethod: "Tampongtryck",
                quantityPrices: priceList(lipBalmQuantities, [6640.65, 7444.94, 8248.55, 9065.24, 9746.45, 13895.99, 16246.95, 23238.39, 30230.09, 36411.29]),
              },
              {
                label: "4-färgad (CMYK)", price: 0, printMethod: "Digitaltryck",
                quantityPrices: priceList(lipBalmQuantities, [4753.8, 5464.52, 6182.09, 6900.99, 7630.97, 11443.92, 13615.26, 20010.66, 26406.08, 31911.6]),
              },
            ],
          },
        ],
      },
      {
        name: "Kulspetspenna",
        image: "/images/Kulspetspenna/image copy.png?v=2",
        minQuantity: 150,
        quantityPrices: priceList(
          [150, 250, 350, 400, 500, 600, 700, 800, 900, 1000, 1250, 1500, 2000, 2500],
          [3275, 3751.26, 4366.26, 4641.87, 4966.88, 5529.38, 6039.38, 6436.88, 6716.25, 6898.13, 7648.13, 8145, 9916.88, 11398.13],
        ),
        description: "Skapa den perfekta pennan för ditt företag. Du kan välja mellan många olika färger på den här pennan, så att du kan hitta den perfekta kombinationen som passar din stil. Lägg bara till din logotyp och dela ut den och marknadsför företaget på konferenser och mässor. Tack vare att de är så prisvärda behöver du inte hålla igen när du ger bort pennorna.",
        options: [
          {
            id: "hylsa",
            label: "Hylsans färg",
            kind: "image",
            choices: [
              { label: "Kungsblå", price: 0, swatch: "#203d78" },
              { label: "Ljusblå", price: 0, swatch: "#74c7f5" },
              { label: "Svart", price: 0, swatch: "#111111" },
              { label: "Grå", price: 0, swatch: "#666666" },
              { label: "Vit", price: 0, swatch: "#f8f8f6" },
            ],
          },
          {
            id: "trim",
            label: "Trim färg",
            kind: "image",
            choices: [
              { label: "Röd", price: 0, swatch: "#f04446", dependsOn: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Grön", price: 0, swatch: "#8ac63f", dependsOn: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Lila", price: 0, swatch: "#9333ea", dependsOn: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Blå", price: 0, swatch: "#203d78", dependsOn: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Svart", price: 0, swatch: "#111111", dependsOn: { optionId: "hylsa", choiceLabels: ["Kungsblå", "Svart", "Grå", "Vit"] } },
              { label: "Orange", price: 0, swatch: "#f1844e", dependsOn: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Vit", price: 0, swatch: "#f8f8f6", dependsOn: { optionId: "hylsa", choiceLabels: ["Svart", "Grå", "Ljusblå", "Vit"] } },
            ],
          },
          {
            id: "black",
            label: "Bläckfärg",
            kind: "button",
            choices: [
              { label: "Svart", price: 0 },
            ],
          },
          {
            id: "tryckfarg",
            label: "Tryckfärg",
            kind: "button",
            choices: [
              { label: "Svart", price: 0, swatch: "#292929" },
              { label: "Orange", price: 0, swatch: "#ff481c" },
              { label: "Röd", price: 0, swatch: "#cf0b2f" },
              { label: "Mörkröd", price: 0, swatch: "#76212d", dependsOn: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Grön", price: 0, swatch: "#00b449" },
              { label: "Turkos", price: 0, swatch: "#087b78", dependsOn: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Blå", price: 0, swatch: "#101b8f" },
              { label: "Lila", price: 0, swatch: "#4e0d70" },
              { label: "Vit", price: 0, swatch: "#ffffff", excludedChoiceLabels: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Rosa", price: 0, swatch: "#ec4899", excludedChoiceLabels: { optionId: "hylsa", choiceLabels: ["Vit"] } },
              { label: "Gul", price: 0, swatch: "#ffdf3f", excludedChoiceLabels: { optionId: "hylsa", choiceLabels: ["Vit"] } },
            ],
          },
        ],
      },
      {
        name: "Tändsticksask",
        image: "/images/Tändsticksask/image.png",
        description: "Tändsticksask med valfri färg på lådan och plats för din logotyp.",
        minQuantity: 2500,
        maxQuantity: 2500,
        quantityPrices: [{ quantity: 2500, total: 14789 }],
        options: [
          {
            id: "farg",
            label: "Färg på lådan",
            kind: "image",
            choices: [
              { label: "Svart", price: 0, swatch: "#333333" },
              { label: "Vit", price: 0, swatch: "#fafafa" },
              { label: "Grön", price: 0, swatch: "#2dcc32" },
              { label: "Blå", price: 0, swatch: "#2999bc" },
              { label: "Röd", price: 0, swatch: "#ff0000" },
              { label: "Rosa", price: 0, swatch: "#f6c9ed" },
              { label: "Grå", price: 0, swatch: "#666666" },
              { label: "Gul", price: 0, swatch: "#ffd400" },
            ],
          },
        ],
      },
      {
        name: "Vattenflaska",
        image: "/images/Tändsticksask/image copy 5.png",
        minQuantity: 10,
        options: [
          {
            id: "farg",
            label: "Färg på flaskan",
            kind: "image",
            choices: [
              { label: "Vit", price: 0, image: "/images/vattenflaskor/vit.png" },
              { label: "Ljusblå", price: 0, image: "/images/vattenflaskor/ljusbla.png" },
              { label: "Ljusgrön", price: 0, image: "/images/vattenflaskor/ljusgron.png" },
              { label: "Rosa", price: 0, image: "/images/vattenflaskor/rosa.png" },
              { label: "Röd", price: 0, image: "/images/vattenflaskor/rod.png" },
              { label: "Blå", price: 0, image: "/images/vattenflaskor/bla.png" },
              { label: "Orange", price: 0, image: "/images/vattenflaskor/orange.png" },
            ],
          },
          {
            id: "antal-farger",
            label: "Antal färger i din design",
            kind: "button",
            choices: [
              // Grundpriset gäller 150 × 120 mm, varianten 70 × 30 mm.
              {
                label: "1 färg", price: 0,
                quantityPrices: bottlePrices([2227.15, 3478.1, 4276.59, 6048.2, 11007.08, 12570.76, 22220.71, 38983.75, 94128.61]),
                quantityPriceVariants: bottleSmallPrint([2060.8, 2979.05, 3542.99, 5510.89, 9932.45, 11288.22, 21122.79, 38750.84, 93546.37]),
              },
              {
                label: "2 färger", price: 0,
                quantityPrices: bottlePrices([3085.57, 5055.14, 6126.43, 7918.02, 14224.34, 15806.32, 26161.57, 45822.42, 108645.97]),
                quantityPriceVariants: bottleSmallPrint([2945.79, 4288.23, 4875.43, 6841.68, 11923.66, 13487.34, 23870.89, 42182.65, 101166.85]),
              },
              {
                label: "3 färger", price: 0,
                quantityPrices: bottlePrices([4148.54, 6964.85, 8442.03, 10280.18, 18308.22, 19936.77, 31918.94, 54605.68, 126736.5]),
                quantityPriceVariants: bottleSmallPrint([3880.67, 5752.1, 6414.18, 8393.72, 14354.04, 15990.92, 27352.58, 47010.11, 112277.34]),
              },
              {
                label: "4 färger", price: 0,
                quantityPrices: bottlePrices([5301.35, 9140.69, 10967.22, 12945.1, 22995.95, 24880.68, 38609.5, 65019.16, 146573.69]),
                quantityPriceVariants: bottleSmallPrint([4855.48, 7332.42, 8112.6, 10115.45, 17127.08, 18800.56, 30711.18, 52769.13, 124552.28]),
              },
            ],
          },
          {
            id: "trycktyp",
            label: "Tryckalternativ",
            kind: "button",
            choices: [
              { label: "Lasergravyr", price: 0, quantityPrices: bottlePrices([1924.39, 3057.24, 3579.58, 5314.6, 9786.07, 11411.32, 21488.76, 39216.63, 95058.49]) },
              { label: "Fullfärg", price: 0, quantityPrices: bottlePrices([2248.78, 3421.54, 4032.04, 6500.67, 11306.52, 13330.99, 25313.15, 49279.11, 120945.82]) },
              { label: "Otryckt", price: 0, quantityPrices: bottlePrices([1117.6, 1540.13, 1964.33, 3511.36, 6605.47, 8152.51, 15889.44, 31363.28, 77783.11]) },
            ],
          },
          {
            id: "tryckstorlek",
            label: "Storlek på trycket",
            kind: "button",
            choices: [
              { label: "150 × 120 mm", price: 0, dependsOn: { optionId: "antal-farger", choiceLabels: ["1 färg", "2 färger", "3 färger", "4 färger"] } },
              { label: "70 × 30 mm", price: 0, dependsOn: { optionId: "antal-farger", choiceLabels: ["1 färg", "2 färger", "3 färger", "4 färger"] } },
              { label: "205 × 140 mm", price: 0, dependsOn: { optionId: "trycktyp", choiceLabels: ["Fullfärg"] } },
              { label: "35 mm", price: 0, dependsOn: { optionId: "trycktyp", choiceLabels: ["Lasergravyr"] } },
              { label: "Inget tryck", price: 0, dependsOn: { optionId: "trycktyp", choiceLabels: ["Otryckt"] } },
            ],
          },
        ],
      },
      { name: "Produkt 5" },
      { name: "Produkt 6" },
    ],
  },
];

export default function ShopGrid() {
  const featuredOrder = ["Bomullskasse", "Läppbalsam", "Tändsticksask", "Vattenflaska"];
  const products = shopColumns
    .flatMap((column) => column.items.map((item, index) => ({ column, item, index })))
    .filter(({ item }) => item.image)
    .sort((a, b) => {
      const aOrder = featuredOrder.indexOf(a.item.name);
      const bOrder = featuredOrder.indexOf(b.item.name);
      return (aOrder === -1 ? featuredOrder.length : aOrder) - (bOrder === -1 ? featuredOrder.length : bOrder);
    });

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map(({ column, item, index }) => (
        <li
          key={`${column.title}-${item.name}-${index}`}
          className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-colors duration-200 hover:border-primary hover:bg-primary/5"
        >
          <Link
            to={`/butik/${productSlug(column.title, item.name)}`}
            className="flex min-w-0 flex-1 flex-col gap-3"
          >
            <span className="text-sm font-medium text-foreground">{item.name}</span>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className={`aspect-[4/3] w-full rounded-md object-contain ${item.name === "Kulspetspenna" ? "mix-blend-multiply" : ""}`}
              />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
