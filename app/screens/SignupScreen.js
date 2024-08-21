import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Switch } from 'react-native';
import colours from '../config/colours';

export default function SignUpForm() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    location: '',
    instruments: {
      acousticGuitar: false,
      electricGuitar: false,
      singing: false,
      bass: false,
      violin: false,
      drums: false,
    },
    about: '',
    setup: '',
  });

  const handleInputChange = () => {
    console.log(form)
  };

  const handleSubmit = () => {
    console.log(form);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} 
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={form.username}
        onChangeText={(text) => handleInputChange('username', text)}
      />

      
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => handleInputChange('email', text)}
        keyboardType="email-address"
      />

     
      <Text style={styles.label}>Create password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Create password"
        value={form.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
      />
      
      <Text style={styles.label}>Upload your profile picture here. It will be shown on your public profile.</Text>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload picture</Text>
      </TouchableOpacity>

     
      <Text style={styles.label}>Where are you based?</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your location"
        value={form.location}
        onChangeText={(text) => handleInputChange('location', text)}
      />

      
      <Text style={styles.label}>What instruments do you use when busking?</Text>
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
      </View>
    
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
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
  uploadButton: {
    backgroundColor: colours.rust,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  uploadText: {
    color: colours.white,
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
