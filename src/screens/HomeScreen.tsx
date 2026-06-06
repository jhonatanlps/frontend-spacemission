import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Defina a lista de rotas (deve ser idêntica à que está no seu App.tsx)
type RootStackParamList = {
  Home: undefined;
  CriarSistemas: undefined;
  MostrarSistemas: undefined;
  MostrarAlertas: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1B2F" />
      
      <View style={styles.content}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Space Mission</Text>
          <Text style={styles.subtitulo}>Bem-vindo ao painel de controle da sua missão espacial!</Text>
        </View>

        {/* Menu de Opções / Botões Estilizados */}
        <View style={styles.menuContainer}>
          
          <TouchableOpacity 
            style={[styles.botao, styles.botaoPrincipal]} 
            onPress={() => navigation.navigate('CriarSistemas')}
          >
            <Text style={styles.botaoTextoPrincipal}>+ Criar Sistema de Monitoramento</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botao} 
            onPress={() => navigation.navigate('MostrarSistemas')}
          >
            <Text style={styles.botaoTexto}>Visualizar Sistemas</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.botao, styles.botaoAlerta]} 
            onPress={() => navigation.navigate('MostrarAlertas')}
          >
            <Text style={[styles.botaoTexto, styles.botaoTextoAlerta]}>⚠️ Verificar Alertas</Text>
          </TouchableOpacity>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: '#1A1B2F', // Fundo escuro espacial idêntico aos anteriores
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 1,
  },
  subtitulo: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
  },
  menuContainer: {
    gap: 16, // Cria um espaçamento uniforme entre os botões
  },
  botao: {
    backgroundColor: '#252641', // Cor de fundo dos cards secundários
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3b5c',
  },
  botaoTexto: {
    color: '#00E5FF', // Azul neon de destaque
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoPrincipal: {
    backgroundColor: '#79059C', // Roxo principal do formulário
    borderColor: '#79059C',
    shadowColor: '#79059C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  botaoTextoPrincipal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoAlerta: {
    borderColor: '#FF3B30', // Borda vermelha indicando perigo/alerta
  },
  botaoTextoAlerta: {
    color: '#FF3B30',
  }
});