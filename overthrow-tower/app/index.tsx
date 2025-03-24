import Cube from "@/components/cube";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [cubes, setCubes] = useState<
    { id: number; color: string; x: number; y: number }[]
  >([]);
  const [slot1, setSlot1] = useState<{ id: number; color: string }[]>([]);
  const [slot2, setSlot2] = useState<{ id: number; color: string }[]>([]);
  const cubeId = useRef(1); // Unique counter for cube IDs
  const towerPosition = useRef({ x: 0, y: 0 }); // Tower's position on the screen

  const colors = [
    { hex: "#4CAF50", name: "Green" },
    { hex: "#FF5722", name: "Orange" },
    { hex: "#2196F3", name: "Blue" },
    { hex: "#FFC107", name: "Yellow" },
    { hex: "#9C27B0", name: "Purple" },
  ];

  const addCube = (color: string) => {
    const id = cubeId.current++;
    const newCube = { id, color };

    if (Math.random() < 0.25) {
      sortCube(newCube);
    } else {
      setCubes((prevCubes) => [
        ...prevCubes,
        { ...newCube, x: getRandomX(), y: getRandomY() },
      ]);
    }

    // Iterate over existing cubes in the tower and randomly decide if they fall into the trays
    setCubes((prevCubes) => {
      const remainingCubes = prevCubes.filter((cube) => {
        if (Math.random() < 0.25) {
          // 25% chance to fall into a tray
          sortCube(cube);
          return false; // Remove the cube from the tower
        }
        return true; // Keep the cube in the tower
      });
      return remainingCubes;
    });
  };

  const getRandomX = () => {
    const towerWidth = 120; // Width of the tower
    const cubeSize = 25; // Size of the cube
    return Math.random() * (towerWidth - cubeSize); // Random x position within the tower
  };

  const getRandomY = () => {
    const towerHeight = 400; // Height of the tower
    const cubeSize = 25; // Size of the cube
    return Math.random() * (towerHeight - cubeSize); // Random y position within the tower
  };

  const sortCube = (cube: { id: number; color: string }) => {
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
      <View
        style={styles.towerContainer}
        onLayout={(event) => {
          event.target.measure(( pageX, pageY) => {
            towerPosition.current = { x: pageX, y: pageY };
          });
        }}
      >
        <View style={styles.battlement}>
          {Array.from({ length: 5 }).map((_, index) => (
            <View key={index} style={styles.battlementBlock} />
          ))}
        </View>
        <View style={styles.tower}>
          {cubes.map((cube) => (
            <Cube key={cube.id} cube={cube} />
          ))}
        </View>
      </View>
      <View style={styles.slots}>
        <View style={styles.slot}>
          <Text style={styles.slotLabel}>To the Board</Text>
          <View>
            {Object.entries(getColorCounts(slot1)).map(([color, count]) => (
              <Text key={color} style={[styles.slotText, { color }]}>
                {`${
                  colors.find((c) => c.hex === color)?.name || color
                }: ${count}`}
              </Text>
            ))}
          </View>
        </View>
        <View style={styles.slot}>
          <Text style={styles.slotLabel}>To Cards</Text>
          <View>
            {Object.entries(getColorCounts(slot2)).map(([color, count]) => (
              <Text key={color} style={[styles.slotText, { color }]}>
                {`${
                  colors.find((c) => c.hex === color)?.name || color
                }: ${count}`}
              </Text>
            ))}
           </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // Space out the elements vertically
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  colorPicker: {
    flexDirection: "row",
    justifyContent: "center", // Center the buttons horizontally
    flexWrap: "wrap", // Allow buttons to wrap into multiple rows
    marginBottom: 20,
    marginTop: 30, // Push the buttons down to avoid the notch
    paddingHorizontal: 10, // Add padding to prevent buttons from touching the edges
  },
  colorButton: {
    width: 70, // Reduced width
    height: 35, // Reduced height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    marginHorizontal: 5, // Add horizontal margin between buttons
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
  towerContainer: {
    alignItems: "center",
  },
  battlement: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 140, // Slightly wider than the tower
    height: 20, // Height of the battlement
    backgroundColor: "#ccc",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  battlementBlock: {
    width: 20, // Width of each block
    height: 20, // Height of each block
    backgroundColor: "#000",
    marginHorizontal: 2,
  },
  tower: {
    width: 120,
    height: 400,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#ccc", // Castle-like color
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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
    height: 175, // Increased height from 150 to 200
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
    backgroundColor: "#e0e0e0",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 5,
  },
  slotLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  slotText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});
