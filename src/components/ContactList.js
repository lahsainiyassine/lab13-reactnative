import React from 'react';
import { FlatList, Text, View, TouchableOpacity, StyleSheet, Button } from 'react-native';

export default function ContactList({ contacts, onSelect, onDelete }) {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TouchableOpacity style={styles.info} onPress={() => onSelect(item)}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>📞 {item.phone}</Text>
        {item.email ? <Text style={styles.email}>✉️ {item.email}</Text> : null}
      </TouchableOpacity>
      <View style={styles.actions}>
        <Button title="Suppr" color="#d9534f" onPress={() => onDelete(item.id)} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={
        <Text style={styles.empty}>Aucun contact enregistré.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
  phone: { fontSize: 14, color: '#555555', marginTop: 2 },
  email: { fontSize: 12, color: '#888888', marginTop: 2 },
  actions: { marginLeft: 10 },
  empty: { textAlign: 'center', color: '#888888', marginTop: 20 },
});
