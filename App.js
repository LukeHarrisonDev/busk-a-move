import './gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGuitar, faUser, faHouse, faComment, faUsers } from '@fortawesome/free-solid-svg-icons'

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
                <Tab.Screen name="Home" component={HomeScreen} 
                    options={{tabBarIcon: () => <FontAwesomeIcon icon={faHouse} size={23} />}}
                />
                {/* //dynamic? */}
                <Tab.Screen name="User" component={UserStack} 
                    options={{tabBarIcon: () => <FontAwesomeIcon icon={faUser} size={23} />}}
                />
                <Tab.Screen name="Busks" component={BusksStack} 
                    options={{tabBarIcon: () => <FontAwesomeIcon icon={faGuitar} size={23} />}}
                />
                <Tab.Screen name="Buskers" component={BuskersStack} 
                    options={{tabBarIcon: () => <FontAwesomeIcon icon={faUsers} size={23} />}}
                />
                <Tab.Screen name="Chats" component={ChatsStack} 
                    options={{tabBarIcon: () => <FontAwesomeIcon icon={faComment} size={23} />}}
                />
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
