import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type LocationFormProps = {
  onSubmit: (name: string) => void;
};

// Submit a callback function to the parent component, such that the parent component can handle the form submission
export default function LocationForm({ onSubmit }: LocationFormProps) {
  const [name, setName] = useState("");

  async function handleSubmit() {
    if (name.trim()) {
      await onSubmit(name);
      setName("");
    }
  }
  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter location name"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Add Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
