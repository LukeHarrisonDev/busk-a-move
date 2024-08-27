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
  Image,
} from "react-native";
import { fetchSingleBusker, addBusk } from "../api";
import colours from "../config/colours";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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

  useEffect(() => {
    fetchSingleBusker(data.data.user_id)
      .then((user) => {
        const instruments = user.instruments || [];
        setAvailableInstruments(instruments || []);
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

  const handleInputChange = (name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
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

  const handleSubmit = () => {
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

      addBusk(buskData)
        .then(() => {
          setSubmitting(false);
          setIsModalVisible(true);
        })
        .catch((error) => {
          setSubmitting(false);
          console.error("Error creating busk event:", error);
          Alert.alert(
            "Error",
            "Failed to create busk event. " + (error.response?.data?.msg || "")
          );
        });
    } else {
      Alert.alert("Error", "Please fill in all the required fields.");
    }
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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    hideDatePicker();
    setForm((prevForm) => ({ ...prevForm, busk_date: selectedDate }));
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = (selectedTime) => {
    hideTimePicker();
    setForm((prevForm) => ({ ...prevForm, busk_time: selectedTime }));
  };

  const handleNavigation = () => {
    setIsModalVisible(false);
    navigation.navigate("Busks");
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
              <Pressable
                onPress={() => handleNavigation()}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Go to Busks</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>Event Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={form.busk_location_name}
          onChangeText={(text) => handleInputChange("busk_location_name", text)}
        />

        <Text style={styles.label}>Event Date:</Text>
        <Pressable onPress={showDatePicker}>
          <TextInput
            style={styles.input}
            placeholder="Select event date"
            value={form.busk_date.toDateString()}
            editable={false}
          />
        </Pressable>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />

        <Text style={styles.label}>Event Time:</Text>
        <Pressable onPress={showTimePicker}>
          <TextInput
            style={styles.input}
            placeholder="Select event time"
            value={form.busk_time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            editable={false}
          />
        </Pressable>

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
        />

        <Text style={styles.label}>Latitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter latitude"
          value={form.busk_latitude}
          onChangeText={(text) => handleInputChange("busk_latitude", text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Longitude:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter longitude"
          value={form.busk_longitude}
          onChangeText={(text) => handleInputChange("busk_longitude", text)}
          keyboardType="numeric"
        />
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

        <Text style={styles.label}>About Me:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell us about yourself"
          value={form.busk_about_me}
          onChangeText={(text) => handleInputChange("busk_about_me", text)}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Setup:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Describe your setup"
          value={form.busk_setup}
          onChangeText={(text) => handleInputChange("busk_setup", text)}
          multiline
          numberOfLines={4}
        />

        <Pressable
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitText}>
            {submitting ? "Submitting..." : "Submit"}
          </Text>
        </Pressable>
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
  errorText: {
    color: colours.errorText,
    marginBottom: 15,
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
    color: colours.lightText,
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
});
