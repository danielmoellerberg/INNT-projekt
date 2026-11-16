// Shop-skærmen: viser kantinens varer, lader brugeren vælge én og starter betalingen hos Stripe.
import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import products from "../services/ProductData";
import betal from "../services/Payment";
import GlobalStyles from "../styles/GlobalStyles";

export default function ShopScreen({ navigation }) {
  const [valgt, setValgt] = useState(products[0]);
  const [status, setStatus] = useState("");

  // Åbner betalingslinket for den valgte vare. Når brugeren lukker browseren,
  // viser vi hvad der kom tilbage, og går videre til kvitteringen med varens navn.
  const paaBetal = async () => {
    try {
      setStatus("Åbner betaling ...");

      // await er nødvendig: uden den får vi et Promise i stedet for svaret fra browseren.
      const resultat = await betal(valgt.link);

      setStatus(`Browseren blev lukket (${resultat.type})`);
      navigation.navigate("kvittering", { vare: valgt.navn });
    } catch (fejl) {
      // Fejler noget (fx et ugyldigt link), vælter appen ikke. Vi viser fejlen i stedet.
      setStatus(`Noget gik galt: ${fejl.message}`);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.overskrift}>Kantinen</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              GlobalStyles.vare,
              item.id === valgt.id && { borderWidth: 2, borderColor: "#635BFF" },
            ]}
            onPress={() => setValgt(item)}
          >
            <Text style={GlobalStyles.vareNavn}>{item.navn}</Text>
            <Text style={GlobalStyles.varePris}>{item.pris} kr.</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={GlobalStyles.knap} onPress={paaBetal}>
        <Text style={GlobalStyles.knapTekst}>
          Betal {valgt.pris} kr. for {valgt.navn}
        </Text>
      </TouchableOpacity>

      <Text style={GlobalStyles.status}>{status}</Text>
    </View>
  );
}
