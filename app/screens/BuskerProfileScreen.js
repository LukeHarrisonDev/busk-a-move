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
  ScrollView,
  Pressable
} from "react-native";
import colours from "../config/colours";

function BuskerProfileScreen({ route, navigation }) {
  const { id } = route.params;
  const [singleBusker, setSingleBusker] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSingleBusker(id).then((response) => {
      setSingleBusker(response);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const buksersInstruments = singleBusker.instruments.join(", ")

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Pressable
            style={styles.buskButton}
            title="Create Busk"
            onPress={() => {
              navigation.navigate("CreateABusk", { data: singleBusker });
            }}
          >
            <Text style={styles.buskButtonText}>Create New Busk</Text>
          </Pressable>
        <View style={styles.container}>
          <Text style={styles.headerText}></Text>
          <Text style={styles.name}>{singleBusker.full_name}</Text>
          <View style={styles.profileInfo}>
            <Image
              style={styles.avatar}
              source={{ uri: singleBusker.user_image_url }}
            />
            <View style={styles.infoContainer}>
              <Text style={styles.location}>
                Location: {singleBusker.user_location}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me: </Text>
            <Text style={styles.bodyText}>{singleBusker.user_about_me}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Setup:</Text>
            <Text style={styles.bodyText}>{buksersInstruments}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    color: colours.primaryHighlight,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 1,
    borderColor: colours.primaryHighlight,
  },
  infoContainer: {
    flex: 1,
  },
  location: {
    marginTop: 30,
    fontSize: 16,
    color: "#555",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 16,
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  buskButton: {
    backgroundColor: colours.primaryHighlight,
    color: colours.lightText,
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 36,
  },
  buskButtonText: {
    color: colours.lightText,
  }
});

export default BuskerProfileScreen;
