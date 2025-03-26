import {View, Text, StyleSheet} from 'react-native';

const Slot = ({ slotCounts, colors, name}) => {
  return (
        <View style={styles.slot}>
          <Text style={styles.slotLabel}>{name}</Text>
          <View>
            {Object.entries(slotCounts).map(([color, count]) => (
              <Text key={color} style={[styles.slotText, { color }]}>
                {`${
                  colors.find((c) => c.hex === color)?.name || color
                }: ${count}`}
              </Text>
            ))}
          </View>
        </View>
  )
}
const styles = StyleSheet.create({
  slot: {
    width: "45%",
    height: 175,
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
})

export default Slot;