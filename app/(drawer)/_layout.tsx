import { Drawer } from "expo-router/drawer";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function Layout() {
  return (
    <GestureHandlerRootView>
      {/* The time and info on top will be hidden when the drawer is open */}
      <Drawer
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#F2A310", // The color of the active tab text inside the drawer
          headerTintColor: "#000", // The color of the menu icon on the top left
        }}
      >
        {/* name is the name of the exact file in the folder (drawer) */}
        <Drawer.Screen name="index" options={{ title: "Manage Location" }} />
        <Drawer.Screen name="location" options={{ title: "Location" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});
