import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  SafeAreaView,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Sistemas } from "../interfaces/sistemas";
import { SistemasSensor } from "../interfaces/sistemasSensor";
import { Sensor } from "../interfaces/sensor";

import { listarSensores } from "../services/sensorService"; 
import { criarSistema } from "../services/sistemasService";

type RootStackParamList = {
  Home: undefined;
  CriarSistemas: undefined;
  MostrarSistemas: undefined;
  MostrarAlertas: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "CriarSistemas">;

export default function CriarSistemaScreen({ navigation }: Props) {
  // Estados do formulário principal
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [status, setStatus] = useState(true);
  const [sensoresVinculados, setSensoresVinculados] = useState<SistemasSensor[]>([]);
  
  // Estado para controlar o carregamento do salvamento geral do formulário
  const [salvando, setSalvando] = useState(false);

  // Estados do Modal de busca de sensores
  const [modalVisivel, setModalVisivel] = useState(false);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [carregandoSensores, setCarregandoSensores] = useState(false);

  // Carrega os sensores do banco assim que o componente abre
  useEffect(() => {
    if (modalVisivel) {
      buscarSensoresDoBanco();
    }
  }, [modalVisivel]);

  async function buscarSensoresDoBanco() {
    try {
      setCarregandoSensores(true);
      const dados = await listarSensores(); 
      setSensores(dados);
    } catch (error) {
      console.log("Erro ao buscar sensores:", error);
      Alert.alert("Erro", "Não foi possível carregar os sensores cadastrados.");
    } finally {
      setCarregandoSensores(false);
    }
  }

  const vincularSensorDoBanco = (sensorSelecionado: Sensor) => {
  const jaAdicionado = sensoresVinculados.some(s => s.sensor.id === sensorSelecionado.id);
  if (jaAdicionado) {
    Alert.alert("Atenção", "Este sensor já foi vinculado a este sistema.");
    return;
  }

  // Monte o objeto exatamente espelhado com o Java
  const novaRelacao: SistemasSensor = {
    id: 0,
    valor: 0,
    timestamp: new Date().toISOString(),
    sensor: {
      id: sensorSelecionado.id,     // Garante que o ID vai aqui
      nome: sensorSelecionado.nome, // Opcional, para renderizar na lista da tela
    } as Sensor,
    sistemas: {} as Sistemas
  };

  setSensoresVinculados([...sensoresVinculados, novaRelacao]);
  setModalVisivel(false);
};

  const removerSensorVinculado = (id: number) => {
    setSensoresVinculados(sensoresVinculados.filter(s => s.sensor.id !== id));
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !descricao.trim()) {
        Alert.alert("Atenção", "Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    const novoSistema: Sistemas = {
        id: 0,
        nome: nome.trim(),
        descricao: descricao.trim(),
        status: status,
        sensores: sensoresVinculados
    };

    try {
        setSalvando(true);
        
        // 1. Envia os dados para o servidor
        await criarSistema(novoSistema);

        // 2. Se chegou aqui, o banco SALVOU! Forçamos o sucesso independente do corpo da resposta
        setSalvando(false);

        setModalVisivel(false);
        setSalvando(false);
        navigation.goBack();

    } catch (error: any) {
        setSalvando(false);
        console.log("ERRO PÓS-SALVAMENTO:", error);
        
        // 🕵️ Check de segurança: Se o banco salvou (status 200/201), mas o Axios reclamou do formato do retorno
        if (error.response && (error.response.status === 200 || error.response.status === 201)) {
            // Se o Spring Boot devolveu sucesso, avisa e volta mesmo assim!
            Alert.alert("Sucesso", "Sistema registrado!", [
            { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } else {
            Alert.alert("Erro", "Não foi possível conectar ao servidor para salvar o sistema.");
        }
    }
    };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1B2F" />
      
      {/* O KeyboardAvoidingView impede que o teclado do celular cubra o botão de salvar no Android/iOS */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled" // Permite clicar nos botões mesmo se o teclado estiver aberto
        >
          <Text style={styles.title}>Registrar Sistema</Text>
          <Text style={styles.subtitle}>Configure a nova estrutura e vincule os sensores existentes</Text>

          {/* Campos de texto */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Sistema *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Propulsão Alpha..."
              placeholderTextColor="#666"
              value={nome}
              onChangeText={setNome}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição / Objetivo *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o propósito deste sistema..."
              placeholderTextColor="#666"
              multiline
              value={descricao}
              onChangeText={setDescricao}
            />
          </View>

          {/* Switch de Status */}
          <View style={styles.switchGroup}>
            <Text style={styles.label}>Status Inicial</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#00E5FF" }}
              thumbColor={status ? "#fff" : "#f4f3f4"}
              onValueChange={setStatus}
              value={status}
            />
          </View>

          <View style={styles.divider} />
          
          {/* Seção de Sensores Vinculados */}
          <View style={styles.sensorHeader}>
            <Text style={styles.sectionTitle}>Sensores Vinculados ({sensoresVinculados.length})</Text>
            <TouchableOpacity style={styles.btnAction} onPress={() => setModalVisivel(true)}>
              <Text style={styles.btnActionText}>+ Buscar no Banco</Text>
            </TouchableOpacity>
          </View>

          {sensoresVinculados.length === 0 ? (
            <Text style={styles.emptySensorsText}>Nenhum sensor acoplado ainda.</Text>
          ) : (
            sensoresVinculados.map((item) => (
              <View key={item.sensor.id} style={styles.sensorItemCard}>
                <Text style={styles.sensorItemText}>📡 {item.sensor.nome}</Text>
                <TouchableOpacity onPress={() => removerSensorVinculado(item.sensor.id)}>
                  <Text style={styles.btnDeleteText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

          {/* Botão de salvar otimizado com prevenção de múltiplos cliques seguidos */}
          <TouchableOpacity 
            style={[styles.btnSalvar, salvando && { opacity: 0.6 }]} 
            onPress={handleSalvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.btnSalvarText}>Salvar Sistema Completo</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ========================================================
          MODAL DE SELEÇÃO DE SENSORES DO BANCO DE DADOS
          ======================================================== */}
      <Modal visible={modalVisivel} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione um Sensor</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Text style={styles.modalCloseBtn}>Fechar</Text>
              </TouchableOpacity>
            </View>

            {carregandoSensores ? (
              <ActivityIndicator size="large" color="#00E5FF" style={{ marginVertical: 40 }} />
            ) : (
              <FlatList
                data={sensores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.modalItemCard}
                    onPress={() => vincularSensorDoBanco(item)}
                  >
                    <Text style={styles.modalItemNome}>{item.nome}</Text>
                    <Text style={styles.modalItemId}>ID: #{item.id}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.modalEmptyText}>Nenhum sensor cadastrado no banco de dados.</Text>
                }
              />
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1B2F" },
  scrollContent: { padding: 24, paddingBottom: 40 }, // Aumentado o padding inferior para garantir o scroll total do botão
  title: { fontSize: 26, fontWeight: "bold", color: "#FFFFFF", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#AAAAAA", marginBottom: 28 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "bold", color: "#00E5FF", marginBottom: 8 },
  input: { backgroundColor: "#252641", color: "#FFFFFF", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: "#3a3b5c" },
  textArea: { height: 80, textAlignVertical: "top" },
  switchGroup: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#252641", padding: 16, borderRadius: 8 },
  divider: { height: 1, backgroundColor: "#3a3b5c", marginVertical: 24 },
  sensorHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#FFFFFF" },
  btnAction: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#00E5FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnActionText: { color: "#00E5FF", fontSize: 12, fontWeight: "bold" },
  emptySensorsText: { color: "#666", fontStyle: "italic", marginBottom: 20 },
  sensorItemCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1f2035", padding: 14, borderRadius: 6, marginBottom: 8 },
  sensorItemText: { color: "#FFF", fontSize: 15 },
  btnDeleteText: { color: "#FF3B30", fontSize: 14, fontWeight: "bold" },
  btnSalvar: { backgroundColor: "#79059C", borderRadius: 8, paddingVertical: 16, alignItems: "center", marginTop: 30, justifyContent: 'center', minHeight: 54 },
  btnSalvarText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  
  modalContainer: { flex: 1, backgroundColor: "rgba(26, 27, 47, 0.9)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#252641", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, maxHeight: "70%" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#3a3b5c", paddingBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  modalCloseBtn: { color: "#FF3B30", fontSize: 16, fontWeight: "bold" },
  modalItemCard: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#1f2035", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalItemNome: { color: "#FFF", fontSize: 16, fontWeight: "500" },
  modalItemId: { color: "#66678c", fontSize: 12, fontFamily: "monospace" },
  modalEmptyText: { color: "#666", textAlign: "center", marginVertical: 30, fontStyle: "italic" }
});