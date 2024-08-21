import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';

const Stack = createNativeStackNavigator()

function ChatsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
        </Stack.Navigator>
    );
}

export default ChatsStack;