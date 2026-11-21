# Lab 13 : Gestion d'une base de données locale SQLite avec React Native

- **URL de la plateforme** : https://mliaedu.toubkalit.com/student/courses/38/labs/552
- **Formation** : React Native

---

## 1. Objectifs
- Intégrer une base de données relationnelle locale SQLite dans React Native avec la nouvelle API moderne d'Expo : `expo-sqlite` (`openDatabaseAsync`, `execAsync`, `runAsync`, `getAllAsync`, `getFirstAsync`).
- Créer des tables (`CREATE TABLE IF NOT EXISTS`).
- Effectuer les opérations CRUD avec requêtes SQL paramétrées (`?`) pour prévenir les injections SQL.
- Gérer les transactions atomiques (`BEGIN`, `COMMIT`, `ROLLBACK`).
- Connecter la base SQLite aux composants de l'interface graphique (`ContactForm`, `ContactList`, `FlatList`).
- Fonctionnement 100% hors-ligne garanti.

---

## 2. Dépendances requises
```bash
npx expo install expo-sqlite
```

---

## 3. Structure des fichiers
```text
tp13/
  src/
    database.js
    components/
      ContactForm.js
      ContactList.js
  App.js
  package.json
```

---

## 4. Module de base de données : `src/database.js`
```javascript
import * as SQLite from 'expo-sqlite';

export async function getDBConnection() {
  const db = await SQLite.openDatabaseAsync('contacts.db');
  return db;
}

export async function createTables() {
  const db = await getDBConnection();
  const query = `
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_name ON contacts(name);
  `;
  await db.execAsync(query);
}

export async function getAllContacts() {
  const db = await getDBConnection();
  const query = `SELECT * FROM contacts ORDER BY name ASC;`;
  const result = await db.getAllAsync(query);
  return result;
}

export async function insertContact(name, phone, email) {
  const db = await getDBConnection();
  const query = `INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?);`;
  return await db.runAsync(query, [name, phone, email || null]);
}

export async function updateContact(id, name, phone, email) {
  const db = await getDBConnection();
  const query = `UPDATE contacts SET name = ?, phone = ?, email = ? WHERE id = ?;`;
  return await db.runAsync(query, [name, phone, email || null, id]);
}

export async function deleteContact(id) {
  const db = await getDBConnection();
  const query = `DELETE FROM contacts WHERE id = ?;`;
  return await db.runAsync(query, [id]);
}
```

---

## 5. Composant de formulaire : `src/components/ContactForm.js`
```javascript
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function ContactForm({ onSubmit, initialData, onCancel }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPhone(initialData.phone || '');
      setEmail(initialData.email || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim() || !phone.trim()) {
      setError('Le nom et le téléphone sont obligatoires.');
      return;
    }
    setError('');
    onSubmit({ name, phone, email });
    setName('');
    setPhone('');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {initialData ? 'Modifier le contact' : 'Nouveau contact'}
      </Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Nom complet *"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Téléphone *"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Email (optionnel)"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <View style={styles.buttonsRow}>
        <Button
          title={initialData ? 'Mettre à jour' : 'Enregistrer'}
          onPress={handleSubmit}
          color="#EE9972"
        />
        {initialData ? (
          <Button title="Annuler" onPress={onCancel} color="#888888" />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#FAFAFA',
  },
  error: { color: 'red', marginBottom: 8 },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
});
```

---

## 6. Composant liste : `src/components/ContactList.js`
```javascript
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
```

---

## 7. Code complet App.js
**Fichier : `App.js`**
```javascript
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
```
