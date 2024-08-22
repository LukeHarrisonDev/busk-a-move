import './gesture-handler';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faGuitar, faUser, faHouse, faComment, faUsers } from '@fortawesome/free-solid-svg-icons'

import colours from './app/config/colours';
import UserStack from './app/stacks/UserStack';
import HomeStack from './app/stacks/HomeStack';
import BusksStack from './app/stacks/BusksStack';
import BuskersStack from './app/stacks/BuskersStack';
import ChatsStack from './app/stacks/ChatsStack';

const Tab = createBottomTabNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colours.primaryHighlight,
                tabBarInactiveTintColor: colours.darkHighlight,
            }}>
                <Tab.Screen name="Home" component={HomeStack} 
                    options={{tabBarIcon: ({color}) => <FontAwesomeIcon icon={faHouse} size={23} color={color} />, headerShown: false}}
                />
                {/* //dynamic? */}
                <Tab.Screen name="User" component={UserStack} 
                    options={{tabBarIcon: ({color}) => <FontAwesomeIcon icon={faUser} size={23} color={color} />}}
                />
                <Tab.Screen name="Busks" component={BusksStack} 
                    options={{tabBarIcon: ({color}) => <FontAwesomeIcon icon={faGuitar} size={23} color={color} />}}
                />
                <Tab.Screen name="Buskers" component={BuskersStack} 
                    options={{tabBarIcon: ({color}) => <FontAwesomeIcon icon={faUsers} size={23} color={color}/>}}
                />
                <Tab.Screen name="Chats" component={ChatsStack} 
                    options={{tabBarIcon: ({color}) => <FontAwesomeIcon icon={faComment} size={23} color={color} />,
                    tabBarBadge: 1
                }}
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
