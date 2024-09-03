import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  Linking,
  Platform,
  Button,
  Image,
} from "react-native";
import { fetchSingleBusker, addBusk } from "../api";
import colours from "../config/colours";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MapView, { Marker } from "react-native-maps";
import * as Calendar from "expo-calendar";

export default function CreateABuskScreen({ route, navigation }) {
  const data = route.params;

  const [form, setForm] = useState({
    busk_location_name: "",
    busk_date: new Date(),
    busk_time: new Date(),
    busk_latitude: "",
    busk_longitude: "",
    busk_about_me: "",
    busk_setup: "",
    busk_selected_instruments: {},
  });

  const [availableInstruments, setAvailableInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [region, setRegion] = useState({
    latitude: 51.5074,
    longitude: -0.1278,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [submittedBuskLocationName, setSubmittedBuskLocationName] =
    useState("");
  const [submittedBuskTimeDate, setSubmittedBuskTimeDate] = useState("");

  const [permissionStatus, setPermissionStatus] = useState(null);

  useEffect(() => {
    fetchSingleBusker(data.data.user_id)
      .then((user) => {
        const instruments = user.instruments || [];
        setAvailableInstruments(instruments);
        setForm((prevForm) => ({
          ...prevForm,
          busk_selected_instruments: instruments.reduce((acc, instrument) => {
            acc[instrument] = false;
            return acc;
          }, {}),
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
        setLoading(false);
      });
  }, [data.data.user_id]);

  const requestCalendarPermission = async () => {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();
      console.log("---> status: ", status);
      if (status !== "granted") {
        const { status: newStatus } =
          await Calendar.requestCalendarPermissionsAsync();
        if (newStatus !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please grant calendar permissions in your device settings.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Open Settings", onPress: openAppSettings },
            ]
          );
        } else {
          console.log("Calendar permission granted");
        }
      } else {
        console.log("Calendar permission already granted");
      }
    } catch (error) {
      console.error("Error checking/requesting permission", error);
    }
  };

  const openAppSettings = () => {
    if (Platform.OS === "android") {
      Linking.openSettings();
    } else if (Platform.OS === "ios") {
      Linking.openURL("app-settings:");
    }
  };

  const createCalendarEvent = async (title, dateTime) => {
    try {
      const { status } = await Calendar.getCalendarPermissionsAsync();

      if (status !== "granted") {
        const permissionResponse =
          await Calendar.requestCalendarPermissionsAsync();
        if (permissionResponse.status !== "granted") {
          throw new Error("Calendar permissions denied.");
        }
      }

      const calendars = await Calendar.getCalendarsAsync();
      const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

      if (!defaultCalendar) {
        throw new Error("No modifiable calendar found.");
      }

      const eventDetails = {
        title,
        startDate: new Date(dateTime),
        endDate: new Date(new Date(dateTime).getTime() + 2 * 60 * 60 * 1000),
        timeZone: "GMT",
        location: `${form.busk_location_name}, ${form.busk_latitude}, ${form.busk_longitude}`,
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      throw new Error("Failed to create calendar event");
    }
  };

  const handleSubmit = async () => {
    const {
      busk_date,
      busk_time,
      busk_location_name,
      busk_latitude,
      busk_longitude,
    } = form;

    if (
      busk_location_name &&
      busk_date &&
      busk_time &&
      busk_latitude &&
      busk_longitude
    ) {
      setSubmitting(true);

      const formattedDateTime = convertToISO(busk_date, busk_time);

      if (!formattedDateTime) {
        setSubmitting(false);
        Alert.alert("Error", "Invalid date or time format.");
        return;
      }

      const buskData = {
        busk_location: {
          latitude: parseFloat(busk_latitude),
          longitude: parseFloat(busk_longitude),
        },
        busk_location_name: busk_location_name,
        busk_time_date: formattedDateTime,
        busk_about_me: form.busk_about_me,
        busk_setup: form.busk_setup,
        busk_selected_instruments: Object.keys(
          form.busk_selected_instruments
        ).filter((key) => form.busk_selected_instruments[key]),
        username: data.data.username,
        user_image_url: data.data.user_image_url,
      };

      try {
        await addBusk(buskData);

        setSubmittedBuskLocationName(busk_location_name);
        setSubmittedBuskTimeDate(formattedDateTime);

        setIsModalVisible(true);
      } catch (error) {
        console.error("Error creating busk event:", error);
        Alert.alert(
          "Error",
          "Failed to create busk event. " + (error.response?.data?.msg || "")
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      Alert.alert("Error", "Please fill in all the required fields.");
    }
  };

  const handleNavigation = () => {
    setIsModalVisible(false);

    Alert.alert(
      "Success",
      "Busk event created successfully! Would you like to add this event to your calendar?",
      [
        {
          text: "No",
          style: "cancel",
          onPress: () => {
            resetForm();
            navigation.navigate("Busks");
          },
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await createCalendarEvent(
                submittedBuskLocationName,
                submittedBuskTimeDate
              );
              Alert.alert("Success", "Event added to your calendar!");
              navigation.navigate("Busks");
            } catch (error) {
              console.error("Error creating calendar event:", error);
              Alert.alert("Error", "Failed to add event to your calendar.");
            } finally {
              resetForm();
              navigation.navigate("Busks");
            }
          },
        },
      ]
    );
  };

  const convertToISO = (date, time) => {
    try {
      const combinedDateTime = new Date(date);
      combinedDateTime.setHours(time.getHours());
      combinedDateTime.setMinutes(time.getMinutes());

      return combinedDateTime.toISOString();
    } catch (error) {
      console.error("Failed to convert date/time:", error);
      return null;
    }
  };

  const handleInputChange = (name, value) => {
    setForm((prevForm) => {
      const newForm = { ...prevForm, [name]: value };
      if (name === "busk_latitude" || name === "busk_longitude") {
        const latitude = parseFloat(newForm.busk_latitude);
        const longitude = parseFloat(newForm.busk_longitude);
        if (!isNaN(latitude) && !isNaN(longitude)) {
          setSelectedLocation({ latitude, longitude });
          setRegion({
            ...region,
            latitude,
            longitude,
          });
        }
      }
      return newForm;
    });
  };

  const handleSwitchChange = (instrument) => {
    setForm((prevForm) => ({
      ...prevForm,
      busk_selected_instruments: {
        ...prevForm.busk_selected_instruments,
        [instrument]: !prevForm.busk_selected_instruments[instrument],
      },
    }));
  };

  const resetForm = () => {
    setForm({
      busk_location_name: "",
      busk_date: new Date(),
      busk_time: new Date(),
      busk_latitude: "",
      busk_longitude: "",
      busk_about_me: "",
      busk_setup: "",
      busk_selected_instruments: {},
    });
    setSelectedLocation({ latitude: null, longitude: null });
    setRegion({
      latitude: 51.5074,
      longitude: -0.1278,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleMapSelect = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setRegion({ ...region, latitude, longitude });
    setForm((prevForm) => ({
      ...prevForm,
      busk_latitude: latitude.toString(),
      busk_longitude: longitude.toString(),
    }));
  };

  const handleSelectLocation = () => {
    setForm((prevForm) => ({
      ...prevForm,
      busk_latitude: selectedLocation.latitude.toString(),
      busk_longitude: selectedLocation.longitude.toString(),
    }));
    setIsMapModalVisible(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View>
            {permissionStatus === null ? (
              <Button
                title="Check Calendar Permission"
                onPress={requestCalendarPermission}
              />
            ) : (
              <Button
                title="Request Calendar Permission"
                onPress={requestCalendarPermission}
                disabled={permissionStatus === "granted"}
              />
            )}
          </View>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.successMessage}>
                Success, Your busk event has been created!
              </Text>
              <View>
                <Image
                  style={styles.modalImg}
                  source={require("../assets/check-circle.png")}
                />
              </View>
              <Pressable onPress={handleNavigation} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Go to Busks</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={isMapModalVisible}
          onRequestClose={() => setIsMapModalVisible(false)}
        >
          <View style={styles.mapModalContainer}>
            <MapView
              style={styles.map}
              region={region}
              onPress={handleMapSelect}
            >
              {selectedLocation.latitude && (
                <Marker coordinate={selectedLocation} />
              )}
            </MapView>
            <Pressable
              style={styles.selectLocationButton}
              onPress={handleSelectLocation}
            >
              <Text style={styles.selectLocationText}>Select Location</Text>
            </Pressable>
          </View>
        </Modal>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Location Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter busk location name"
            value={form.busk_location_name}
            onChangeText={(text) =>
              setForm({ ...form, busk_location_name: text })
            }
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Event Date:</Text>
          <Pressable
            style={styles.input}
            onPress={() => setDatePickerVisibility(true)}
          >
            <Text>{form.busk_date.toDateString()}</Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={(date) => {
              setForm({ ...form, busk_date: date });
              setDatePickerVisibility(false);
            }}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Event Time:</Text>
          <Pressable
            style={styles.input}
            onPress={() => setTimePickerVisibility(true)}
          >
            <Text>{form.busk_time.toTimeString().slice(0, 5)}</Text>
          </Pressable>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={(time) => {
              setForm({ ...form, busk_time: time });
              setTimePickerVisibility(false);
            }}
            onCancel={() => setTimePickerVisibility(false)}
          />
        </View>

        <Pressable
          style={styles.mapButton}
          onPress={() => setIsMapModalVisible(true)}
        >
          <Text style={styles.mapButtonText}>Pick Location on Map</Text>
        </Pressable>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Latitude:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter latitude"
            value={form.busk_latitude}
            onChangeText={(text) => setForm({ ...form, busk_latitude: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Longitude:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter longitude"
            value={form.busk_longitude}
            onChangeText={(text) => setForm({ ...form, busk_longitude: text })}
          />
        </View>

        <Text style={styles.label}>Instruments:</Text>
        {availableInstruments.map((instrument) => (
          <View key={instrument} style={styles.checkboxRow}>
            <Switch
              value={form.busk_selected_instruments[instrument] || false}
              onValueChange={() => handleSwitchChange(instrument)}
            />
            <Text style={styles.checkboxLabel}>
              {instrument.replace(/([A-Z])/g, " $1").trim()}
            </Text>
          </View>
        ))}

        <View style={styles.formGroup}>
          <Text style={styles.label}>About Me:</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tell us about yourself"
            multiline
            value={form.busk_about_me}
            onChangeText={(text) => setForm({ ...form, busk_about_me: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Setup:</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your setup"
            multiline
            value={form.busk_setup}
            onChangeText={(text) => setForm({ ...form, busk_setup: text })}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitText}>
              {submitting ? "Submitting..." : "Submit"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: "100%",
    padding: 20,
    backgroundColor: colours.primaryBackground,
  },
  scrollView: {
    flexGrow: 1,
    overflow: "scroll",
  },
  label: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colours.darkHighlight,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: colours.lightText,
    paddingRight: 50,
    color: "black",
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colours.darkHighlight,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colours.lightText,
    textAlignVertical: "top",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: colours.primaryHighlight,
    padding: 15,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 5,
  },
  submitText: {
    color: "white",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    paddingVertical: 55,
    backgroundColor: colours.primaryBackground,
    borderRadius: 5,
    alignItems: "center",
  },
  successMessage: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 25,
  },
  modalButton: {
    width: 200,
    padding: 20,
    backgroundColor: colours.secondaryHighlight,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
  modalButtonText: {
    color: colours.lightText,
    fontSize: 16,
  },
  modalImg: {
    width: 80,
    height: 80,
    marginBottom: 30,
  },
  mapModalContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapButton: {
    backgroundColor: colours.primaryHighlight,
    padding: 10,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
  },
  mapButtonText: {
    color: colours.lightText,
    fontSize: 16,
  },
  selectLocationButton: {
    padding: 15,
    alignItems: "center",
    backgroundColor: colours.primaryHighlight,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 50,
  },
  selectLocationText: {
    color: colours.lightText,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
