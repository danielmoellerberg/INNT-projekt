// CashbackBanner: det gule banner med kvitteringens cashback.
// Bruges både på GodkendKvittering (før bonen gemmes) og på Kvittering (efter).
// Efter pivoten viser banneret fordelingen: basis (procent af bonen) og eventuel bonus fra
// sponsorerede tilbud. Kvitteringer gemt før pivoten har ingen basis, så for dem vises kun
// det samlede beløb, som det blev beregnet dengang.

import React from "react";
import { View, Text } from "react-native";

import { CASHBACK_SATS_TEKST } from "../context/AppContext";
import { formaterKroner } from "../data/const";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function CashbackBanner({ basis, bonus, cashback }) {
  // Gammel kvittering (før pivoten): kun det samlede beløb
  if (basis === undefined) {
    return (
      <View style={GlobalStyle.cashbackBanner}>
        <Text style={GlobalStyle.cashbackBannerTekst}>Du fik {formaterKroner(cashback)} i cashback</Text>
      </View>
    );
  }

  return (
    <View style={GlobalStyle.cashbackBanner}>
      <Text style={GlobalStyle.cashbackBannerTekst}>
        Du får {formaterKroner(basis)} i cashback ({CASHBACK_SATS_TEKST} af bonen)
      </Text>
      {/* Bonuslinjen vises kun, hvis en vare matchede et sponsoreret tilbud */}
      {bonus > 0 ? (
        <Text style={GlobalStyle.cashbackBannerBonus}>+ {formaterKroner(bonus)} ekstra fra sponsoreret tilbud</Text>
      ) : null}
    </View>
  );
}
