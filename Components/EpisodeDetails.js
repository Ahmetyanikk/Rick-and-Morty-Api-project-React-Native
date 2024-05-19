import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

const EpisodeDetails = ({ route, navigation }) => {
  const { episodeId } = route.params;
  const [episode, setEpisode] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEpisodeDetails();
  }, []);

  const fetchEpisodeDetails = async () => {
    try {
      const episodeResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
      const episodeData = await episodeResponse.json();
      setEpisode(episodeData);
      fetchCharacters(episodeData.characters);
    } catch (error) {
      console.error('Error fetching episode details:', error);
    }
  };

  const fetchCharacters = async (characterUrls) => {
    try {
      const characterPromises = characterUrls.map(url => fetch(url).then(res => res.json()));
      const charactersData = await Promise.all(characterPromises);
      setCharacters(charactersData);
      setFilteredCharacters(charactersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filteredData = characters.filter(character =>
        character.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCharacters(filteredData);
    } else {
      setFilteredCharacters(characters);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.title}>{`Episode: ${episode.name}`}</Text>
          <Text>{`Air Date: ${episode.air_date}`}</Text>
          <Text>{`Episode Code: ${episode.episode}`}</Text>
          <TextInput
            style={styles.searchBar}
            placeholder="Search Characters..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
          {filteredCharacters.map((character, index) => (
            <TouchableOpacity key={index} onPress={() => navigation.navigate('CharacterDetails', { character })}>
              <View style={styles.characterContainer}>
                <Image source={{ uri: character.image }} style={styles.image} />
                <View style={styles.characterInfo}>
                  <Text style={styles.characterName}>{character.name}</Text>
                  <Text>{`Species: ${character.species}`}</Text>
                  <Text>{`Status: ${character.status}`}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  characterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
});

export default EpisodeDetails;
