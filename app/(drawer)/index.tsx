import LocationForm from "@/components/LocationForm";
import { Location } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Page() {
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    try {
      const locations = await db.getAllAsync<Location>(
        `SELECT * FROM locations`
      );
      console.log("🚀 ~ loadLocations ~ locations:", locations);
      setLocations(locations);
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  }

  async function addLocation(name: string) {
    try {
      await db.runAsync("INSERT INTO locations (name) VALUES (?)", name);
      loadLocations();
    } catch (error) {
      console.error("Error adding location:", error);
    }
  }

  return (
    <View style={styles.container}>
      <LocationForm onSubmit={addLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
