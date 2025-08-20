//import { Stack } from "expo-router";
import { Slot } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";

export default function RootLayout() {
  return (
    // Adding a suspense fallback here will prevent the app from crashing when the database is not ready
    // How?
    // When the database is not ready, the app will show a loading indicator
    // When the database is ready, the app will show the content
    <Suspense fallback={<ActivityIndicator />}>
      <SQLiteProvider databaseName="reports.db" onInit={migrateDbIfNeeded}>
        <Slot />
      </SQLiteProvider>
    </Suspense>
  );
  //  return <Stack screenOptions={{ headerShown: false }} />;
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let version = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );

  let currentDbVersion = version?.user_version || 0;

  // Check if tables actually exist
  const tableExists = await db.getFirstAsync(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='locations'"
  );

  if (currentDbVersion >= DATABASE_VERSION && tableExists) {
    return;
  }
  if (currentDbVersion === 0 || !tableExists) {
    await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
    CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, isUrgent INTEGER NOT NULL, locationId INTEGER, imageUri TEXT, FOREIGN KEY (locationId) REFERENCES locations(id));
`);
    await db.runAsync("INSERT INTO locations (name) VALUES (?)", "School");
    await db.runAsync("INSERT INTO locations (name) VALUES (?)", "Hospital");
    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Task 1", "Description 1", 0, 1]
    );
    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Task 2", "Description 2", 1, 2]
    );

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
