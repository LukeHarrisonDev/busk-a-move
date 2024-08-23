import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

function BuskSearchComponent() {
    return (
        <View style={styles.filterContainer}>
            <Text >
                BuskSearchComponent
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: "#f5f5f5",
		paddingTop: StatusBar.currentHeight,
	},
    filterContainer: {
        color: "red"
    }
});

export default BuskSearchComponent;