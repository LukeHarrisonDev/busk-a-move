import { useEffect, useState } from "react";
import { fetchSingleBusk, deleteBusk, updateBusk } from "../api";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
  Alert,
  Pressable,
  TextInput
} from "react-native";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-maps";
import { formatDate, formatTime } from "../assets/utils/date-and-time";
import colours from "../config/colours";
import * as Location from "expo-location";

function SingleBusk({ route }) {
  const { id } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);
  const [singleBusk, setSingleBusk] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [instruments, setInstruments] = useState([]);

  const [isTitleEditing, setIsTitleEditing] = useState(false)
  const [titleName, setTitleName] = useState("")
  const [optimisticTitleName, setOptimisticTitleName] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const handleTitleSubmit = () => { 
    setOptimisticTitleName(titleName)
    setIsTitleEditing(false)
    updateBusk(singleBusk.busk_id, titleName)
    .catch((err) => {
      setOptimisticTitleName(singleBusk.busk_location_name)
      setErrorMessage("Busk location name unsuccessful, please try again in a moment")
    })
  }      

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSingleBusk();
    setRefreshing(false);
  };

  const loadBusk = () => {
    setIsLoading(true);
    fetchSingleBusk(id)
      .then((response) => {
        if (!response || response === "") {
          setSingleBusk(null);
        } else {
          setSingleBusk(response);
          setInstruments(response.busk_selected_instruments.join(", "));
          setOptimisticTitleName(response.busk_location_name)
          setInitialRegion({
            latitude: response.busk_location.latitude,
            longitude: response.busk_location.longitude,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0221,
          });
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load busk:", error);
        setIsLoading(false);
        setSingleBusk(null);
      });
  };

  useEffect(() => {
    if (isFocused) {
      loadBusk();
    }
  }, [isFocused]);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    };
    getLocation();
  }, []);
  
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this busk?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteBusk(id)
              .then(() => {
                Alert.alert("Success", "Busk deleted successfully");
                navigation.navigate("BusksScreen", {
                  refresh: true,
                });
              })
              .catch((error) => {
                console.error("----> error from delete busk: ", error);
                Alert.alert("Error", "Failed to delete the busk");
              });
          },
          style: "destructive",
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="0000ff" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!singleBusk) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.bodyText}>Busk not found or has been deleted.</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView
        style={styles.container}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      >
        <View style={styles.card}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.titleContainer}>

            {isTitleEditing ? 
            <View>
              <TextInput
                style={styles.input}
                placeholder={singleBusk.busk_location_name}
                value={titleName}
                onChangeText={setTitleName}
                autoCorrect={false}
                autoCapitalize='none'
              /> 
              <Button
                title="Submit"
                onPress={handleTitleSubmit}/>
               
            </View>
            :   
            <Text style={styles.titleText}>
            {optimisticTitleName} {" "}

            <Pressable
            style={styles.pressable}
              onPress={() => {
                setIsTitleEditing(true)
              }}
              >
              <Image
                source={require('../assets/edit.png')}
                style={styles.editPencil} 
              />
            </Pressable>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Text>
            }
            </View>
            <Text style={styles.bodyText}>
              {formatTime(singleBusk.busk_time_date)} on{" "}
              {formatDate(singleBusk.busk_time_date)}
            </Text>
            <Text style={styles.bodyText}>{singleBusk.username}</Text>
            <View style={styles.userImageBorder}>
              <Image
                style={styles.userImage}
                source={{ uri: singleBusk.user_image_url }}
              />
            </View>
            <Text style={styles.bodyTextBold}>Setup: </Text>
            <Text style={styles.bodyText}>{singleBusk.busk_setup}</Text>

            <Text style={styles.bodyTextBold}>Instruments:</Text>
            <Text style={styles.bodyText}>
              {instruments}
            </Text>
            <Text style={styles.bodyTextBold}>About Me: </Text>
            <Text style={styles.bodyText}>{singleBusk.busk_about_me}</Text>
            <View style={styles.mapBorder}>
              {initialRegion && (
                <MapView
                  style={styles.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={initialRegion}
                  showsUserLocation
                >
                  <Marker
                    coordinate={{
                      latitude: singleBusk.busk_location.latitude,
                      longitude: singleBusk.busk_location.longitude,
                    }}
                    title={singleBusk.busk_location_name}
                  />
                </MapView>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Delete Busk"
                onPress={handleDelete}
                color={colours.errorText}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.primaryHighlight,
    paddingTop: StatusBar.currentHeight,
    paddingBottom: 10,

    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: colours.secondaryBackground,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "F5F5F5",
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    fontSize: 24,
    color: colours.primaryHighlight,
  },
  bodyTextBold: {
    fontWeight: "bold",
    fontSize: 24,
    color: colours.primaryHighlight,
  },
  mapBorder: {
    marginTop: 15,
    borderWidth: 5,
    borderRadius: 7,
    borderColor: colours.primaryHighlight,
  },
  map: {
    width: 300,
    height: 300,
  },
  userImageBorder: {
    borderWidth: 3,
    borderRadius: 6,
    borderColor: colours.primaryHighlight,
    marginTop: 5,
    marginBottom: 5,
  },
  userImage: {
    width: 120,
    height: 120,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  titleContainer: {
    width: "100%",

  },
  titleText: {
    color: colours.primaryHighlight,
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center"
  },

  editPencil: {
    // position: "absolute",
    flexDirection: "column",
    alignSelf: "flex-start",
    width: 30,
		height: 30,
  },
  input: {
		borderWidth: 1,
		borderColor: colours.darkHighlight,
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
		backgroundColor: colours.lightText,
		paddingRight: 50,
	},
  errorText: {
		color: colours.errorText,
		marginBottom: 15,
	},
});
export default SingleBusk;
