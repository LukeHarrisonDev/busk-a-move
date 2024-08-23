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

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "*Name is required";
    if (!username) errors.username = "*Username is required";
    if (!email) errors.email = "*Email is required";
    if (!password) errors.password = "*Password is required";
    if (!location) errors.location = "*Location is required";

    setErrorMsg(errors)
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Submited", name)
      setName("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} 
        placeholder="Enter your name"
        value={name}
          onChangeText={setName}
          autoCorrect={false}
          autoCapitalize='words'
        />
        {
          errorMsg.name ? <Text style={styles.errorText}>{errorMsg.name}</Text> : null
        }        
      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        autoCorrect={false}
        autoCapitalize='none'
      />
       {
          errorMsg.username ? <Text style={styles.errorText}>{errorMsg.username}</Text> : null
        } 
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
        {
          errorMsg.email ? <Text style={styles.errorText}>{errorMsg.email}</Text> : null
        } 
     
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
          {
          errorMsg.password ? <Text style={styles.errorText}>{errorMsg.password}</Text> : null
        } 
      
         
      <Text style={styles.label}>Upload your profile picture here. It will be shown on your public profile.</Text>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload picture</Text>
      </TouchableOpacity>

     
      <Text style={styles.label}>Where are you based?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your location"
        value={location}
        onChangeText={setLocation}
        />
          {
          errorMsg.location ? <Text style={styles.errorText}>{errorMsg.location}</Text> : null
        } 
      
      {/* <Text style={styles.label}>What instruments do you use when busking?</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.checkboxRow}>
          <Switch
            value={form.instruments.acousticGuitar}
          />
          <Text style={styles.checkboxLabel}>Acoustic Guitar</Text>
          <Switch
            value={form.instruments.electricGuitar}
          />
          <Text style={styles.checkboxLabel}>Electric Guitar</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Switch
            value={form.instruments.singing}
          />
          <Text style={styles.checkboxLabel}>Singing</Text>
          <Switch
            value={form.instruments.bass}
          />
          <Text style={styles.checkboxLabel}>Bass</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Switch
            value={form.instruments.violin}
          />
          <Text style={styles.checkboxLabel}>Violin</Text>
          <Switch
            value={form.instruments.drums}
          />
          <Text style={styles.checkboxLabel}>Drums</Text>
        </View>
      </View> */}
        
      <Text style={styles.label}>Tell us a bit about yourself. Is it your first time busking? Which genres do you usually perform? This will help other buskers get to know you better:</Text>
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
  uploadButton: {
    backgroundColor: colours.primaryHighlight,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  uploadText: {
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
  checkboxLabel: {
    marginRight: 20,
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
