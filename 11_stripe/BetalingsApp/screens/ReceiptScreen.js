// Kvitteringsskærmen: viser, hvad brugeren har købt. Varens navn kommer med fra ShopScreen.
import { View, Text } from "react-native";
import GlobalStyles from "../styles/GlobalStyles";

export default function ReceiptScreen({ route }) {
  // ?? betyder "hvis der ikke er noget, så brug dette i stedet",
  // så skærmen ikke går ned, hvis den åbnes uden en vare.
  const vare = route.params?.vare ?? "din vare";

  return (
    <View style={GlobalStyles.kvitteringBoks}>
      <Text style={GlobalStyles.kvitteringTitel}>Tak for købet</Text>
      <Text>Du har betalt for {vare}.</Text>
      <Text style={GlobalStyles.kvitteringNote}>
        Betalingen står nu i Stripes dashboard under Payments.
      </Text>
    </View>
  );
}
