import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import BusksScreen from '../screens/BusksScreen';
import colours from '../config/colours';
import LoginScreen from '../screens/LoginScreen';
import HomeScreenLogged from '../screens/HomeScreenLogged';

const Stack = createNativeStackNavigator();

function HomeStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='HomeScreenLogged'
				component={HomeScreenLogged}
				options={{ headerShown: false, title: 'Home' }}
			/>
			<Stack.Screen
				name='SignUp'
				component={SignupScreen}
				options={{
					title: 'Sign Up',
					headerTitleStyle: {
						fontWeight: 'bold',
						fontSize: 23,
					},
					headerStyle: {
						backgroundColor: colours.secondaryBackground,
					},
				}}
			/>
			<Stack.Screen
				name='Login'
				component={LoginScreen}
				options={{
					title: 'Login',
					headerTitleStyle: {
						fontWeight: 'bold',
						fontSize: 23,
					},
					headerStyle: {
						backgroundColor: colours.secondaryBackground,
					},
				}}
			/>
			<Stack.Screen name='Busks' component={BusksScreen} />
		</Stack.Navigator>
	);
}

export default HomeStack;
