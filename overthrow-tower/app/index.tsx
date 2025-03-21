import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [cubes, setCubes] = useState<{ id: number; color: string }[]>([]);
  const [slot1, setSlot1] = useState<{ id: number; color: string }[]>([]);
  const [slot2, setSlot2] = useState<{ id: number; color: string }[]>([]);
  const cubeId = useRef(1); // Unique counter for cube IDs

  const colors = [
    { hex: "#4CAF50", name: "Green" },
    { hex: "#FF5722", name: "Orange" },
    { hex: "#2196F3", name: "Blue" },
    { hex: "#FFC107", name: "Yellow" },
    { hex: "#9C27B0", name: "Purple" },
  ];

  const addCube = (color: string) => {
    const newCube = { id: cubeId.current++, color }; // Use and increment the unique counter

    // Add the new cube to the tower
    setCubes((prevCubes) => {
      const updatedCubes = [...prevCubes, newCube];

      // Iterate over all cubes in the tower and randomly decide if they fall into the trays
      const remainingCubes = updatedCubes.filter((cube) => {
        if (Math.random() < 0.25) {
          // 25% chance of leaving the tower
          sortCube(cube); // Sort the cube into one of the trays
          return false; // Remove the cube from the tower
        }
        return true; // Keep the cube in the tower
      });

      return remainingCubes;
    });
  };

  const sortCube = (cube: { id: number; color: string }) => {
    // Randomly decide whether the cube goes to slot1 or slot2
    if (Math.random() < 0.5) {
      setSlot1((prevSlot) => [...prevSlot, cube]);
    } else {
      setSlot2((prevSlot) => [...prevSlot, cube]);
    }
  };

  const getColorCounts = (slot: { id: number; color: string }[]) => {
    const counts: { [color: string]: number } = {};
    slot.forEach((cube) => {
      counts[cube.color] = (counts[cube.color] || 0) + 1;
    });
    return counts;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.colorPicker}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color.hex}
              style={[styles.colorButton, { backgroundColor: color.hex }]}
              onPress={() => addCube(color.hex)}
            >
              <Text style={styles.colorButtonText}>{color.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.tower}>
          {cubes.map((cube) => (
            <TouchableOpacity
              key={cube.id}
              style={styles.cubeContainer}
              onPress={() => {
                setCubes((prevCubes) =>
                  prevCubes.filter((c) => c.id !== cube.id)
                );
                sortCube(cube);
              }}
            >
              <View
                style={[
                  styles.cubeFace,
                  styles.cubeTop,
                  { backgroundColor: cube.color },
                ]}
              />
              <View
                style={[
                  styles.cubeFace,
                  styles.cubeFront,
                  { backgroundColor: cube.color },
                ]}
              >
                <Text style={styles.cubeText}>{cube.id}</Text>
              </View>
              <View
                style={[
                  styles.cubeFace,
                  styles.cubeSide,
                  { backgroundColor: darkenColor(cube.color, 0.2) },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.slots}>
        <View style={styles.slot}>
          <ScrollView>
            {Object.entries(getColorCounts(slot1)).map(([color, count]) => (
              <Text key={color} style={[styles.slotText, { color }]}>
                {`${
                  colors.find((c) => c.hex === color)?.name || color
                }: ${count}`}
              </Text>
            ))}
          </ScrollView>
        </View>
        <View style={styles.slot}>
          <ScrollView>
            {Object.entries(getColorCounts(slot2)).map(([color, count]) => (
              <Text key={color} style={[styles.slotText, { color }]}>
                {`${
                  colors.find((c) => c.hex === color)?.name || color
                }: ${count}`}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  colorPicker: {
    justifyContent: "space-between",
    marginRight: 20,
  },
  colorButton: {
    width: 80,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  colorButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  tower: {
    width: 120,
    height: 400,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cubeContainer: {
    width: 50, // Make the cube smaller
    height: 50, // Make the cube square
    marginBottom: 5, // Add spacing between cubes
    position: "relative",
  },
  cubeFace: {
    position: "absolute",
    borderRadius: 5,
  },
  cubeTop: {
    width: 50, // Match the new cube size
    height: 50, // Match the new cube size
    top: 0,
    left: 0,
    zIndex: 2,
  },
  cubeFront: {
    width: 50, // Match the new cube size
    height: 50, // Match the new cube size
    top: 0,
    left: 0,
    zIndex: 1,
  },
  cubeSide: {
    width: 50, // Match the new cube size
    height: 50, // Match the new cube size
    top: 0,
    left: 0,
    zIndex: 0,
  },
  cubeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dropButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  dropButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  slots: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  slot: {
    width: "45%",
    height: 150, // Increased height from 100 to 150
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
  },
  slotText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

// Utility function to darken a color
function darkenColor(color: string, amount: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
  const b = Math.max(0, (num & 0x0000ff) - amount * 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
