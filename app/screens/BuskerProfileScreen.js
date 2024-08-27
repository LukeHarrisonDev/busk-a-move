import { useEffect, useState } from "react";
import { fetchSingleBusker } from "../api";
import {
  Text,
  Image,
  View,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from "react-native";
import colours from "../config/colours";

function BuskerProfileScreen({ route }) {
  const { id } = route.params;
  const [singleBusker, setSingleBusker] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSingleBusker();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchSingleBusker(id).then((response) => {
      setSingleBusker(response);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    >
      <View style={styles.listContainer}>
        <Pressable
          style={styles.button}
          title="Create Busk"
          onPress={() => {
            navigation.navigate("CreateABusk", { data: singleBusker });
          }}
        >
          <Text>Create New Busk</Text>
        </Pressable>
        <View style={styles.card}>
          <Text style={styles.titleText}>{singleBusker.username}</Text>
          <Text style={styles.titleText}>{singleBusker.full_name}</Text>
          <Text style={styles.bodyText}>{singleBusker.user_location}</Text>
          <Image
            style={styles.userImage}
            source={{ uri: singleBusker.user_image_url }}
          />
          <Text style={styles.titleText}>
            About Me: {singleBusker.user_about_me}
          </Text>
          <Text style={styles.titleText}>
            Instruments: {singleBusker.instruments}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: StatusBar.currentHeight,
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "F5F5F5",
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
  },
  bodyText: {
    fontSize: 24,
    color: "#666666",
  },
  userImage: {
    width: 100,
    height: 100,
  },
  button: {
    backgroundColor: colours.primaryHighlight,
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
});

export default BuskerProfileScreen;
