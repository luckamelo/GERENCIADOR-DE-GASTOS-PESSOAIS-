import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Share, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { getTransactions } from '../services/storageService';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = ({ navigation }) => {
  const [transactions, setTransactions] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    loadTransactions();
  }, [isFocused]);

  const loadTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const receitas = transactions
    .filter(t => t.tipo === 'receita')
    .reduce((acc, cur) => acc + cur.valor, 0);

  const despesas = transactions
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, cur) => acc + cur.valor, 0);

  const gastosPorCategoria = () => {
    const map = {};
    transactions
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        map[t.categoria] = (map[t.categoria] || 0) + t.valor;
      });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
      color: getColor(name),
      legendFontColor: '#7F7F7F',
      legendFontSize: 12,
    }));
  };

  const getColor = (categoria) => {
    const cores = {
      Alimentação: '#f39c12',
      Lazer: '#2980b9',
      Transporte: '#27ae60',
      Outros: '#8e44ad',
    };
    return cores[categoria] || '#bdc3c7';
  };

  const compartilharResumo = () => {
    const texto = `Resumo Financeiro:\nReceitas: R$ ${receitas.toFixed(2)}\nDespesas: R$ ${despesas.toFixed(2)}\nSaldo: R$ ${(receitas - despesas).toFixed(2)}`;
    Share.share({ message: texto });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Resumo Financeiro</Text>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Receitas x Despesas</Text>
        <BarChart
          data={{
            labels: ['Receitas', 'Despesas'],
            datasets: [{ data: [receitas, despesas] }],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="R$ "
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Despesas por Categoria</Text>
        {gastosPorCategoria().length > 0 ? (
          <PieChart
            data={gastosPorCategoria()}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        ) : (
          <Text style={styles.noDataText}>Nenhuma despesa cadastrada.</Text>
        )}
      </View>

      <Text style={styles.title}>Lançamentos</Text>
      {transactions.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum lançamento cadastrado.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionDesc}>{item.descricao}</Text>
              <Text style={{ color: item.tipo === 'receita' ? 'green' : 'red' }}>
                {item.tipo === 'receita' ? '+' : '-'} R$ {item.valor.toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Novo Lançamento" onPress={() => navigation.navigate('Novo Lançamento')} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Compartilhar Resumo" onPress={compartilharResumo} />
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  chart: {
    borderRadius: 12,
  },
  noDataText: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
  },
  transactionDesc: {
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default DashboardScreen;
