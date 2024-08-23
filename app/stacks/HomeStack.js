import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import BusksScreen from '../screens/BusksScreen';

const Stack = createNativeStackNavigator()

function ChatsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="SignUp" component={SignupScreen} />
            <Stack.Screen name="Busks" component={BusksScreen} />
        </Stack.Navigator>
    );
}

export default ChatsStack;