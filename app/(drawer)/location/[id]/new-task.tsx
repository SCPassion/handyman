import { Task } from "@/types/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function newTask() {
  const { id: locationId, taskId } = useLocalSearchParams();
  console.log("🚀 ~ newTask ~ taskId:", taskId);
  console.log("🚀 ~ newTask ~ locationId:", locationId);

  const router = useRouter();
  const db = useSQLiteContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  async function loadTaskData() {
    const task = await db.getFirstAsync<Task>(
      "SELECT * FROM tasks WHERE id = ?",
      [Number(taskId)]
    );
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIsUrgent(task.isUrgent);
      setImageUri(task.imageUri || null);
    }
  }

  async function handleSaveTask() {
    let newTaskId: Number;
    if (taskId) {
      // update existing task
    } else {
      // insert new task
    }
  }

  async function handleFinishTask() {
    await db.runAsync("UPDATE tasks SET isFinished = 1 WHERE id = ?", [
      Number(taskId),
    ]);
  }

  useEffect(() => {
    if (taskId) {
    }
  }, [taskId]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor="gray"
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="gray"
        multiline={true}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Urgent</Text>
        <Switch
          value={isUrgent}
          onValueChange={setIsUrgent}
          trackColor={{ true: "#F2A310", false: "#767577" }}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
        <Text style={styles.buttonText}>
          {taskId ? "Update Task" : "Create Task"}
        </Text>
      </TouchableOpacity>

      {taskId && (
        <TouchableOpacity
          style={[styles.button, styles.finishButton]}
          onPress={handleFinishTask}
        >
          <Text style={styles.buttonText}>Finish Task</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#F2A310",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  finishButton: {
    backgroundColor: "#4dAF50",
  },
  buttonText: {
    color: "#fff",
  },
});
