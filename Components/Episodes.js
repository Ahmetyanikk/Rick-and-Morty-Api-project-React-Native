import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const Episodes = ({ navigation }) => {
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [displayEpisodes, setDisplayEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [episodesPerPage] = useState(20); 
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllEpisodes = async () => {
    let fetchedEpisodes = [];
    let page = 1;
    let morePagesAvailable = true;

    while (morePagesAvailable) {
      try {
        const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
        const jsonData = await response.json();
        fetchedEpisodes = fetchedEpisodes.concat(jsonData.results);
        if (!jsonData.info.next) {
          morePagesAvailable = false;
        }
        page++;
      } catch (error) {
        console.error('Error fetching data: ', error);
        morePagesAvailable = false; 
      }
    }

    setAllEpisodes(fetchedEpisodes);
    setDisplayEpisodes(fetchedEpisodes.slice(0, episodesPerPage));
    setLoading(false);
  };

  useEffect(() => {
    fetchAllEpisodes();
  }, []);

  useEffect(() => {
    const firstPageIndex = (currentPage - 1) * episodesPerPage;
    const lastPageIndex = firstPageIndex + episodesPerPage;
    setDisplayEpisodes(allEpisodes.slice(firstPageIndex, lastPageIndex));
  }, [currentPage, allEpisodes]);

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text) {
      const filteredData = allEpisodes.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setDisplayEpisodes(filteredData.slice(0, episodesPerPage));
    } else {
      setDisplayEpisodes(allEpisodes.slice(0, episodesPerPage));
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Episodes... / Bölüm Arama..."
        value={searchTerm}
        onChangeText={handleSearch}
      />
      <Button
        title="View Favorites / Favorilere Bakma"
        onPress={() => navigation.navigate('Favorites')}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={displayEpisodes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('EpisodeDetails', { episodeId: item.id })}>
              <Text style={styles.item}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.pagination}>
        <Button title="Önceki" onPress={handlePrevPage} disabled={currentPage === 1} />
        <Text style={styles.pageInfo}>{`Page ${currentPage}`}</Text>
        <Button title="Sonraki" onPress={handleNextPage} disabled={displayEpisodes.length < episodesPerPage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  searchBar: {
    fontSize: 18,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    width: '90%',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pageInfo: {
    fontSize: 18,
  },
});

export default Episodes;
