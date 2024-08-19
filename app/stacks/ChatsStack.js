import { Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatsListScreen from '../screens/ChatsListScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator()

function ChatsStack({navigation}) {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ChatList" component={ChatsListScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>

    );
}

export default ChatsStack;