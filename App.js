import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import { createTables, getAllContacts, insertContact, updateContact, deleteContact } from './src/database';
import ContactForm from './src/components/ContactForm';
import ContactList from './src/components/ContactList';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const loadContacts = async () => {
    try {
      const data = await getAllContacts();
      setContacts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const initDB = async () => {
      await createTables();
      await loadContacts();
    };
    initDB();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedContact) {
        await updateContact(selectedContact.id, formData.name, formData.phone, formData.email);
        setSelectedContact(null);
      } else {
        await insertContact(formData.name, formData.phone, formData.email);
      }
      await loadContacts();
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'enregistrer le contact.");
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmation', 'Supprimer ce contact ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await deleteContact(id);
          await loadContacts();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.inner}>
        <Text style={styles.headerTitle}>Contacts (SQLite Local)</Text>
        <ContactForm
          onSubmit={handleFormSubmit}
          initialData={selectedContact}
          onCancel={() => setSelectedContact(null)}
        />
        <ContactList
          contacts={contacts}
          onSelect={(c) => setSelectedContact(c)}
          onDelete={handleDelete}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  inner: { flex: 1, padding: 16, paddingTop: 40 },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333333',
  },
});
