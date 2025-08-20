# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

# To debug SQlite operation using drizzle studio

https://github.com/drizzle-team/drizzle-studio-expo?tab=readme-ov-file
https://orm.drizzle.team/docs/connect-expo-sqlite

```
npm i expo-drizzle-studio-plugin
```

# How to use it

```ts
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("reports.db");

export default function Layout() {
  useDrizzleStudio(db);
```

## How to customize the drawer menu?

Customizing the drawer in Expo Router involves creating a custom drawer content component and configuring it with your own styling, dynamic content, and navigation logic.

### Step-by-Step Guide

#### 1. **Create Custom Drawer Content Component**

Create a function that returns your custom drawer layout:

```tsx
// app/(drawer)/_layout.tsx
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  useDrawerStatus,
} from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const pathname = usePathname();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        {/* Your custom content here */}
        <Image source={logo_image} style={styles.logo} />

        {/* Built-in drawer items */}
        <DrawerItemList {...props} />

        {/* Custom drawer items */}
        <Text style={styles.title}>Custom Section</Text>
        {/* Add your custom items */}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={{ paddingBottom: 20 + bottom, padding: 16 }}>
        <Text>Copyright 2025</Text>
      </View>
    </View>
  );
}
```

#### 2. **Add Dynamic Content with Database Integration**

Load data from your database and create dynamic drawer items:

```tsx
function CustomDrawerContent(props: DrawerContentComponentProps) {
  const db = useSQLiteContext();
  const [locations, setLocations] = useState<Location[]>([]);
  const isDrawerOpen = useDrawerStatus() === "open";
  const pathname = usePathname();
  const router = useRouter();

  // Load data when drawer opens
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
    router.push(`/location/${locationId}`);
    // Close drawer manually for custom items
    props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
        <Text style={styles.title}>Locations</Text>

        {/* Dynamic drawer items */}
        {locations.map((location) => {
          const isActive = pathname === `/location/${location.id}`;
          return (
            <DrawerItem
              key={location.id}
              label={location.name}
              onPress={() => routeToLocation(location.id!)}
              focused={isActive}
              activeTintColor="#F2A310"
              inactiveTintColor="#000"
            />
          );
        })}
      </DrawerContentScrollView>
    </View>
  );
}
```

#### 3. **Configure the Drawer with Custom Content**

Use the `drawerContent` prop to apply your custom component:

```tsx
export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#F2A310",
          headerTintColor: "#000",
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Manage Location" }} />
        <Drawer.Screen
          name="location"
          options={{
            title: "Location",
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
```

#### 4. **Add Styling**

Create styles for your custom drawer elements:

```tsx
const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
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
```

### Key Concepts

#### **Layout Structure**

- **`flex: 1`**: Makes the container take full screen height
- **`DrawerContentScrollView`**: Provides scrollable content area
- **`DrawerItemList`**: Renders built-in navigation items
- **Custom `DrawerItem`**: Renders dynamic content items

#### **Navigation Handling**

- **Built-in items** (`DrawerItemList`): Automatically close drawer
- **Custom items** (`DrawerItem`): Require manual drawer closing
- **Active state**: Use `pathname` to determine current route

#### **Data Loading**

- **Load on drawer open**: Use `useDrawerStatus()` to detect when drawer opens
- **Database integration**: Use `useSQLiteContext()` for data access
- **State management**: Use `useState` and `useEffect` for data handling

#### **Styling Differences**

- **`screenOptions`**: Global styling for all drawer items
- **`DrawerItem` props**: Individual styling for custom items
- **Safe area**: Use `useSafeAreaInsets()` for proper spacing

### Complete Example

```tsx
// app/(drawer)/_layout.tsx
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
import { DrawerActions } from "@react-navigation/native";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
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
    router.push(`/location/${locationId}`);
    props.navigation.dispatch(DrawerActions.closeDrawer());
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView>
        <Image source={logo_image} style={styles.logo} />
        <View style={styles.locationsContainer}>
          <DrawerItemList {...props} />
          <Text style={styles.title}>Locations</Text>
          {locations.map((location) => {
            const isActive = pathname === `/location/${location.id}`;
            return (
              <DrawerItem
                key={location.id}
                label={location.name}
                onPress={() => routeToLocation(location.id!)}
                focused={isActive}
                activeTintColor="#F2A310"
                inactiveTintColor="#000"
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View style={{ paddingBottom: 20 + bottom, padding: 16 }}>
        <Text>Copyright 2025</Text>
      </View>
    </View>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerActiveTintColor: "#F2A310",
          headerTintColor: "#000",
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Manage Location" }} />
        <Drawer.Screen
          name="location"
          options={{
            title: "Location",
            drawerItemStyle: { display: "none" },
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  logo: { width: 100, height: 100, alignSelf: "center" },
  locationsContainer: { marginTop: 20 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 16,
    paddingTop: 24,
    color: "#a6a6a6",
  },
});
```

### Required Dependencies

```bash
npm install @react-navigation/drawer react-native-gesture-handler react-native-reanimated react-native-safe-area-context
```

### Key Points

1. **Custom drawer content** requires manual drawer closing for custom items
2. **Data loading** should happen when drawer opens for performance
3. **Active state** management is crucial for proper visual feedback
4. **Safe area insets** ensure proper spacing on different devices
5. **Flex layout** is essential for proper drawer structure
