import { Link } from "react-router-dom";

export type ProductChoice = {
  label: string;
  price: number;
  image?: string;
  swatch?: string;
  printMethod?: string;
  scale?: number;
};

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
        image: "/images/image.png",
        description: "En bomullskasse med plats för ert motiv. Välj mellan två format och kombinera grundfärg, placering och tryck efter era önskemål.",
        options: [
          {
            id: "format",
            label: "Format",
            kind: "image",
            choices: [
              { label: "40 x 10 x 35", price: 39, image: "/images/40x10x35/image.png" },
              { label: "38 x 10 x 42", price: 49, image: "/images/38x10x42/image.png", scale: 0.8 },
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
                          ? "/images/image copy 6.png?v=2"
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
              { label: "Olika motiv fram och bak", price: 0 },
            ],
          },
          {
            id: "tryck",
            label: "Tryck",
            kind: "button",
            choices: [
              { label: "Digital transfertryck", price: 25 },
              { label: "Screentryck", price: 9 },
            ],
          },
          {
            id: "fargning",
            label: "Färgning",
            kind: "button",
            choices: [
              { label: "4 färger", price: 0, printMethod: "Digital transfertryck" },
              { label: "1 färg", price: 0, printMethod: "Screentryck" },
              { label: "2 färger", price: 6, printMethod: "Screentryck" },
              { label: "3 färger", price: 0, printMethod: "Screentryck" },
              { label: "5 färger", price: 0, printMethod: "Screentryck" },
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
              { label: "1 färg", price: 0, printMethod: "Tampongtryck" },
              { label: "2 färger", price: 0, printMethod: "Tampongtryck" },
              { label: "3 färger", price: 0, printMethod: "Tampongtryck" },
              { label: "4-färgad (CMYK)", price: 0, printMethod: "Digitaltryck" },
            ],
          },
        ],
      },
      { name: "Kulspetspenna", image: "/images/Tändsticksask/image copy 4.png" },
      {
        name: "Tändsticksask",
        image: "/images/Tändsticksask/image.png",
        description: "Tändsticksask med valfri färg på lådan och plats för din logotyp.",
        minQuantity: 2500,
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
              { label: "Transparent", price: 0, image: "/images/vattenflaskor/transparent.png" },
            ],
          },
          {
            id: "antal-farger",
            label: "Antal färger i din design",
            kind: "button",
            choices: [
              { label: "1 färg", price: 0 },
              { label: "2 färger", price: 0 },
              { label: "3 färger", price: 0 },
              { label: "4 färger", price: 0 },
            ],
          },
          {
            id: "trycktyp",
            label: "Tryckalternativ",
            kind: "button",
            choices: [
              { label: "Lasergravyr", price: 0 },
              { label: "Fullfärg", price: 0 },
              { label: "Otryckt", price: 0 },
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
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {shopColumns.map((column) => (
        <section key={column.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-2xl font-bold text-foreground">{column.title}</h2>
          <ul className="space-y-3">
            {column.items.map((item, index) => (
              <li
                key={`${column.title}-${item.name}-${index}`}
                className="flex min-h-16 items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-colors duration-200 hover:border-primary hover:bg-primary/5"
              >
                <Link
                  to={`/butik/${productSlug(column.title, item.name)}`}
                  className="flex min-w-0 flex-1 flex-col gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">{item.name}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{column.title}</span>
                  </div>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-[4/3] w-full rounded-md object-contain"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
