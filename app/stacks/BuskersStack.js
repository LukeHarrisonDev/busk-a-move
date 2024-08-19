import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AllBuskersScreen from '../screens/AllBuskersScreen';
import BuskerProfileScreen from '../screens/BuskerProfileScreen';

const Stack = createNativeStackNavigator()

function BuskersStack({navigation}) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AllBuskers" component={AllBuskersScreen}/>
            <Stack.Screen name="BuskerProfile" component={BuskerProfileScreen}/>
        </Stack.Navigator>
    );
}

export default BuskersStack;