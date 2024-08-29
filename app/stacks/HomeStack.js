import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import BusksScreen from '../screens/BusksScreen';
import colours from '../config/colours';
import LoginScreen from '../screens/LoginScreen';
import HomeScreenLogged from '../screens/HomeScreenLogged';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function HomeStack() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        AsyncStorage.setItem('isAuthenticated', 'false')
        AsyncStorage.getItem('isAuthenticated')
            .then((flag) => {
                if (flag === 'true') {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch((error) => {
                console.error('Failed to fetch authentication status:', error);
            })
            .finally(() => {
                setIsLoading(false); 
            });

        
        const unsubscribe = navigation.addListener('focus', () => {
            AsyncStorage.getItem('isAuthenticated')
                .then((flag) => {
                    if (flag === 'true') {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                })
                .catch((error) => {
                    console.error('Failed to recheck authentication status:', error);
                });
        });

        
        return unsubscribe;
    }, [navigation]);

   
    return (
        <Stack.Navigator>
            {isAuthenticated ? (
                <>
                    <Stack.Screen
                        name="HomeScreenLogged"
                        component={HomeScreenLogged}
                        options={{ headerShown: false, title: 'Home' }}
                    />
                    <Stack.Screen name="Busks" component={BusksScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="HomeScreen"
                        component={HomeScreen}
                        options={{ headerShown: false, title: 'Home' }}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={SignupScreen}
                        options={{
                            title: 'Sign Up',
                            headerTitleStyle: { fontWeight: 'bold', fontSize: 23 },
                            headerStyle: { backgroundColor: colours.secondaryBackground },
                        }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            title: 'Login',
                            headerTitleStyle: { fontWeight: 'bold', fontSize: 23 },
                            headerStyle: { backgroundColor: colours.secondaryBackground },
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
}

export default HomeStack;
