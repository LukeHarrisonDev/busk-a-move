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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { fetchSingleUser } from "../api";

import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import { text } from "@fortawesome/fontawesome-svg-core";
// import * as ImagePicker from 'expo-image-picker'

import colours from "../config/colours";
import AsyncStorage from "@react-native-async-storage/async-storage";

function MyProfileScreen(props) {
  const route = useRoute();
  const { userId } = route.params;

  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading && <ActivityIndicator size="large" color='"#008b8b' />}
        <View style={styles.container}>
          <Text style={styles.headerText}></Text>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.profileInfo}>
            <Image style={styles.avatar} source={{ uri: avatar }} />
            <View style={styles.infoContainer}>
              <View style={styles.avatarButtons}>
                <Pressable style={styles.smallButton} onPress={handleViewPress}>
                  <Text style={styles.buttonText}>View</Text>
                </Pressable>
                {/* <TouchableOpacity style={styles.smallButton} onPress={handleImagePicker}>
                    <Text style={styles.smallButtonText}>Change</Text>
                   </TouchableOpacity> */}
              </View>
              <Text style={styles.location}> Location: {location}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About Me: </Text>
              <Pressable style={styles.smallButton} onPress={handleEditPress}>
                <Text style={styles.editButtonText}>
                  {" "}
                  {isEditing ? "Save" : "Edit"}{" "}
                </Text>
              </Pressable>
            </View>
            <TextInput
              style={[styles.Textinput, { height: 170 }]}
              value={aboutMe}
              multiline={true}
              textAlignVertical="top"
              editable={isEditing}
              onChangeText={(text) => setAboutMe(text)}
            />
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Setup:</Text>
              <Pressable
                style={styles.smallButton}
                onPress={handleSetupEditPress}
              >
                <Text style={styles.editButtonText}>
                  {isSetupEditing ? "save" : "Edit"}
                </Text>
              </Pressable>
            </View>
            <TextInput
              style={[styles.textInput]}
              value={mySetup}
              editable={isSetupEditing}
              onChangeText={(text) => setMySetup(text)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Logout"
              onPress={handleLogout}
              color={colours.primaryHighlight}
            />
            <Button title="Delete Account" color="red" onPress={() => {}} />
          </View>
        </View>
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
    marginBottom: 20,
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
  textInput: {
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: "#333",
    width: "100%",
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
});

export default MyProfileScreen;
