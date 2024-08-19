import { Text, View, Button } from 'react-native';

function LoginScreen({navigation}) {
    return (
        <View>
            <Text>
                LoginScreen
            </Text>
            <Button title="Login" onPress={() => {
                navigation.navigate("MyProfile")
            }}/>
        </View>
    );
}

export default LoginScreen;