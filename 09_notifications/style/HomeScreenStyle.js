import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 10 },
  header: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, textAlign: 'center', color: '#333' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 16, color: '#666' },
});

// Egen styling-gruppe til den pulserende "+"-knap (PulsingFab)
export const fabStyles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: '#4B7BE5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  fabText: { fontSize: 30, color: '#fff', fontWeight: 'bold' },
});

export default styles;
