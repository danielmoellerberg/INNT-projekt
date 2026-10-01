import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LIBRARY_KEY = 'BOOK_LIBRARY';
const DIR = FileSystem.documentDirectory + 'books';

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
  }
}

export async function listBooks() {
  const json = await AsyncStorage.getItem(LIBRARY_KEY);
  const list = json ? JSON.parse(json) : [];
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

export async function addBook(localUri) {
  await ensureDir();
  const id = Date.now().toString();
  const dest = `${DIR}/${id}.jpg`;
  await FileSystem.copyAsync({ from: localUri, to: dest });

  const book = { id, uri: dest, createdAt: Date.now() };
  const list = await listBooks();
  const next = [book, ...list];
  await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(next));
  return book;
}

export async function getItem(id) {
    const list = await listBooks();
    return list.find((x) => x.id === id) || null;
  }
