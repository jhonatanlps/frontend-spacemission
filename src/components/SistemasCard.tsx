import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Sistemas } from "../interfaces/sistemas";
import { SistemasSensor } from "../interfaces/sistemasSensor";

type SistemasCardProps = {
  sistema: Sistemas;
  sensores: SistemasSensor[];
};
export default function SistemasCard({
    sistema,
    sensores,
}: SistemasCardProps) {
    return (

        <View style={styles.card}>
            <Text style={styles.title}>{sistema.nome}</Text>
            <Text style={styles.description}>{sistema.descricao}</Text>
            <Text style={styles.status}>Status: {sistema.status ? "Ativo" : "Inativo"}</Text>
            <Text style={styles.sensorsTitle}>Sensores:</Text>
            {sensores.map((sensor) => (
                <View key={sensor.id} style={styles.sensorItem}>
                    <Text style={styles.sensorName}>{sensor.sensor.nome}</Text>
                    <Text style={styles.sensorValue}>Valor: {sensor.valor}</Text>
                    <Text style={styles.sensorTimestamp}>Timestamp: {new Date(sensor.timestamp).toLocaleString()}</Text>
                </View>
            ))}
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
    sensorsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    sensorItem: {
        marginBottom: 8,
    },
    sensorName: {
        fontSize: 14,
        fontWeight: "bold",
    },
    sensorValue: {
        fontSize: 14,
        color: "#333",
    },
    sensorTimestamp: {
        fontSize: 12,
        color: "#999",
    },
});

