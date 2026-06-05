import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Alerta } from "../interfaces/alerta";

type AlertasCardProps = {
  alerta: Alerta;
  reconhecerAlerta: () => void;
  resolverAlerta: () => void;
};

export default function AlertasCard({
  alerta,
  reconhecerAlerta,
  resolverAlerta,
}: AlertasCardProps) {

  return (

    <View style={styles.card}>
      <Text style={styles.description}>{alerta.descricao}</Text>
      <Text style={styles.status}>Status: {alerta.status}</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Reconhecer" onPress={reconhecerAlerta} />
        <Button title="Resolver" onPress={resolverAlerta} />
      </View>
    </View>
    ); 
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
}); 
