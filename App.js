import './gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { faGuitar } from '@fortawesome/free-solid-svg-icons/faMugSaucer'

import UserStack from './app/stacks/UserStack';
import HomeScreen from './app/screens/HomeScreen';
import BusksStack from './app/stacks/BusksStack';
import BuskersStack from './app/stacks/BuskersStack';
import ChatsStack from './app/stacks/ChatsStack';

const Tab = createBottomTabNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                {/* //dynamic? */}
                <Tab.Screen name="User" component={UserStack} 
                // options={{tabBarIcon: () => <FontAwesomeIcon icon={faGuitar} />}}
                />
                <Tab.Screen name="Busks" component={BusksStack} />
                <Tab.Screen name="Buskers" component={BuskersStack} />
                <Tab.Screen name="Chats" component={ChatsStack} />
            </Tab.Navigator>
      </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
