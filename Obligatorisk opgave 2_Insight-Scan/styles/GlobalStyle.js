import { StyleSheet, Platform } from "react-native";

// =====================================================================
// 1. DESIGNVÆRDIER
// Designsystemet fra Figma ("Insight-app" → Designsystem). Navnene er præcis de samme
// som Figmas variabler og tekststyles, så design og kode kan sammenlignes direkte.
// Al styling længere nede bruger KUN disse konstanter (mønster fra Colors i øvelse 04).
// Faste mål som højder og ikonstørrelser er taget direkte fra Figma, hvor de heller
// ikke er variabler.
// =====================================================================

// Figma-samlingen "Colors" (light mode, den eneste appen bruger).
// Tal i kommentaren = kontrast mod surface, som angivet i Figma (min. 4,5:1 for tekst).
export const Colors = {
  bg: "#F3F6F2", // baggrund bag kort og lister
  surface: "#FFFFFF", // kort og felter
  glass: "#FFFFFFB8", // hvid, 72 % dækkende - kun det flydende lag (tab bar)
  glassStroke: "#FFFFFF99", // hvid, 60 % dækkende - kant på glas-laget
  separator: "#DCE3DE", // skillelinjer
  text: "#111814", // 18:1 (16,6:1 mod bg)
  textSecondary: "#4B5952", // 7,4:1
  textTertiary: "#6B7770", // 4,7:1
  primary: "#1D7348", // 5,8:1 - knapper og aktive elementer
  onPrimary: "#FFFFFF", // tekst på primary (5,8:1)
  primarySoft: "#DDF0E4", // lys grøn baggrund, fx butikslogoer
  cashback: "#8A5300", // 6,3:1 - cashback-beløb
  cashbackSoft: "#FFF1D6", // lys baggrund til cashback
  danger: "#B3261E", // 6,5:1 - fx Log ud
};

// Figma-samlingen "Colors Dark". Bruges ikke endnu - appen kører kun i light mode.
export const ColorsDark = {
  bg: "#0D1210",
  surface: "#1A211D",
  glass: "rgba(26, 33, 29, 0.72)",
  glassStroke: "rgba(255, 255, 255, 0.12)",
  separator: "#2B342F",
  text: "#EEF3EF",
  textSecondary: "#A8B4AD",
  textTertiary: "#8A968F",
  primary: "#5CCB92",
  onPrimary: "#05150C",
  primarySoft: "#173A27",
  cashback: "#F4B860",
  cashbackSoft: "#3A2B12",
  danger: "#FF7A70",
};

// Figma-samlingen "Spacing" (afstande i punkter)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  screen: 20, // luft i siderne af skærmen
};

// Figma-samlingen "Radius" (runde hjørner)
export const Radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 28, // arket under kortet på Butikker
  pill: 999, // helt rund ende, fx knapper og den flydende tab bar
};

// SF Pro Rounded til beløb. På iOS giver "ui-rounded" systemets afrundede font (SF Pro Rounded),
// som virker i Expo Go uden ekstra fontfil. Android har ikke en afrundet systemfont, så der
// bruges den almindelige systemfont med samme størrelse og vægt.
const roundedFont = Platform.select({ ios: "ui-rounded", default: undefined });

// Figmas tekststyles "Typography/...". SF Pro er iOS' systemfont og bruges automatisk,
// så fontFamily angives kun for beløbene. Størrelser følger Apples Dynamic Type-standarder.
// Figma bruger SF Pros egne vægte (Semibold 590, Medium 510). React Native kender kun hele
// hundreder, så de er rundet til nærmeste: 590 -> "600" og 510 -> "500".
export const Typography = {
  largeTitle: { fontSize: 34, lineHeight: 41, fontWeight: "700" },
  title1: { fontSize: 28, lineHeight: 34, fontWeight: "700" },
  title2: { fontSize: 22, lineHeight: 28, fontWeight: "700" },
  title3: { fontSize: 20, lineHeight: 25, fontWeight: "600" },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: "600" },
  body: { fontSize: 17, lineHeight: 22, fontWeight: "400" },
  callout: { fontSize: 16, lineHeight: 21, fontWeight: "400" },
  subheadline: { fontSize: 15, lineHeight: 20, fontWeight: "400" },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: "400" },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" },
  amountHero: { fontSize: 44, lineHeight: 48, fontWeight: "700", fontFamily: roundedFont },
  amount: { fontSize: 22, lineHeight: 26, fontWeight: "600", fontFamily: roundedFont },
};

