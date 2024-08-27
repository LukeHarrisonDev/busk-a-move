import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BusksScreen from '../screens/BusksScreen';
import CreateABuskScreen from '../screens/CreateABuskScreen';
import SingleBusk from '../screens/SingleBusk';
import ErrorBoundary from '../components/Errorboundary';

const Stack = createNativeStackNavigator()

function BusksStack({navigation}) {
    return (
        <ErrorBoundary>
        <Stack.Navigator>
            <Stack.Screen name="BusksScreen" component={BusksScreen}/>
            <Stack.Screen name="CreateABusk" component={CreateABuskScreen}/>
            <Stack.Screen name="SingleBusk" component={SingleBusk}/>
        </Stack.Navigator>
        </ErrorBoundary>
    );
}

export default BusksStack;
