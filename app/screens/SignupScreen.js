import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Image } from 'react-native';
import { Switch } from 'react-native';
import colours from '../config/colours';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUser } from '../api';

export default function SignUpForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [isSetup, setIsSetup] = useState(false);
  const [errorMsg, setErrorMsg] = useState({});
  const [instruments, setInstruments] = useState(['']);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "*Name is required";
    if (!username) errors.username = "*Username is required";
    if (!email) errors.email = "*Email is required";
    if (!password) errors.password = "*Password is required";
    if (!profileImg) errors.profileImg = "*Profile picture is required"
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
      
      createUser({
        username: username,
        full_name: name,
        user_email: email,
        user_password: password,
        user_image_url: profileImg,
        user_location: location,
        user_about_me: about,
        instruments: instruments
      })
      .then(() => {
        setIsModalVisible(true)
      })
      .then(() => {
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setProfileImg("");
        setLocation("");
        setInstruments([""]);
        setAbout("");
        setIsSetup("");
      })
        

   
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
              <Text style={styles.successMessage}>Your profile was created successfully!</Text>
               <View >
                <Image
                      style={styles.modalImg}
                      source={require("../assets/check-circle.png")}
                    />
                </View>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Go to Busks</Text>
              </TouchableOpacity>            
          </View>
        </View>
      </Modal>       
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

        <Text style={styles.label}>Upload your profile picture:</Text>
        <TextInput
          style={styles.input}
          placeholder="Share your image link"
          value={profileImg}
          onChangeText={setProfileImg}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {errorMsg.profileImg && <Text style={styles.errorText}>{errorMsg.profileImg}</Text>}
        
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 30,
    paddingVertical: 60,
    backgroundColor: colours.primaryBackground,
    borderRadius: 5,
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 25
  },
  modalButton: {
    backgroundColor:colours.secondaryHighlight,
    padding: 10,
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
  }
});
