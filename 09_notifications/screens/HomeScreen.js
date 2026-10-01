import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { listBooks } from '../components/Library';
import BookCard from '../components/Sharing';
import styles, { fabStyles } from '../style/HomeScreenStyle';

// Pulsing FAB som separat komponent
function PulsingFab({ onPress }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1, // uendeligt loop
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[fabStyles.fab, style]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={fabStyles.fabText}>＋</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);

  const loadBooks = async () => {
    const data = await listBooks();
    setBooks(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBooks);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item, index }) => <BookCard item={item} index={index} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Min læseliste</Text>

      {books.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Ingen bøger endnu. Tilføj din første!</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(b) => b.id}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <PulsingFab onPress={() => navigation.navigate('Camera')} />
    </View>
  );
}
