import { Text, View, StyleSheet } from 'react-native';

function HomeScreen(props) {
    return (
        <View>
            <Text style={styles.text}>
                HomeScreen
            </Text>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 40,
        alignSelf: "center",
        // justifySelf: "center"
    }
});
