import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Pressable,
  ActivityIndicator,
  Button,
  Modal,
  SafeAreaView,
  TextInput,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchSingleUser } from "../api";

import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import { text } from "@fortawesome/fontawesome-svg-core";
// import * as ImagePicker from 'expo-image-picker'

import colours from "../config/colours";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MyProfileScreen({ navigation }) {
  const route = useRoute();
  const { userId } = route.params;

  // const navigation = useNavigation();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [mySetup, setMySetup] = useState("setup/instrument details here...");
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSetupEditing, setIsSetupEditing] = useState(false);
  const [modalVisible, setModalVisile] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState("");
  const [singleBusker, setSingleBusker] = useState([]);
  const [instruments, setInstruments] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileData(userId);
  }, [userId]);

  const fetchProfileData = (userId) => {
    setLoading(true);
    fetchSingleUser(userId)
      .then((data) => {
        console.log(data, "<<<<log from fetch single user");
        setName(data.full_name);
        setAboutMe(data.user_about_me);
        setLocation(data.user_location);
        setAvatar(data.user_image_url);
        setInstruments(data.instruments);
        setSingleBusker(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEditPress = () => {
    if (isEditing) {
      console.log("making changes...");
    }
    setIsEditing(!isEditing);
  };

  const handleSetupEditPress = () => {
    setIsSetupEditing(!isSetupEditing);
  };

  const handleViewPress = () => {
    setEnlargedImage(avatar);
    setModalVisile(true);
  };

  const handleLogout = () => {
    AsyncStorage.removeItem("isAuthenticated").then(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    });
  };

  // const handleImagePicker = () => {
  //     ImagePicker.launchImageLibraryAsync({
  //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //         allowsEditing: true,
  //         aspect: [4,3],
  //         quality: 1,
  //     }).then((result) => {
  //         if(!result.canceled) {
  //             setAvatar(result.uri)
  //         }
  //     })
  // }
  console.log(singleBusker);
  const buksersInstruments = instruments.join(", ");

  const backgroundOptions = [
    colours.firstBackground,
    colours.secondBackground,
    colours.thirdBackground,
    colours.fourthBackground,
  ];
  const backgroundColor =
    backgroundOptions[Math.floor(Math.random() * 4) % backgroundOptions.length];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading && <ActivityIndicator size="large" color='"#008b8b' />}
        {/* //Here */}
        <View style={styles.buskerCard}>
          <View style={[styles.buskerImgContainer, { backgroundColor }]}>
            <View style={styles.buskerImgWrapper}>
              <Image
                style={styles.buskerImg}
                source={{ uri: singleBusker.user_image_url }}
              />
            </View>
          </View>
          <Text style={styles.buskerUsername}>{singleBusker.username}</Text>
          <View style={styles.buskerLocationContainer}>
            <Image
              source={require("../assets/location.png")}
              style={styles.buskerCardIcon}
            />
            <Text style={styles.buskerLocation}>
              {singleBusker.user_location}
            </Text>
          </View>
          <View style={styles.buskerInstrumentsContainer}>
            <Image
              source={require("../assets/instruments.png")}
              style={styles.buskerCardIcon}
            />
            <Text style={styles.bodyText}>{buksersInstruments}</Text>
          </View>
          {/* <View style={styles.buskerAboutMeContainer}> */}
          <View style={styles.sectionMe}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>About Me: </Text>
              </View>
              <TextInput
                style={[styles.textInput]}
                value={aboutMe}
                multiline={true}
                textAlignVertical="top"
                editable={isEditing}
                onChangeText={(text) => setAboutMe(text)}
              />
            </View>
            <Pressable style={styles.smallButton} onPress={handleEditPress}>
              <Text style={styles.editButtonText}>
                {" "}
                {isEditing ? "Save" : "Edit"}{" "}
              </Text>
            </Pressable>

            {/* <Text style={styles.bodyText}>{singleBusker.user_about_me}</Text> */}

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitleSetup}>My Setup:</Text>
              </View>
              <TextInput
                style={[styles.textInput]}
                value={mySetup}
                editable={isSetupEditing}
                onChangeText={(text) => setMySetup(text)}
              />
            </View>
            <Pressable
              style={styles.smallButton}
              onPress={handleSetupEditPress}
            >
              <Text style={styles.editButtonText}>
                {isSetupEditing ? "save" : "Edit"}
              </Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={styles.buskButton}
          title="Create Busk"
          onPress={() => {
            navigation.navigate("CreateABusk", { data: singleBusker });
          }}
        >
          <Text style={styles.buskButtonText}>Create New Busk</Text>
        </Pressable>

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.buttonWrapperLogout]}
            onPress={handleLogout}
          >
            <Text style={styles.logOutText}>Logout</Text>
          </Pressable>
          <Pressable style={styles.buttonWrapperDelete} onPress={() => {}}>
            <Text style={[styles.buttonText]}>Delete Account</Text>
          </Pressable>
        </View>

        {/* here */}
        {/* <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapperLogout}>
            <Button title="Logout" onPress={handleLogout} />
          </View>
          <View style={styles.buttonWrapperDelete}>
            <Button title="Delete Account" color="red" onPress={() => {}} />
          </View>
        </View> */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisile(false)}
        >
          <View style={styles.modalView}>
            <Image
              style={styles.enlargedImage}
              source={{ uri: enlargedImage }}
            />
            <Button title="close" onPress={() => setModalVisile(false)} />
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buskerImgContainer: {
    width: "100%",
    height: 150,
    marginBottom: 80,
  },
  buskerImgWrapper: {
    width: "100%",
    height: 160,
    position: "absolute",
  },
  buskerImg: {
    margin: "auto",
    width: 130,
    height: 130,
    borderRadius: 55,
    borderWidth: 5,
    borderColor: colours.primaryBackground,
    position: "relative",
    top: 60,
  },
  buskerLocationContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  buskerInstrumentsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 30,
  },
  buskerAboutMeContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 20,
  },
  buskerCardIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  buskerCard: {
    flex: 1,
    marginTop: 20,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  buskerUsername: {
    fontSize: 24,
    fontWeight: "bold",
    color: colours.darkText,
  },
  buskerLocation: {
    fontSize: 24,
  },
  buskersListWrapper: {
    flex: 1,
    backgroundColor: colours.primaryBackground,
    paddingTop: StatusBar.currentHeight,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    minHeight: "100%",
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#008b8b",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    color: "#008b8b",
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

  avatarButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    size: 5,
  },
  smallButton: {
    backgroundColor: "#fff",
    borderColor: colours.primaryHighlight,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: 70,
    alignItems: "center",
  },
  smallButtonText: {
    color: colours.primaryHighlight,
    fontSize: 14,
  },
  buttonText: {
    color: colours.primaryHighlight,
  },
  location: {
    marginTop: 30,
    fontSize: 16,
    color: "#555",
  },
  section: {
    marginBottom: 10,
    maxWidth: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButtonText: {
    color: colours.rust,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  sectionTitleSetup: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
  },
  textInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
    maxWidth: "100%",
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
    borderRadius: 5,
    modalView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    enlargedImage: {
      width: "90%",
      height: "70%",
      resizeMode: "contain",
    },
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
    fontWeight: "bold",
  },
  buttonWrapperLogout: {
    width: 150,
    backgroundColor: colours.reversePrimaryHiglight,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colours.primaryHighlight,
  },
  logOutText: {
    color: colours.reverseLightText,
    fontWeight: "bold",
  },
  buttonWrapperDelete: {
    backgroundColor: colours.errorText,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 180,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  containerAboutMe: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionMe: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "left",
    paddingVertical: 10,
    paddingHorizontal: 10,
    maxWidth: "100%",
  },
});

export default MyProfileScreen;
