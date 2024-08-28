import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BusksScreen from "../screens/BusksScreen";
import SingleBusk from "../screens/SingleBusk";
import ErrorBoundary from "../components/Errorboundary";
import colours from "../config/colours";

const Stack = createNativeStackNavigator();

function BusksStack({ navigation }) {
  return (
    <ErrorBoundary>
      <Stack.Navigator>
        <Stack.Screen name="BusksScreen" component={BusksScreen} 
          options={{
            title: "Checkout the Busks", 
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 23
            }, 
            headerStyle: {
              backgroundColor: colours.secondaryBackground
            }
          }}/>
        <Stack.Screen name="SingleBusk" component={SingleBusk}
          options={{
            headerShown: false, 
            title: "SingleBusk"}}/>
      </Stack.Navigator>
    </ErrorBoundary>
  );
}

export default BusksStack;
