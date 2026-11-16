import { StyleSheet } from "react-native";

const GlobalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  overskrift: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  vare: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginBottom: 10,
  },
  vareNavn: { fontSize: 18 },
  varePris: { fontSize: 18, fontWeight: "bold" },
  knap: {
    backgroundColor: "#635BFF",
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 20,
  },
  knapTekst: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  status: { marginTop: 20, fontSize: 16, textAlign: "center" },
  kvitteringBoks: { alignItems: "center", justifyContent: "center", flex: 1 },
  kvitteringTitel: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  kvitteringNote: { marginTop: 20, paddingHorizontal: 40, textAlign: "center", color: "#666" },
});

export default GlobalStyles;
