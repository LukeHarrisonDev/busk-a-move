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

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
    console.log(form)
  };

  const handleInstrumentChange = (instrument, value) => {
    setForm({
      ...form,
      instruments: {
        ...form.instruments,
        [instrument]: value,
      },
    });
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

      
      <Text style={styles.label}>Pic Upload:</Text>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadText}>Upload files</Text>
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
            onValueChange={(value) => handleInstrumentChange('acousticGuitar', value)}
          />
          <Text style={styles.checkboxLabel}>Acoustic Guitar</Text>
          <Switch
            value={form.instruments.electricGuitar}
            onValueChange={(value) => handleInstrumentChange('electricGuitar', value)}
          />
          <Text style={styles.checkboxLabel}>Electric Guitar</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Switch
            value={form.instruments.singing}
            onValueChange={(value) => handleInstrumentChange('singing', value)}
          />
          <Text style={styles.checkboxLabel}>Singing</Text>
          <Switch
            value={form.instruments.bass}
            onValueChange={(value) => handleInstrumentChange('bass', value)}
          />
          <Text style={styles.checkboxLabel}>Bass</Text>
        </View>
        <View style={styles.checkboxRow}>
          <Switch
            value={form.instruments.violin}
            onValueChange={(value) => handleInstrumentChange('violin', value)}
          />
          <Text style={styles.checkboxLabel}>Violin</Text>
          <Switch
            value={form.instruments.drums}
            onValueChange={(value) => handleInstrumentChange('drums', value)}
          />
          <Text style={styles.checkboxLabel}>Drums</Text>
        </View>
      </View>

     
      <Text style={styles.label}>Share with other buskers a bit about yourself:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe yourself"
        value={form.about}
        onChangeText={(text) => handleInputChange('about', text)}
        multiline
        numberOfLines={4}
      />

   
      <Text style={styles.label}>What is your main typical setup:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe your setup"
        value={form.setup}
        onChangeText={(text) => handleInputChange('setup', text)}
        multiline
        numberOfLines={4}
      />
    
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
    borderColor: colours.dark,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colours.white,
  },
  uploadButton: {
    backgroundColor: colours.medium,
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
  textArea: {
    borderWidth: 1,
    borderColor: colours.dark,
    color: colours.white,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: colours.medium,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
  },
});
