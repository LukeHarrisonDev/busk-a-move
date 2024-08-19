import { Text, View, StyleSheet, ScrollView } from 'react-native';

function HomeScreen() {
    return (
        <ScrollView>
            <Text style={styles.text}>
                HomeScreen
            </Text>
        </ScrollView>
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
