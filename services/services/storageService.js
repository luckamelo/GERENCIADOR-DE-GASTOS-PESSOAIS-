import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTransactions = async () => {
  const data = await AsyncStorage.getItem('transactions');
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = async (transaction) => {
  const data = await getTransactions();
  data.push(transaction);
  await AsyncStorage.setItem('transactions', JSON.stringify(data));
};

export const getCategorias = async () => {
  const data = await AsyncStorage.getItem('categorias');
  return data ? JSON.parse(data) : ['Alimentação', 'Lazer', 'Transporte', 'Outros'];
};

export const saveCategorias = async (categorias) => {
  await AsyncStorage.setItem('categorias', JSON.stringify(categorias));
};
