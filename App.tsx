import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator } from 'react-native';
import { Alerta } from './src/interfaces/alerta';
import { Sistemas } from './src/interfaces/sistemas';
import { Sensor } from './src/interfaces/sensor';
import { SistemasSensor } from './src/interfaces/sistemasSensor';
import { StatusAlerta } from './src/types/statusAlerta';

import { SistemasCard } from './src/components';
import { AlertasCard } from './src/components';

import { listarSistemas } from './src/services/sistemasService';
import { listarAlertas } from './src/services/alertaService';

export default function App() {

  const [sistemas, setSistemas] = useState<Sistemas[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const [mostrarSistemas, setMostrarSistemas] = useState(false);
  const [mostrarAlertas, setMostrarAlertas] = useState(false);


  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const sistemasData = await listarSistemas();
      setCarregando(true);
      setErro(null);

      const [listagemSistemas, listagemAlertas] = await Promise.all([
        listarSistemas(),
        listarAlertas()
      ]);

      console.log("SISTEMAS:", listagemSistemas);

      setSistemas(listagemSistemas);
      setAlertas(listagemAlertas);
    } catch (error) {
      console.log("DETALHES DO ERRO:", error);
      setErro("Erro ao carregar dados. Por favor, tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  const sensorTemperatura: Sensor = {
    id: 1,
    nome: 'Sensor de Temperatura',
    descricao: 'Mede a temperatura do ambiente'
  };

  const sensorUmidade: Sensor = {
    id: 2,
    nome: 'Sensor de Umidade',
    descricao: 'Mede a umidade do ambiente'
  };

  const sensorPressao: Sensor = {
    id: 3,
    nome: 'Sensor de Pressão',
    descricao: 'Mede a pressão atmosférica do ambiente'
  };

  const sistemaClimatizacao: Sistemas = {
    id: 1,
    nome: 'Sistema de Climatização',
    descricao: 'Controla a temperatura e umidade do ambiente',
    status: true,
    sensores: []
  };

  const sistemaSensorClimatizacao: SistemasSensor = {
    id: 1,
    sensor: sensorTemperatura,
    sistemas: sistemaClimatizacao,
    valor: 22.5,
    timestamp: new Date().toISOString()
  };

  const sistemaSensorUmidade: SistemasSensor = {
    id: 2,
    sensor: sensorUmidade,
    sistemas: sistemaClimatizacao,
    valor: 60.0,
    timestamp: new Date().toISOString()
  };

  const sistemaSensorPressao: SistemasSensor = {
    id: 3,
    sensor: sensorPressao,
    sistemas: sistemaClimatizacao,
    valor: 1013.25,
    timestamp: new Date().toISOString()
  };

  sistemaClimatizacao.sensores.push(sistemaSensorClimatizacao);
  sistemaClimatizacao.sensores.push(sistemaSensorUmidade);
  sistemaClimatizacao.sensores.push(sistemaSensorPressao);

  const [alertaTemperaturaAlta, setAlertaTemperaturaAlta] = useState<Alerta>({
    id: 1,
    descricao: 'Temperatura alta detectada',
    status: 'Ativo' as StatusAlerta,
    sistema: sistemaClimatizacao
  });

  function reconhecerAlerta() {
    setAlertaTemperaturaAlta(prevAlerta => ({
      ...prevAlerta,
      status: 'Reconhecido' as StatusAlerta
    }));
  }

  function resolverAlerta() {
    setAlertaTemperaturaAlta(prevAlerta => ({
      ...prevAlerta,
      status: 'Resolvido' as StatusAlerta
    }));
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <FlatList 
      contentContainerStyle={styles.scrollContent}
      data={[]}
      renderItem={null}
      ListHeaderComponent={ <>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Space Mission</Text>
          <Text style={styles.subtitulo}>Monitoramento de Sistemas e Alertas da missão espacial</Text>
        </View>

        {carregando && <ActivityIndicator size="large" color="#fff" />}

        {erro && (
          <View style={styles.mensagem}>
            <Text style={styles.mensagemTexto}>{erro}</Text>
          </View>
        )}

        {!carregando && !erro && (
          sistemas.map((sistemas) => (
            <View key={sistemas.id} style={styles.card}>
              <Text style={styles.label}>{sistemas.nome}</Text>
              <Text style={styles.valor}>{sistemas.descricao}</Text>
              <Text style={styles.info}>Status: {sistemas.status ? "Ativo" : "Inativo"}</Text>  
            </View>
          ))
        )}

        <View style={styles.card}>
          <Button title="Mostrar Sistemas" onPress={() => setMostrarSistemas(!mostrarSistemas)} />
          {mostrarSistemas && (
            <SistemasCard sistema={sistemaClimatizacao} sensores={sistemaClimatizacao.sensores} />
          )}
        </View>

        <View style={styles.card}>
          <Button title="Mostrar Alertas" onPress={() => setMostrarAlertas(!mostrarAlertas)} />
          {mostrarAlertas && (
            <AlertasCard alerta={alertaTemperaturaAlta} reconhecerAlerta={reconhecerAlerta} resolverAlerta={resolverAlerta} />
          )}
        </View>
      </>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#79059C",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBadge: {
    backgroundColor: "#FFA500",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusConfirmada: {
    backgroundColor: "#4CAF50",
  },
  statusCancelada: {
    backgroundColor: "#F44336",
  },
  statusTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  secao: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#79059C",
    marginBottom: 8,
  },
  valor: {
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  observacoes: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    marginTop: 8,
  },
  acoes: {
    marginTop: 10,
  },
  botaoContainer: {
    marginBottom: 12,
  },
  mensagem: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  mensagemCancelada: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
  },
  mensagemTexto: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  rodape: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  rodapeTexto: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    lineHeight: 18,
  },
});