import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import BusksScreen from '../screens/BusksScreen';
import colours from '../config/colours';

const Stack = createNativeStackNavigator()

function ChatsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false, title: "Home"}} />
            <Stack.Screen 
                name="SignUp" 
                component={SignupScreen} 
                options={{
                    title: "Sign Up", 
                    headerTitleStyle: {
                        fontWeight: "bold"
                    }, 
                    headerStyle: {
                        backgroundColor: colours.secondaryBackground
                    }
                }}/>
            <Stack.Screen name="Busks" component={BusksScreen} />
        </Stack.Navigator>
    );
}

export default ChatsStack;