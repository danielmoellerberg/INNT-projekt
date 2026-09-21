// Mock-data til Insight-Scan.
// I en rigtig app ville disse data komme fra en database eller fra AI-udtræk af en scannet kvittering.
// Her er de hardcodet, så appen kan demonstreres uden backend.

// Kategorier vi bruger til at gruppere varer
export const KATEGORIER = [
  "frugt/grønt",
  "kød/protein",
  "mejeri",
  "snacks",
  "drikkevarer",
  "andet",
];

// Kvitteringer som brugeren allerede har scannet (appens startdata)
export const KVITTERINGER = [
  {
    id: "k1",
    butik: "Netto",
    dato: "16-03-2026",
    total: 134,
    varer: [
      { navn: "Arla Skyr Vanilje", pris: 22, kategori: "mejeri" },
      { navn: "Bananer", pris: 14, kategori: "frugt/grønt" },
      { navn: "Kylling Filet", pris: 55, kategori: "kød/protein" },
      { navn: "Rugbrød", pris: 18, kategori: "andet" },
      { navn: "Kims Chips Sourcream", pris: 25, kategori: "snacks" },
    ],
  },
  {
    id: "k2",
    butik: "Rema 1000",
    dato: "15-03-2026",
    total: 103,
    varer: [
      { navn: "Hakket Oksekød 8-12%", pris: 42, kategori: "kød/protein" },
      { navn: "Pasta", pris: 12, kategori: "andet" },
      { navn: "Tomater", pris: 20, kategori: "frugt/grønt" },
      { navn: "Mælk", pris: 11, kategori: "mejeri" },
      { navn: "Coca-Cola Zero 1,5L", pris: 18, kategori: "drikkevarer" },
    ],
  },
  {
    id: "k3",
    butik: "Føtex",
    dato: "14-03-2026",
    total: 193,
    varer: [
      { navn: "Laks", pris: 79, kategori: "kød/protein" },
      { navn: "Broccoli", pris: 15, kategori: "frugt/grønt" },
      { navn: "Kellogg's Cornflakes", pris: 32, kategori: "andet" },
      { navn: "Æbler", pris: 22, kategori: "frugt/grønt" },
      { navn: "Ost", pris: 45, kategori: "mejeri" },
    ],
  },
  {
    id: "k4",
    butik: "Lidl",
    dato: "13-03-2026",
    total: 111,
    varer: [
      { navn: "Kylling Filet", pris: 49, kategori: "kød/protein" },
      { navn: "Agurk", pris: 9, kategori: "frugt/grønt" },
      { navn: "Yoghurt Naturel", pris: 16, kategori: "mejeri" },
      { navn: "Chokolade", pris: 25, kategori: "snacks" },
      { navn: "Danskvand", pris: 12, kategori: "drikkevarer" },
    ],
  },
  {
    id: "k5",
    butik: "Netto",
    dato: "12-03-2026",
    total: 103,
    varer: [
      { navn: "Arla Skyr Vanilje", pris: 22, kategori: "mejeri" },
      { navn: "Gulerødder", pris: 10, kategori: "frugt/grønt" },
      { navn: "Æg", pris: 28, kategori: "kød/protein" },
      { navn: "Kims Chips Sourcream", pris: 25, kategori: "snacks" },
      { navn: "Peanuts", pris: 18, kategori: "snacks" },
    ],
  },
];

// Kvitteringer der "ligger klar" til at blive scannet på ScanScreen.
// Når brugeren trykker "Scan kvittering", vælger vi en tilfældig herfra
// og lader som om AI'en lige har læst den.
export const NYE_KVITTERINGER = [
  {
    butik: "Rema 1000",
    dato: "11-03-2026",
    total: 94,
    varer: [
      { navn: "Hakket Oksekød 8-12%", pris: 42, kategori: "kød/protein" },
      { navn: "Løg", pris: 8, kategori: "frugt/grønt" },
      { navn: "Ris", pris: 15, kategori: "andet" },
      { navn: "Mælk", pris: 11, kategori: "mejeri" },
      { navn: "Coca-Cola Zero 1,5L", pris: 18, kategori: "drikkevarer" },
    ],
  },
  {
    butik: "Føtex",
    dato: "10-03-2026",
    total: 126,
    varer: [
      { navn: "Kalkunbryst", pris: 38, kategori: "kød/protein" },
      { navn: "Spinat", pris: 14, kategori: "frugt/grønt" },
      { navn: "Skyr Naturel", pris: 20, kategori: "mejeri" },
      { navn: "Kellogg's Cornflakes", pris: 32, kategori: "andet" },
      { navn: "Juice", pris: 22, kategori: "drikkevarer" },
    ],
  },
  {
    butik: "Lidl",
    dato: "09-03-2026",
    total: 117,
    varer: [
      { navn: "Arla Skyr Vanilje", pris: 22, kategori: "mejeri" },
      { navn: "Kylling Filet", pris: 49, kategori: "kød/protein" },
      { navn: "Peberfrugt", pris: 13, kategori: "frugt/grønt" },
      { navn: "Kims Chips Sourcream", pris: 25, kategori: "snacks" },
      { navn: "Danskvand", pris: 8, kategori: "drikkevarer" },
    ],
  },
];

// Cashback-tilbud. "vare" skal matche varens navn på kvitteringen,
// så vi kan finde ud af om brugeren har købt netop den vare.
export const CASHBACK_TILBUD = [
  {
    id: "c1",
    brand: "Arla",
    vare: "Arla Skyr Vanilje",
    beloeb: 4,
  },
  {
    id: "c2",
    brand: "Kims",
    vare: "Kims Chips Sourcream",
    beloeb: 3,
  },
  {
    id: "c3",
    brand: "Danish Crown",
    vare: "Hakket Oksekød 8-12%",
    beloeb: 5,
  },
  {
    id: "c4",
    brand: "Coca-Cola",
    vare: "Coca-Cola Zero 1,5L",
    beloeb: 3,
  },
  {
    id: "c5",
    brand: "Kellogg's",
    vare: "Kellogg's Cornflakes",
    beloeb: 4,
  },
];
