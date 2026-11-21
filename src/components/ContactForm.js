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
