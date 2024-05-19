import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Episodes from './Components/Episodes'; 
import EpisodeDetails from './Components/EpisodeDetails'; 
import CharacterDetails from './Components/CharacterDetails';
import FavoritesScreen from './Components/FavoritesScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Episodes">
        <Stack.Screen name="Episodes" component={Episodes} options={{ title: 'Bölümler' }} />
        <Stack.Screen name="EpisodeDetails" component={EpisodeDetails} options={{ title: 'Bölüm Detayları' }}/>
        <Stack.Screen name="CharacterDetails" component={CharacterDetails} options={{ title: 'Karakter Detayları' }}/>
        <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favori Karakterler' }} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
