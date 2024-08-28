import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AllBuskersScreen from "../screens/AllBuskersScreen";
import BuskerProfileScreen from "../screens/BuskerProfileScreen";
import CreateABuskScreen from "../screens/CreateABuskScreen";
import ErrorBoundary from "../components/Errorboundary";
import colours from "../config/colours";

const Stack = createNativeStackNavigator();

function BuskersStack({ navigation }) {
  return (
    <ErrorBoundary>
      <Stack.Navigator>
        <Stack.Screen name="AllBuskers" component={AllBuskersScreen}
          options={{
            title: "Buskers", 
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 23
            }, 
            headerStyle: {
              backgroundColor: colours.secondaryBackground
            }
          }}/>
        <Stack.Screen name="BuskerProfile" component={BuskerProfileScreen}
          options={{headerShown: false, title: "Home"}}/>
        <Stack.Screen
          name="CreateABusk"
          component={CreateABuskScreen}
          options={{
            title: "Create New Busk",
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 23
            },
            headerStyle: {
              backgroundColor: colours.secondaryBackground,
            },
          }}
        />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}

export default BuskersStack;
