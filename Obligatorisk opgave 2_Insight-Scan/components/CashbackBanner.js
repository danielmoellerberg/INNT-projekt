// CashbackBanner: det gule banner med kvitteringens cashback.
// Bruges både på GodkendKvittering (før bonen gemmes) og på Kvittering (efter).
// Cashback er 0,5 % af hele bonens total, så banneret viser fx "0,5 % af bonen = 1,56 kr.".
//
// Gamle kvitteringer: kvitteringer fra før pivoten har ingen cashbackBasis, og kvitteringer fra
// mellemperioden kan have en bonus (cashbackBonus) fra sponsorerede tilbud, som ikke findes mere.
// For dem vises kun den samlede cashback, som den blev beregnet dengang. Den ændres ikke, så
// saldoen ikke flytter sig.

import React from "react";
import { View, Text } from "react-native";

import { CASHBACK_SATS_TEKST } from "../context/AppContext";
import { formaterKroner } from "../data/const";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function CashbackBanner({ basis, bonus, cashback }) {
  const gammelKvittering = basis === undefined || bonus > 0;

  return (
    <View style={GlobalStyle.cashbackBanner}>
      <Text style={GlobalStyle.cashbackBannerTekst}>
        {gammelKvittering
          ? "Du fik " + formaterKroner(cashback) + " i cashback"
          : CASHBACK_SATS_TEKST + " af bonen = " + formaterKroner(basis)}
      </Text>
    </View>
  );
}
