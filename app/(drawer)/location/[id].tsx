import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Page() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>Page {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
