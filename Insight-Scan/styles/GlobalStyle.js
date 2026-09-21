import { StyleSheet } from "react-native";

// Farvepalet - teal som brandfarve, amber til cashback (så "penge" springer i øjnene)
export const Colors = {
  primary: "#0F766E",
  primaryDark: "#115E59",
  primaryLight: "#E6F4F1",
  accent: "#F59E0B",
  accentLight: "#FEF3C7",
  background: "#F5F7F6",
  surface: "#FFFFFF",
  textDark: "#1F2937",
  textMuted: "#6B7280",
  border: "#E5E7EB",
};

// ALLE styles i appen ligger her, så der ikke er inline-styles ude i skærmene
export const GlobalStyle = StyleSheet.create({
  // ---------- Navigation (header + tab bar) ----------
  header: {
    backgroundColor: Colors.primary,
  },
  headerTitel: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.surface,
  },
  tabBar: {
    backgroundColor: Colors.primary,
    paddingTop: 4,
  },

  // ---------- Generelt ----------
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centreret: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  indhold: {
    padding: 16,
  },
  listeIndhold: {
    padding: 16,
    paddingBottom: 32,
  },
  kort: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  række: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rækkeMedLinje: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sektionsTitel: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textDark,
    marginBottom: 8,
    marginTop: 8,
  },
  etiket: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  værdi: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textDark,
  },
  brødtekst: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
  },

  // ---------- OverblikScreen ----------
  forbrugKort: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  forbrugEtiket: {
    fontSize: 14,
    color: Colors.primaryLight,
    marginBottom: 4,
  },
  forbrugTal: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.surface,
  },
  cashbackKort: {
    backgroundColor: Colors.accentLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.accent,
    padding: 16,
    marginBottom: 12,
  },
  cashbackTal: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textDark,
  },
  indsigtKort: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  indsigtTitel: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  indsigtTekst: {
    fontSize: 14,
    color: Colors.textDark,
    lineHeight: 20,
    marginBottom: 6,
  },

  // ---------- Kvitteringer i FlatList ----------
  kvitteringKort: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kvitteringVenstre: {
    flex: 1,
  },
  kvitteringButik: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textDark,
  },
  kvitteringDato: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  kvitteringTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },

  // ---------- KvitteringScreen (detaljer) ----------
  kategoriTitel: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginTop: 12,
    marginBottom: 4,
  },
  vareNavn: {
    fontSize: 15,
    color: Colors.textDark,
    flex: 1,
  },
  varePris: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textDark,
    marginLeft: 8,
  },
  cashbackMærke: {
    backgroundColor: Colors.accentLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  cashbackMærkeTekst: {
    fontSize: 12,
    fontWeight: "bold",
    color: Colors.textDark,
  },

  // ---------- ScanScreen ----------
  scanBoks: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    padding: 28,
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  scanTitel: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textDark,
    marginTop: 12,
    marginBottom: 6,
    textAlign: "center",
  },
  scanTekst: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 8,
  },
  statusBoks: {
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    width: "100%",
  },
  statusTekst: {
    fontSize: 14,
    color: Colors.textDark,
    textAlign: "center",
  },

  // ---------- CashbackScreen ----------
  saldoKort: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
  },
  saldoEtiket: {
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: 4,
  },
  saldoTal: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.textDark,
  },
  tilbudKort: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tilbudVenstre: {
    flex: 1,
  },
  tilbudBrand: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  tilbudVare: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textDark,
    marginTop: 2,
  },
  tilbudBeloebBoks: {
    backgroundColor: Colors.accentLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
  },
  tilbudBeloeb: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textDark,
  },

  // ---------- ButtonComponent ----------
  knapRække: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  primaryBtnTrykket: {
    backgroundColor: Colors.primaryDark,
  },
  primaryBtnText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  secondaryBtnTrykket: {
    backgroundColor: Colors.primaryLight,
  },
  secondaryBtnText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  // Bruges når to knapper står ved siden af hinanden
  halvKnap: {
    flex: 1,
    marginHorizontal: 4,
  },
  // Bruges når en knap er slået fra (fx mens der scannes)
  deaktiveret: {
    opacity: 0.5,
  },
});
