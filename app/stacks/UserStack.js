import { Text, View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
import {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Stack = createNativeStackNavigator()

function UserStack({navigation}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

const nav = useNavigation()

    useEffect(() => {
        AsyncStorage.getItem('isAuthenticated').then((flag) =>  {
            if (flag === 'true') {
                setIsAuthenticated(true)
                // nav.reset({index: 0,
                //     routes:[{name: 'MyProfile'}]
                // })
            }setIsLoading(false)
        })
    }, [])

    if (isLoading) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#008b8b" />
          </View>
        );
      }

    return (
        <Stack.Navigator initialRouteName={isAuthenticated ? 'Myprofile' : 'Login'}>
            
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="SignUp" component={SignupScreen}/>
            <Stack.Screen name="MyProfile" component={MyProfileScreen}/>
        </Stack.Navigator>
    );
}

export default UserStack;