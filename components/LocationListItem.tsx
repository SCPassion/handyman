import { Location } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type LocationListItemProps = {
  location: Location;
  onDelete: () => void;
};
export default function LocationListItem({
  location,
  onDelete,
}: LocationListItemProps) {
  const db = useSQLiteContext();

  async function handleDelete() {
    try {
      await db.runAsync("DELETE FROM locations WHERE id = ?", location.id);
      onDelete();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text>{location.name}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 4,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
    color: "#333",
  },
  deleteButton: {
    padding: 8,
  },
});
