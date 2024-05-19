import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const favoriteChars = await AsyncStorage.getItem('favorites');
    if (favoriteChars) {
      const favs = JSON.parse(favoriteChars);
      setFavorites(favs);
      setFilteredFavorites(favs);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filteredData = favorites.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredFavorites(filteredData);
    } else {
      setFilteredFavorites(favorites);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Favorites.../Favori Arama..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredFavorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('CharacterDetails', { character: item })}>
            <View style={styles.item}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    flex: 1,
  },
  searchBar: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
  },
});

export default FavoritesScreen;
