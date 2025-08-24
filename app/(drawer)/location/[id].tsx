import TaskListItem from "@/components/TaskListItem";
import { Task } from "@/types/types";
import {
  Link,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();
  const db = useSQLiteContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [locationName, setLocationName] = useState<string>("");

  async function loadLocationData() {
    // First, check all locations in database
    const allLocations = await db.getAllAsync("SELECT * FROM locations");

    // Get specific location
    const location = await db.getFirstAsync<{ name: string }>(
      "SELECT * FROM locations WHERE id = ?",
      [id]
    );

    if (location) {
      setLocationName(location.name);
    }

    // Check all tasks in database
    const allTasks = await db.getAllAsync<Task>("SELECT * FROM tasks");

    // Load tasks for this specific location
    const tasks = await db.getAllAsync<Task>(
      "SELECT * FROM tasks WHERE locationId = ?",
      [Number(id)]
    );
    setTasks(tasks);
  }
  useFocusEffect(
    useCallback(() => {
      loadLocationData();
    }, [id, db])
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: locationName || "Tasks" }} />
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskListItem task={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found</Text>
          </View>
        )}
      />
      <Link href={`/location/${id}/new-task`} asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    right: 20,
    backgroundColor: "#F2A310",
    borderRadius: 28,
    elevation: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    color: "#fff",
    fontSize: 24,
  },
});
