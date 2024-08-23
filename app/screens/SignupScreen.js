import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Switch } from 'react-native';
import colours from '../config/colours';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [instruments, setInstruments] = useState(['']);

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "*Name is required";
    if (!username) errors.username = "*Username is required";
    if (!email) errors.email = "*Email is required";
    if (!password) errors.password = "*Password is required";
    if (!location) errors.location = "*Location is required";

    setErrorMsg(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInstrumentChange = (index, value) => {
    const updatedInstruments = [...instruments];
    updatedInstruments[index] = value;
    setInstruments(updatedInstruments);
  };

  const addInstrumentInput = () => {
    setInstruments([...instruments, '']);
  };

   const handleSubmit = () => {
    if (validateForm()) {
      console.log("Submited", name, username, email, password, location, instruments, about, isSetup)
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setLocation("");
      setInstruments([""]);
      setAbout("");
      setIsSetup("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Existing Form Fields */}
        <Text style={styles.label}>Name:</Text>
        <TextInput style={styles.input} 
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          autoCorrect={false}
          autoCapitalize='words'
        />
        {errorMsg.name && <Text style={styles.errorText}>{errorMsg.name}</Text>}
        
        <Text style={styles.label}>Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {errorMsg.username && <Text style={styles.errorText}>{errorMsg.username}</Text>}
        
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize='none'
        />
        {errorMsg.email && <Text style={styles.errorText}>{errorMsg.email}</Text>}
        
        <Text style={styles.label}>Create password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Create password"
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize='none'
          secureTextEntry
        />
        {errorMsg.password && <Text style={styles.errorText}>{errorMsg.password}</Text>}
        
        <Text style={styles.label}>Where are you based?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your location"
          value={location}
          autoCapitalize='none'
          onChangeText={setLocation}
        />
        {errorMsg.location && <Text style={styles.errorText}>{errorMsg.location}</Text>}
        
        <Text style={styles.label}>What instruments do you use when busking?</Text>
        {instruments.map((instrument, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`Instrument ${index + 1}`}
            value={instrument}
            onChangeText={(text) => handleInstrumentChange(index, text)}
          />
        ))}
        
        <TouchableOpacity style={styles.addButton} onPress={addInstrumentInput}>
          <Text style={styles.addButtonText}>Add another instrument</Text>
        </TouchableOpacity>

        {/* Existing Form Fields Continue */}
        <Text style={styles.label}>Tell us a bit about yourself:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell us about yourself"
          value={about}
          onChangeText={setAbout}
          autoCapitalize='sentences'
          multiline
        />

        <Text style={styles.label}>Do you require an additional setup?</Text>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Switch
              value={isSetup}
              onValueChange={() => setIsSetup((prev) => !prev)}
            />
          </View>
        </View>
    
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    padding: 20,
    backgroundColor: colours.primaryBackground,
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
  },
  addButton: {
    backgroundColor: colours.primaryHighlight,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: colours.lightText,
  },
  checkboxContainer: {
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  submitButton: {
    backgroundColor: colours.primaryHighlight,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitText: {
    color: colours.lightText,
  },
});
