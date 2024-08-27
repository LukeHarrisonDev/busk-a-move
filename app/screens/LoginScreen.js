import { useState } from 'react';
import { Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { View, Button } from 'react-native-web';
import colours from '../config/colours'; 

function LoginScreen({ navigation }) {
  const [form, setForm] = useState({
    emailOrUsername: '',
    password: ''
  });

  const handleInputChange = (name, value) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = () => {

    //Logic for authentication to be added here if we get to that stage..
   
    console.log(form);
    navigation.navigate("MyProfile");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Email or Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email or username"
        value={form.emailOrUsername}
        onChangeText={(text) => handleInputChange('emailOrUsername', text)}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colours.blueExtraLight,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colours.gunmetal,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colours.white,
  },
  submitButton: {
    backgroundColor: colours.rust,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default LoginScreen;
