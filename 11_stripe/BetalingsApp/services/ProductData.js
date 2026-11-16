// Kantinens varer. Hver vare har et navn, en pris og sit eget betalingslink fra Stripe (Del 2).
// Linkene skal starte med https://buy.stripe.com/test_ , så vi er sikre på at være i testmode.
const products = [
  { id: 1, navn: "Kaffe", pris: 25, link: "DIT-KAFFE-LINK-HER" },
  { id: 2, navn: "Croissant", pris: 30, link: "DIT-CROISSANT-LINK-HER" },
  { id: 3, navn: "Frokost", pris: 75, link: "DIT-FROKOST-LINK-HER" },
];

export default products;
