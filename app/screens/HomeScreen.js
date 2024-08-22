import { Text, View, StyleSheet, ScrollView, Image, Button, SafeAreaView } from 'react-native';

import colours from '../config/colours';

function HomeScreen({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView >
                <Text style={styles.header}>
                    Busk-A-Move
                </Text>
                <View style={styles.pictures}>
                    <Image style={styles.image} source={{uri: "https://images.unsplash.com/photo-1532959801411-cf28447984f9?q=80&w=1890&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}/>
                    <Image style={styles.image} source={{uri: "https://images.unsplash.com/photo-1483069125343-4ef290c07840?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}}/>
                </View>           
                <Text style={styles.blurb}>Welcome, it seems you've stumbled upon the Busk-A-Move app, a collaboration app for busking musicians at any level. Whether you've never busked before and want to get started, or you're a veteran Busker wanting to spread your music upon fellow musicians and passers-by, this app can help organise your busks and collaborate with local Buskers, get started by making an account, then you can peruse Busks created by other Buskers, check the Buskers out, or start your Busking journey by creating your own Busks. Happy Busking!!!</Text>
            <Button title="Sign up" onPress={() => {
                navigation.navigate("SignUp")
            }}/>
            </ScrollView>
        </SafeAreaView>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colours.secondaryBackground,
    },
    header: {
        fontSize: "55%",
        fontFamily: "ChelseaMarketRegular",
        alignSelf: "center",
        color: colours.primaryHighlight,
    },
    text: {
        fontSize: 40,
        alignSelf: "center",
    },
    pictures: {
        flexDirection: "row",
        alignSelf: "center",
        margin: 30
    },
    image: {
        marginHorizontal: 20,
        width: 140,
        height: 110
    },
    blurb: {
        textAlign: "justify",
        color: colours.primaryHighlight,
        marginHorizontal: 50,
        fontSize: 20
    }
});
