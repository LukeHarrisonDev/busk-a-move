import { Text, View, StyleSheet, ScrollView, Image, Button } from 'react-native';

import colours from '../config/colours';

function HomeScreen({navigation}) {
    return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>
                    Busk-A-Move
                </Text>
                <View style={styles.pictures}>
                    <Image style={styles.image} source={{uri: "https://images.unsplash.com/photo-1532959801411-cf28447984f9?q=80&w=1890&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}/>
                    <Image style={styles.image} source={{uri: "https://images.unsplash.com/photo-1483069125343-4ef290c07840?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}/>
            </View>           
            <Button title="Sign up" onPress={() => {
                navigation.navigate("SignUp")
            }}/>
            </ScrollView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.light,
    },
    header: {
        fontSize: 50,
        alignSelf: "center",
        marginTop: 50,
    },
    text: {
        fontSize: 40,
        alignSelf: "center",
        // justifySelf: "center"
    },
    pictures: {
        flexDirection: "row",
        alignSelf: "center",
        margin: 30
    },
    image: {
        margin: 20,
        width: 140,
        height: 110
    }
});
