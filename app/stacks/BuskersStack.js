import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllBuskersScreen from '../screens/AllBuskersScreen';
import BuskerProfileScreen from '../screens/BuskerProfileScreen';
import ErrorBoundary from "../components/Errorboundary"

const Stack = createNativeStackNavigator()

function BuskersStack({navigation}) {
    return (
        <ErrorBoundary>
        <Stack.Navigator>
            <Stack.Screen name="AllBuskers" component={AllBuskersScreen}/>
            <Stack.Screen name="BuskerProfile" component={BuskerProfileScreen}/>
        </Stack.Navigator>
        </ErrorBoundary>
    );
}

export default BuskersStack;