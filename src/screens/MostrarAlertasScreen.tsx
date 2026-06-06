import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, FlatList, ActivityIndicator, SafeAreaView } from "react-native";
import { Alerta } from "../interfaces/alerta";
import { listarAlertas } from "../services/alertaService";

export default function MostrarAlertasScreen() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro(null);
  
      // Como é apenas uma requisição, podemos fazer o await direto de forma limpa
      const listagemAlertas = await listarAlertas();
  
      console.log("ALERTAS:", listagemAlertas);
      setAlertas(listagemAlertas);
    } catch (error) {
      console.log("DETALHES DO ERRO:", error);
      setErro("Erro ao carregar dados. Por favor, tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  // Renderizador dos Cards de Alerta estilizados para o painel espacial
  const renderAlertaCard = ({ item }: { item: Alerta }) => {
    // Lógica para definir a cor do status baseado no nível do alerta
    const ehCritico = item.status?.toLowerCase() === "critico" || item.status?.toLowerCase() === "alto";
    const statusCor = ehCritico ? "#FF3B30" : "#FFCC00"; // Vermelho para crítico, Amarelo para aviso

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.descricao}</Text>
          <Text style={styles.idText}>#{item.id}</Text>
        </View>
        
        <Text style={styles.systemName}>Sistema: {item.sistemas.nome}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.statusLabel}>
            Status: <Text style={[styles.statusValor, { color: statusCor }]}>{item.status?.toUpperCase()}</Text>
          </Text>
        </View>
      </View>
    );
  };
      
  return (
    <SafeAreaView style={styles.container}>
      {/* Alinhado com o fundo escuro da HomeScreen */}
      <StatusBar barStyle="light-content" backgroundColor="#1A1B2F" />
      
      <FlatList 
        contentContainerStyle={styles.scrollContent}
        data={alertas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAlertaCard}
        
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Painel de Alertas</Text>
            <Text style={styles.subtitulo}>Anomalias e ocorrências em tempo real na nave</Text>
          </View>
        }
        
        // Trata os estados de carregamento, erro ou lista vazia mantendo os textos visíveis no fundo escuro
        ListEmptyComponent={
          carregando ? (
            <ActivityIndicator size="large" color="#00E5FF" style={{ marginTop: 40 }} />
          ) : erro ? (
            <View style={styles.mensagemError}>
              <Text style={styles.mensagemTextoErro}>{erro}</Text>
            </View>
          ) : (
            <Text style={styles.mensagemTextoFeedback}>Nenhum incidente ou alerta registrado.</Text>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1B2F", // Fundo oficial escuro do app
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
    backgroundColor: "#252641", // Cor interna dos componentes do painel
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
  systemName: {
    fontSize: 14,
    color: "#00E5FF", // Destaque em azul neon para identificar o sistema
    marginBottom: 12,
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