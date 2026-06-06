import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import { Sistemas } from "../interfaces/sistemas";
import { listarSistemas } from "../services/sistemasService";

export default function MostrarSistemasScreen() {
    const [sistemas, setSistemas] = useState<Sistemas[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    
    useEffect(() => {
        carregarDados();
    }, []);
    
    async function carregarDados() {
        try {
            setCarregando(true);
            setErro(null);
            const listagemSistemas = await listarSistemas();
            console.log("SISTEMAS:", listagemSistemas);
            setSistemas(listagemSistemas);
        } catch (error) {
            console.log("DETALHES DO ERRO:", error);
            setErro("Erro ao carregar dados. Por favor, tente novamente.");
        } finally {
            setCarregando(false);
        }
    }

    const renderSistemaCard = ({ item }: { item: Sistemas }) => {
        const statusCor = item.status ? "#4CD964" : "#FF3B30";

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{item.nome}</Text>
                    <Text style={styles.idText}>#{item.id}</Text>
                </View>
                
                <Text style={styles.description}>{item.descricao}</Text>
                
                {/* 🛰️ SEÇÃO DE SENSORES VINCULADOS */}
                <View style={styles.sensoresContainer}>
                    <Text style={styles.sensoresTitle}>Sensores do Módulo:</Text>
                    {item.sensores && item.sensores.length > 0 ? (
                        item.sensores.map((s, index) => (
                            <View key={index} style={styles.sensorBadge}>
                                <Text style={styles.sensorText}>
                                    • {s.sensor?.nome || `Sensor #${s.sensor?.id || 'Desconhecido'}`}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.semSensoresText}>Nenhum sensor acoplado.</Text>
                    )}
                </View>
                
                <View style={styles.cardFooter}>
                    <Text style={styles.statusLabel}>
                        Status: <Text style={[styles.statusValor, { color: statusCor }]}>{item.status ? "ATIVO" : "INATIVO"}</Text>
                    </Text>
                </View>
            </View>
        );
    };
        
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1B2F" />
            
            <FlatList 
                contentContainerStyle={styles.scrollContent}
                data={sistemas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSistemaCard}
                
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>Sistemas da Missão</Text>
                        <Text style={styles.subtitulo}>Módulos e estruturas ativas no painel de controle</Text>
                    </View>
                }
                
                ListEmptyComponent={
                    carregando ? (
                        <ActivityIndicator size="large" color="#00E5FF" style={{ marginTop: 40 }} />
                    ) : erro ? (
                        <View style={styles.mensagemError}>
                            <Text style={styles.mensagemTextoErro}>{erro}</Text>
                        </View>
                    ) : (
                        <Text style={styles.mensagemTextoFeedback}>Nenhum sistema encontrado no radar.</Text>
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1A1B2F",
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 6,
    },
    subtitulo: {
        fontSize: 14,
        color: "#AAAAAA",
    },
    card: {
        backgroundColor: "#252641",
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#3a3b5c",
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
        flex: 1,
        marginRight: 10,
    },
    idText: {
        fontSize: 12,
        color: "#66678c",
        fontFamily: "monospace",
    },
    description: {
        fontSize: 14,
        color: "#E0E0E0",
        marginBottom: 12,
        lineHeight: 20,
    },
    /* Estilos adicionados para os sensores */
    sensoresContainer: {
        backgroundColor: "#1e1f35",
        borderRadius: 6,
        padding: 10,
        marginBottom: 12,
    },
    sensoresTitle: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#00E5FF",
        marginBottom: 6,
        textTransform: "uppercase",
    },
    sensorBadge: {
        marginBottom: 4,
    },
    sensorText: {
        fontSize: 13,
        color: "#FFFFFF",
    },
    semSensoresText: {
        fontSize: 13,
        color: "#77789c",
        fontStyle: "italic",
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: "#3a3b5c",
        paddingTop: 10,
        marginTop: 4,
    },
    statusLabel: {
        fontSize: 13,
        color: "#BBBBBB",
    },
    statusValor: {
        fontWeight: "bold",
        fontSize: 13,
    },
    mensagemError: {
        backgroundColor: '#ff3b30',
        padding: 16,
        borderRadius: 8,
        marginTop: 20,
    },
    mensagemTextoErro: {
        color: "#fff",
        textAlign: "center",
        fontSize: 15,
        fontWeight: "bold",
    },
    mensagemTextoFeedback: {
        color: "#666",
        textAlign: "center",
        fontSize: 15,
        fontStyle: "italic",
        marginTop: 40,
    },
});