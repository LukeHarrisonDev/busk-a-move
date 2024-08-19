import { Text, View, Button, ScrollView } from 'react-native';

function LoginScreen({navigation}) {
    return (
        <ScrollView>
            <Text>
                LoginScreen
            </Text>
            <Button title="Go" onPress={() => {
                navigation.navigate("MyProfile")
            }}/>
        </ScrollView>
    );
}

export default LoginScreen;