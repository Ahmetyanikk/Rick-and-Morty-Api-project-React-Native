import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CharacterDetails = ({ route }) => {
  const { character } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, []);

  const checkFavorite = async () => {
    const favoriteChars = await AsyncStorage.getItem('favorites');
    if (favoriteChars) {
      const favorites = JSON.parse(favoriteChars);
      setIsFavorite(favorites.some(fav => fav.id === character.id));
    }
  };

  const toggleFavorite = async () => {
    const favoriteChars = await AsyncStorage.getItem('favorites');
    let favorites = favoriteChars ? JSON.parse(favoriteChars) : [];

    if (isFavorite) {
      favorites = favorites.filter(fav => fav.id !== character.id);
    } else {
      if (favorites.length >= 10) {
        Alert.alert("Sınır Aşıldı", "Favori karakter ekleme sayısını aştınız. Başka bir karakteri favorilerden çıkarmalısınız.");
        return;
      }
      favorites.push(character);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />
      <Text style={styles.name}>{character.name}</Text>
      <Text>Status: {character.status}</Text>
      <Text>Species: {character.species}</Text>
      <Text>Gender: {character.gender}</Text>
      <Text>Origin: {character.origin.name}</Text>
      <Text>Last known location: {character.location.name}</Text>
      <Button title={isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"} onPress={toggleFavorite} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CharacterDetails;