// Figma-effekten "Glass/Elevation": blød skygge under det flydende lag og cashback-kortet.
// Figmas skyggefarve (#0D1A12) er tæt på Colors.text, så den bruges i stedet for en løs hex.
// Figma har også baggrunds-blur. Det kræver pakken expo-blur, som ikke er brugt i kurset,
// så den er udeladt indtil videre (kan tilføjes senere).
export const Shadow = {
  glass: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8, // Android bruger elevation i stedet for shadow-egenskaberne
  },
};

// Luft i bunden af lister og skærme, så den flydende tab bar ikke dækker sidste række.
// 124 er den samme bundmargen, som Figma-skærmene bruger.
const TAB_BAR_LUFT = 124;

// Kortets højde på Butikker (Figma: 420). Arket under kortet lægger sig 32 punkter op over kortet.
const KORT_HOEJDE = 420;
const ARK_OVERLAP = 32;

// Dynamisk bredde, fx til fremdriftsbjælker, hvor bredden afhænger af data.
// Den ligger her, så selv dynamisk styling er samlet i denne fil (ingen inline-styles i skærmene).
// Eksempel: style={[GlobalStyle.kategoriFremdrift, bredde("34%")]}
export function bredde(vaerdi) {
  return { width: vaerdi };
}

// =====================================================================
// 2. FÆLLES STYLES
// =====================================================================
export const GlobalStyle = StyleSheet.create({
  // ---------- Skærme ----------
  skaerm: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // Indhold i ScrollView: afstand mellem sektionerne kommer fra gap
  skaermIndhold: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: TAB_BAR_LUFT,
    gap: Spacing.xl,
  },
  // Indhold i FlatList: afstanden styres med listeMellemrum og sektionMellemrum
  listeIndhold: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: TAB_BAR_LUFT,
  },
  listeMellemrum: {
    height: Spacing.md,
  },
  // Toppen af en FlatList (ListHeaderComponent): kun afstand mellem sektionerne,
  // fordi margenerne allerede kommer fra listeIndhold
  sektioner: {
    gap: Spacing.xl,
  },
  // Afstand under toppen af en FlatList, når listen starter lige efter overskriften
  listeHeader: {
    marginBottom: Spacing.lg,
  },
  skaermHeader: {
    gap: Spacing.xs,
  },
  titelStor: {
    ...Typography.largeTitle,
    color: Colors.text,
  },
  undertitel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  sektionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: Spacing.md,
  },
  sektionTitel: {
    ...Typography.title3,
    color: Colors.text,
  },
  linkTekst: {
    ...Typography.callout,
    color: Colors.primary,
  },
  fodnote: {
    ...Typography.footnote,
    color: Colors.textTertiary,
  },
  skillelinje: {
    height: 1,
    backgroundColor: Colors.separator,
  },
  centreret: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg,
  },

  // ---------- Tom tilstand (når der endnu ikke er data) ----------
  tomTilstand: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.md,
  },
  tomIkon: {
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tomTitel: {
    ...Typography.title3,
    color: Colors.text,
    textAlign: "center",
  },
  tomTekst: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  tomHandling: {
    alignSelf: "stretch",
  },

  // ---------- Fælles komponenter (fra Figma: "Komponenter") ----------
  // Fælles feedback, når noget trykkes: elementet bliver lidt gennemsigtigt
  trykket: {
    opacity: 0.85,
  },
  deaktiveret: {
    opacity: 0.5,
  },

  // PrimaryButton: kapselformet, én per skærm
  primaryButton: {
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  primaryButtonTekst: {
    ...Typography.headline,
    color: Colors.onPrimary,
  },

  // TextField: synlig label over feltet, så man altid kan se, hvad feltet er til
  textField: {
    gap: 6,
  },
  textFieldLabel: {
    ...Typography.subheadline,
    color: Colors.text,
  },
  textFieldInput: {
    ...Typography.body,
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.surface,
    color: Colors.text,
  },

  // StoreLogo: butikkens forbogstav i en grøn firkant (bruges i ReceiptRow, StoreRow og Kvittering)
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  storeLogoTekst: {
    ...Typography.headline,
    color: Colors.primary,
  },
  storeLogoStor: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  storeLogoStorTekst: {
    ...Typography.title2,
    color: Colors.primary,
  },
  // Markøren på kortet (Figma: Pin): rund, grøn med hvid kant og blød skygge
  storeLogoPin: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.onPrimary,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.glass,
  },
  storeLogoPinTekst: {
    ...Typography.headline,
    color: Colors.onPrimary,
  },

  // Fælles for tekstkolonnen i rækker og kort: navn øverst, info under
  rækkeTekst: {
    flex: 1,
    gap: 2,
  },
  rækkeTitel: {
    ...Typography.headline,
    color: Colors.text,
  },
  rækkeInfo: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },

  // ReceiptRow: én kvittering i en liste
  receiptRow: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  receiptRowBeloeb: {
    alignItems: "flex-end",
    gap: 2,
  },
  receiptRowCashback: {
    ...Typography.footnote,
    color: Colors.cashback,
  },

  // OfferCard: ét tilbud med pris, cashback-mærke og en knap til indkøbslisten
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  offerCardBillede: {
    width: 64,
    height: 64,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  offerCardPrisRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  cashbackBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: Colors.cashbackSoft,
  },
  cashbackBadgeTekst: {
    ...Typography.caption,
    color: Colors.cashback,
  },
  // 44 x 44 er Apples mindste anbefalede trykflade
  offerCardTilfoejKnap: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  // StoreRow: én butik med en "Jeg handler her"-kontakt
  storeRow: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },

  // ScanReminderBanner: påmindelse, hvis det er længe siden sidste scanning (fra opgave 1)
  banner: {
    backgroundColor: Colors.cashbackSoft,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  bannerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  bannerTekst: {
    ...Typography.subheadline,
    flex: 1,
    color: Colors.text,
  },
  bannerLukTekst: {
    ...Typography.subheadline,
    fontWeight: Typography.headline.fontWeight,
    color: Colors.textSecondary,
  },

  // ---------- Navigation: den flydende tab bar ----------
  // Figma har "Liquid Glass" med baggrunds-blur. Uden expo-blur bruger vi Colors.glass
  // (halvgennemsigtig hvid) og skyggen. Blur kan tilføjes senere med expo-blur.
  tabBar: {
    position: "absolute",
    bottom: 34,
    left: Spacing.lg,
    right: Spacing.lg,
    height: 72,
    paddingHorizontal: 14,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: Radius.pill,
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: Colors.glassStroke,
    backgroundColor: Colors.glass,
    ...Shadow.glass,
  },
  // Skjuler tab-baren på Scan, som fylder hele skærmen i Figma
  tabBarSkjult: {
    display: "none",
  },
  tabItem: {
    paddingVertical: 0,
    justifyContent: "center",
  },
  tabIkonOmraade: {
    width: 52,
    height: 30,
  },
  tabIkonPille: {
    width: 52,
    height: 30,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  tabIkonPilleAktiv: {
    backgroundColor: Colors.primarySoft,
  },
  tabScanIkonOmraade: {
    width: 44,
    height: 44,
  },
  tabScanKnap: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  tabLabelAktiv: {
    ...Typography.caption,
    color: Colors.primary,
    marginTop: 3,
  },

  // Header i stacks: samme baggrund som skærmen og ingen skygge, som i Figma
  stackHeader: {
    backgroundColor: Colors.bg,
  },

  // =====================================================================
  // 3. SKÆRME
  // =====================================================================

  // ---------- LoginScreen ----------
  loginIndhold: {
    flexGrow: 1,
    paddingHorizontal: Spacing.screen,
    paddingTop: 56,
    paddingBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  brand: {
    gap: Spacing.md,
  },
  logoFlise: {
    width: 72,
    height: 72,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  felter: {
    gap: Spacing.lg,
  },
  opretLinkRække: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 6,
  },
  opretLinkTekst: {
    ...Typography.callout,
    color: Colors.textSecondary,
  },
  opretLinkHandling: {
    ...Typography.headline,
    color: Colors.primary,
  },
  // Skubber fodnoten ned i bunden af skærmen
  fyld: {
    flex: 1,
  },
  fodnoteCentreret: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    textAlign: "center",
  },

  // ---------- OpretBrugerScreen ----------
  opretIndhold: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
    gap: Spacing.screen,
  },
  rolleListe: {
    gap: Spacing.md,
  },
  rolleKort: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.surface,
  },
  rolleKortValgt: {
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  ikonFlise: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  ikonFliseHvid: {
    backgroundColor: Colors.surface,
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioValgt: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  felterTaet: {
    gap: Spacing.md,
  },

  // ---------- HjemScreen ----------
  hjemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  hilsenDato: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
  profilKnap: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  profilKnapTekst: {
    ...Typography.headline,
    color: Colors.primary,
  },
  // Signaturen: cashback-kortet ligner en bon med perforeret kant forneden
  cashbackKort: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    paddingTop: 22,
    paddingBottom: 30,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
    ...Shadow.glass,
  },
  cashbackEtiket: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  cashbackBeloeb: {
    ...Typography.amountHero,
    color: Colors.cashback,
  },
  cashbackUndertekst: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
  udbetaling: {
    paddingTop: 10,
    gap: 6,
  },
  udbetalingSpor: {
    height: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.cashbackSoft,
    overflow: "hidden",
  },
  udbetalingFremdrift: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.cashback,
  },
  udbetalingTekst: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  // Hullerne i bonens kant er cirkler i baggrundsfarven, som ligger halvt over kortets bund
  perforering: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -6.5,
    height: 13,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  perforeringHul: {
    width: 13,
    height: 13,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bg,
  },
  kpiRække: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  kpiKort: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: 2,
  },
  kpiTal: {
    ...Typography.amount,
    color: Colors.text,
  },
  kpiLabel: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  forbrugKort: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: 14,
  },
  forbrugHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  forbrugTotal: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
  kategoriRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  kategoriNavn: {
    ...Typography.subheadline,
    width: 92,
    color: Colors.text,
  },
  kategoriSpor: {
    flex: 1,
    height: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
    overflow: "hidden",
  },
  kategoriFremdrift: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  kategoriProcent: {
    ...Typography.footnote,
    width: 40,
    textAlign: "right",
    color: Colors.textSecondary,
  },

  // ---------- KvitteringScreen ----------
  kvitteringHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  kvitteringTitel: {
    ...Typography.title1,
    color: Colors.text,
  },
  kvitteringUndertitel: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
  kvitteringHeaderTekst: {
    flex: 1, // fylder pladsen, så billedet af bonen skubbes helt ud til højre
  },
  // Lille billede af bonen i højre side (bon-format: højere end bredt)
  bonMiniature: {
    width: 52,
    height: 68,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.surface,
    overflow: "hidden",
  },
  bonMiniatureBillede: {
    width: "100%",
    height: "100%",
  },

  // ---------- KvitteringBilledeScreen ----------
  bonFuldSkaerm: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  bonFuldIndhold: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  bonFuldBillede: {
    flex: 1,
    width: "100%",
    borderRadius: Radius.sm,
  },
  bonFuldHint: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    textAlign: "center",
    paddingBottom: Spacing.xl,
  },
  cashbackBanner: {
    backgroundColor: Colors.cashbackSoft,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: 2,
  },
  cashbackBannerTekst: {
    ...Typography.subheadline,
    color: Colors.text,
  },
  cashbackBannerBeloeb: {
    ...Typography.amount,
    color: Colors.cashback,
  },
  vareKort: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  vareKortTitel: {
    ...Typography.headline,
    color: Colors.text,
  },
  vareRække: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  vareNavnKolonne: {
    flex: 1,
  },
  vareNavn: {
    ...Typography.body,
    color: Colors.text,
  },
  vareMeta: {
    flexDirection: "row",
    gap: 6,
  },
  vareAntal: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },
  vareCashback: {
    ...Typography.footnote,
    color: Colors.cashback,
  },
  varePris: {
    ...Typography.body,
    color: Colors.text,
  },
  totalTekst: {
    ...Typography.headline,
    color: Colors.text,
  },
  totalBeloeb: {
    ...Typography.amount,
    color: Colors.text,
  },

  // ---------- TilbudScreen ----------
  chipRække: {
    gap: Spacing.sm,
  },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.surface,
    justifyContent: "center",
  },
  chipAktiv: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  chipTekst: {
    ...Typography.subheadline,
    color: Colors.text,
  },
  chipTekstAktiv: {
    ...Typography.subheadline,
    color: Colors.onPrimary,
  },
  udvalgtKort: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  udvalgtEyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  udvalgtEyebrowTekst: {
    ...Typography.caption,
    color: Colors.primary,
  },
  udvalgtBillede: {
    height: 140,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  udvalgtVare: {
    ...Typography.title3,
    color: Colors.text,
  },
  udvalgtButik: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
  },
  udvalgtPrisRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  udvalgtPris: {
    ...Typography.amount,
    color: Colors.text,
  },
  foerPris: {
    ...Typography.subheadline,
    color: Colors.textTertiary,
    textDecorationLine: "line-through",
  },
  cashbackBadgeStor: {
    paddingHorizontal: 10,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
    backgroundColor: Colors.cashbackSoft,
  },
  cashbackBadgeStorTekst: {
    ...Typography.footnote,
    color: Colors.cashback,
  },

  // ---------- ScanScreen ----------
  scanSkaerm: {
    flex: 1,
    backgroundColor: Colors.text,
  },
  // Kameraet fylder hele skærmen bag knapperne
  kamera: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Laget med knapper, der ligger ovenpå kameraet
  scanOverlay: {
    flex: 1,
  },
  scanCentreret: {
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xl,
  },
  // Hvidt kort til fejlbeskeder og spørgsmål om kameratilladelse
  scanBeskedKort: {
    alignSelf: "stretch",
    marginHorizontal: Spacing.screen,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.md,
  },
  scanLukTekst: {
    ...Typography.callout,
    color: Colors.onPrimary,
  },
  glasKnapAktiv: {
    backgroundColor: Colors.surface,
  },
  scanTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
  },
  glasKnap: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  scanHint: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glass,
    justifyContent: "center",
  },
  scanHintTekst: {
    ...Typography.subheadline,
    color: Colors.text,
  },
  scanSoeger: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.screen,
  },
  scanRamme: {
    width: 260,
    height: 400,
    alignItems: "center",
    justifyContent: "center",
  },
  // De fire hjørner af scanne-rammen tegnes som kanter på små firkanter
  hjoerne: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: Colors.onPrimary,
  },
  hjoerneTopVenstre: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: Spacing.md,
  },
  hjoerneTopHoejre: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: Spacing.md,
  },
  hjoerneBundVenstre: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: Spacing.md,
  },
  hjoerneBundHoejre: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: Spacing.md,
  },
  scanInstruktion: {
    ...Typography.headline,
    color: Colors.onPrimary,
  },
  scanKontroller: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: Spacing.xxl,
  },
  // Galleri-knappen: vælg et billede af bonen fra telefonens fotos
  kontrolKolonne: {
    alignItems: "center",
    gap: 6,
  },
  galleriKnap: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glass,
    alignItems: "center",
    justifyContent: "center",
  },
  kontrolTekst: {
    ...Typography.caption,
    color: Colors.onPrimary,
  },
  udloeser: {
    width: 80,
    height: 80,
    borderRadius: Radius.pill,
    borderWidth: 4,
    borderColor: Colors.onPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  udloeserIndre: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: Colors.onPrimary,
  },
  kontrolPlads: {
    width: 52,
    height: 52,
  },

  // ---------- GodkendKvitteringScreen ----------
  // Lysegrøn boks, der fortæller, at varerne er aflæst af AI
  aiMaerke: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.primarySoft,
  },
  aiMaerkeTekst: {
    ...Typography.footnote,
    flex: 1,
    color: Colors.text,
  },
  godkendVareRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  // Feltet, hvor prisen kan rettes
  prisInput: {
    ...Typography.body,
    width: 96,
    height: 44,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.separator,
    backgroundColor: Colors.surface,
    color: Colors.text,
    textAlign: "right",
  },
  // Rød kant, når prisen ikke er et gyldigt tal
  prisInputFejl: {
    borderColor: Colors.danger,
  },
  // Låst pris på varer med cashback: samme bredde som feltet, men kan ikke rettes
  prisLaast: {
    width: 96,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: Spacing.xs,
  },
  // 44 x 44 er Apples mindste anbefalede trykflade
  sletKnap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  // ---------- MadplanScreen ----------
  aiKort: {
    backgroundColor: Colors.primarySoft,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  aiTitelRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  aiTitel: {
    ...Typography.headline,
    color: Colors.text,
  },
  aiInputRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    height: 52,
    paddingLeft: Spacing.lg,
    paddingRight: 6,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
  },
  aiInput: {
    ...Typography.body,
    flex: 1,
    color: Colors.text,
  },
  aiSendKnap: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  aiFodnote: {
    ...Typography.footnote,
    color: Colors.textSecondary,
  },

  // ---------- ButikkerScreen ----------
  butikkerSkaerm: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // Kortet øverst. Knappen og infoboksen ligger ovenpå kortet (position absolute).
  kortOmraade: {
    height: KORT_HOEJDE,
  },
  // Når arket er foldet ned, fylder kortet al pladsen over arket
  kortOmraadeFuld: {
    flex: 1,
  },
  // Kortet fylder hele kortområdet (top, bund og sider = 0)
  kort: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  kortKnapper: {
    position: "absolute",
    top: 0,
    right: Spacing.screen,
    paddingTop: Spacing.sm,
  },
  minPlaceringKnap: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    backgroundColor: Colors.glass,
    borderWidth: 1,
    borderColor: Colors.glassStroke,
    alignItems: "center",
    justifyContent: "center",
    ...Shadow.glass,
  },
  // Lille boks med den butik, man har trykket på. Ligger lige over arket.
  butikBoks: {
    position: "absolute",
    left: Spacing.screen,
    right: Spacing.screen,
    bottom: ARK_OVERLAP + Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    gap: Spacing.md,
    ...Shadow.glass,
  },
  butikBoksTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  butikBoksLuk: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  // Arket under kortet (Figma: Ark): hvidt med runde hjørner foroven
  ark: {
    flex: 1,
    marginTop: -ARK_OVERLAP,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.sm,
    ...Shadow.glass,
  },
  // Arket foldet ned: kun toppen vises, og den holdes fri af den flydende tab bar
  arkFoldet: {
    flex: 0,
    paddingBottom: TAB_BAR_LUFT,
  },
  arkTop: {
    paddingHorizontal: Spacing.screen,
  },
  arkGrabber: {
    alignSelf: "center",
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.separator,
  },
  arkIndhold: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: TAB_BAR_LUFT,
  },
  arkHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  arkHeaderTekst: {
    flex: 1,
    gap: 2,
  },
  arkTitel: {
    ...Typography.title2,
    color: Colors.text,
  },
  // Besked i arket: mangler placering, henter, eller fejl
  arkBesked: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.bg,
  },
  arkBeskedRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  arkBeskedTekst: {
    ...Typography.subheadline,
    color: Colors.textSecondary,
    flex: 1,
  },

  // ---------- IndstillingerScreen ----------
  profilKort: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.pill,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTekst: {
    ...Typography.title2,
    color: Colors.primary,
  },
  profilNavn: {
    ...Typography.title3,
    color: Colors.text,
  },
  gruppe: {
    gap: Spacing.sm,
  },
  gruppeTitel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  gruppeListe: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  indstillingRække: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    height: 56,
    paddingHorizontal: Spacing.lg,
  },
  indstillingIkon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  indstillingTekst: {
    ...Typography.body,
    flex: 1,
    color: Colors.text,
  },
  indstillingVaerdi: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  logUdKnap: {
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  logUdTekst: {
    ...Typography.headline,
    color: Colors.danger,
  },

  // ---------- LeverandoerScreen ----------
  leverandoerIndhold: {
    padding: Spacing.screen,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  // Billedet er et screenshot af Figma-skærmen (393 x 1033), så forholdet bevares
  mockupBillede: {
    width: "100%",
    aspectRatio: 393 / 1033,
    borderRadius: Radius.md,
  },
});
