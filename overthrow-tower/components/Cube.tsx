import {View, StyleSheet} from 'react-native';

const Cube = ({ cube }) => {

    return (
    <View key={cube.id}
        style={[
        styles.cube,
        { left: cube.x, top: cube.y },
        { backgroundColor: cube.color },
        ]}
    />
    )
}

const styles = StyleSheet.create({
    cube: {
        width: 25,
        height: 25,
        position: "absolute",
        borderRadius: 5,
        top: 0,
        left: 0,
      },
})
export default Cube;
