import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert } from 'react-native';
import { getCategorias, saveCategorias } from '../services/storageService';

const CategoryScreen = () => {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    const cats = await getCategorias();
    setCategorias(cats);
  };

  const adicionarCategoria = async () => {
    if (!novaCategoria.trim()) {
      Alert.alert('Erro', 'Digite uma categoria válida.');
      return;
    }

    if (categorias.includes(novaCategoria.trim())) {
      Alert.alert('Erro', 'Categoria já existe.');
      return;
    }

    const novas = [...categorias, novaCategoria.trim()];
    setCategorias(novas);
    await saveCategorias(novas);
    setNovaCategoria('');
  };

  return (
    <View className="p-4 space-y-4">
      <Text className="text-lg font-bold">Categorias</Text>

      <TextInput
        placeholder="Nova Categoria"
        value={novaCategoria}
        onChangeText={setNovaCategoria}
        className="border p-2 rounded"
      />

      <Button title="Adicionar" onPress={adicionarCategoria} />

      <FlatList
        data={categorias}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text className="py-1">{item}</Text>}
      />
    </View>
  );
};

export default CategoryScreen;
