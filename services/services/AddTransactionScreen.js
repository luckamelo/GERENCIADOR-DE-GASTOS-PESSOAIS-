import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveTransaction, getCategorias } from '../services/storageService';

const AddTransactionScreen = ({ navigation }) => {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('receita');
  const [categoria, setCategoria] = useState('Outros');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    const cats = await getCategorias();
    setCategorias(cats);
    if (!cats.includes(categoria)) setCategoria(cats[0]);
  };

  const adicionar = async () => {
    if (!valor || !descricao) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const nova = {
      id: Date.now().toString(),
      tipo,
      valor: parseFloat(valor),
      descricao,
      categoria,
    };

    await saveTransaction(nova);
    navigation.goBack();
  };

  return (
    <View className="p-4 space-y-4">
      <Text>Tipo:</Text>
      <Picker selectedValue={tipo} onValueChange={setTipo}>
        <Picker.Item label="Receita" value="receita" />
        <Picker.Item label="Despesa" value="despesa" />
      </Picker>

      <TextInput
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
        className="border p-2 rounded"
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        className="border p-2 rounded"
      />

      <Text>Categoria:</Text>
      <Picker selectedValue={categoria} onValueChange={setCategoria}>
        {categorias.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <Button title="Salvar" onPress={adicionar} />
    </View>
  );
};

export default AddTransactionScreen;
