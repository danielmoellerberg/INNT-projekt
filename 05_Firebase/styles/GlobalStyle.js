// Fælles farver og styles
import { StyleSheet } from "react-native";

export const Farver = {
  baggrund: "#e3e3e3ff",
  kort: "#FFFFFF",
  primær: "#2563EB",
  tekst: "#111827",
  kant: "#E5E7EB",
};

export const GlobalStyle = StyleSheet.create({
  // Layout
  container: { flex: 1, backgroundColor: Farver.baggrund },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  // Afstande
  skærmIndhold: { padding: 16 },
  listeIndhold: { padding: 12 },
  række: { marginBottom: 12 },

  // Tekst
  etiket: { fontWeight: "600", marginBottom: 6 },
  værdi: { color: Farver.tekst },
  titel: { fontWeight: "600", fontSize: 16, marginBottom: 4 },

  // Inputs
  input: {
    borderWidth: 1,
    borderColor: Farver.kant,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Farver.kort,
  },

  // Kort/kasser med skygge (bruges i begge screens)
  kort: {
    backgroundColor: Farver.kort,
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    // iOS-skygge
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    // Android-skygge
    elevation: 6,
  },

  // Kun hvis du stadig vil bruge linjeopdeling et andet sted
  rækkeMedBundlinje: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Farver.kant,
  },
});
