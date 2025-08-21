import { Location } from "@/types/types";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// const db = SQLite.openDatabaseSync("reports.db");
import logo_image from "@/assets/images/logo.png";
import { DrawerActions } from "@react-navigation/native";

const LOGO_IMAGE = Image.resolveAssetSource(logo_image).uri;

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets(); // This is used to get the bottom safe area insets
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const isDrawerOpen = useDrawerStatus() === "open";
  const pathname = usePathname();

  useEffect(() => {
    if (isDrawerOpen) {
      loadLocations();
    }
  }, [isDrawerOpen]);

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

  function routeToLocation(locationId: number) {
    router.navigate(`/location/${locationId}`);
    // Because DrawerItem didn't clost the drawer automatically when pressing it, different from the <DrawerItemList>
    // We need to close the drawer manually
    props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  return (
    // Flex 1 will make the view take up the full height of the screen
    // Since copyright component only occupies very little height, drawerContentScrollView will take up the rest of the height
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <Image source={{ uri: LOGO_IMAGE }} style={styles.logo} />
        {/* This view wraps all drawer items, so we can add a margin to the top */}
        {/* ┌─────────────────────┐
            │     Drawer Menu     │
            ├─────────────────────┤
            │ �� Manage Location  │  ← DrawerItemList renders these
            │ �� Location         │  ← navigation items
            └─────────────────────┘ */}
        <View style={styles.locationsContainer}>
          {/* This drawer item list renders the navigation items, declared in the <Drawer> component */}
          <DrawerItemList {...props} />
          <Text style={styles.title}>Locations</Text>
          {locations.map((location) => {
            const isActive = pathname === `/location/${location.id}`; // This is checking if the current pathname is the same as the location id
            return (
              <DrawerItem
                key={location.id}
                label={location.name}
                onPress={() => routeToLocation(location.id)}
                focused={isActive} // This is used to highlight the active item
                activeTintColor="#F2A310"
                inactiveTintColor="#000"
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          paddingBottom: 20 + bottom, // At least 20px from the bottom of the screen
          borderTopWidth: 1,
          borderTopColor: "#dde3fe",
          padding: 16,
        }}
      >
        <Text>Copyright SCP 2025</Text>
      </View>
    </View>
  );
}

export default function Layout() {
  // useDrizzleStudio(db);
  return (
    <GestureHandlerRootView>
      {/* The time and info on top will be hidden when the drawer is open */}
      <Drawer
        // This is where we customize the drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#F2A310", // The color of the active tab text inside the drawer
          headerTintColor: "#000", // The color of the menu icon on the top left
        }}
      >
        {/* name is the name of the exact file in the folder (drawer) */}
        <Drawer.Screen name="index" options={{ title: "Manage Location" }} />
        <Drawer.Screen
          name="location"
          options={{
            title: "Location",
            drawerItemStyle: { display: "none" },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logo: { width: 100, height: 100, alignSelf: "center" },
  locationsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 16,
    paddingTop: 24,
    color: "#a6a6a6",
  },
});
