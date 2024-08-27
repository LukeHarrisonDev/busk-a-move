import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchSingleBusker, addBusk } from "../api";
import colours from "../config/colours";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateABuskScreen({ route, navigation }) {
  const data = route.params;

  const [form, setForm] = useState({
    busk_location_name: "",
    busk_date: "",
    busk_time: "",
    busk_latitude: "",
    busk_longitude: "",
    busk_about_me: "",
    busk_setup: "",
    busk_selected_instruments: {},
  });

  const [availableInstruments, setAvailableInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSingleBusker(data.data.users_id)
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
  }, [data.data.users_id]);

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
          Alert.alert("Success", "Your busk event has been created!");
          navigation.goBack();
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
      const [year, month, day] = date.split("-");

      const [hours, minutes] = time.split(":").map(Number);

      return `${year}-${month}-${day}T${hours}:${minutes}:00.000Z`;
    } catch (error) {
      console.error("Failed to convert date/time:", error);
      return null;
    }
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Event Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event name"
          value={form.busk_location_name}
          onChangeText={(text) => handleInputChange("busk_location_name", text)}
        />

        <Text style={styles.label}>Event Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event date (e.g., 2024-08-14)"
          value={form.busk_date}
          onChangeText={(text) => handleInputChange("busk_date", text)}
        />

        <Text style={styles.label}>Event Time:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter event time (e.g., 20:45)"
          value={form.busk_time}
          onChangeText={(text) => handleInputChange("busk_time", text)}
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
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colours.darkHighlight,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colours.darkHighlight,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    textAlign: "top",
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
    borderRadius: 5,
  },
  submitText: {
    color: colours.lightText,
  },
});
