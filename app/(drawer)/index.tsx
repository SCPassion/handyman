import LocationForm from "@/components/LocationForm";
import LocationListItem from "@/components/LocationListItem";
import { Location } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

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
      {/* If there is an ID field in the data, no need to add a keyExtractor*/}
      <FlatList
        data={locations}
        renderItem={({ item }) => (
          <LocationListItem location={item} onDelete={loadLocations} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No locations added yet</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
});
