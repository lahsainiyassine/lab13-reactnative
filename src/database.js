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
