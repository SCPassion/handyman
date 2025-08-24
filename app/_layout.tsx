//import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { router, Slot } from "expo-router";
import { SQLiteProvider, type SQLiteDatabase } from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("📨 Notification received (foreground):", notification);
        console.log("📱 Data:", notification.request.content.data);
      }
    );

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // This will trigger when the user taps on the notification, reacting to the notification
        console.log("📨 Notification response received:", response);
        // Extract the data defined in the data object in the new-task.tsx file
        const locationId =
          response.notification.request.content.data.locationId;
        const taskId = response.notification.request.content.data.taskId;

        console.log("📱 Location ID:", locationId);
        console.log("📱 Task ID:", taskId);

        if (taskId && locationId) {
          router.push(`/location/${locationId}/new-task?taskId=${taskId}`);
        }
      });
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);
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
    // Insert more test data for locations
    await db.runAsync("INSERT INTO locations (name) VALUES (?)", "Home");
    await db.runAsync("INSERT INTO locations (name) VALUES (?)", "Office");

    // Insert more test tasks with proper locationId references
    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Task 1", "Description 1", 0, 1]
    );
    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Task 2", "Description 2", 1, 2]
    );
    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Task 3", "Description 3", 0, 1]
    );
    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Task 4", "Description 4", 1, 3]
    );
    await db.runAsync(
      "INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)",
      ["Task 5", "Description 5", 0, 2]
    );

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
