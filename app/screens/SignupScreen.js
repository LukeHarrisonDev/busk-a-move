import React, { useState } from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	StatusBar,
	Modal,
	Image,
	ActivityIndicator,
} from 'react-native';
import { Switch } from 'react-native';
import colours from '../config/colours';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUser } from '../api';

export default function SignUpForm({ navigation }) {
	const [name, setName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [profileImg, setProfileImg] = useState('');
	const [location, setLocation] = useState('');
	const [about, setAbout] = useState('');
	const [isSetup, setIsSetup] = useState(false);
	const [errorMsg, setErrorMsg] = useState({});
	const [instrumentErrors, setInstrumentErrors] = useState('');
	const [instruments, setInstruments] = useState(['']);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		let errors = {};

		if (!name) errors.name = '*Name is required';
		if (!username) errors.username = '*Username is required';
		if (!email) errors.email = '*Email is required';
		if (!password) errors.password = '*Password is required';
		if (!profileImg) errors.profileImg = '*Profile picture is required';
		if (!location) errors.location = '*Location is required';

		setErrorMsg(errors);
		return Object.keys(errors).length === 0;
	};

	const handleInstrumentChange = (index, value) => {
		const updatedInstruments = [...instruments];
		updatedInstruments[index] = value;
		setInstruments(updatedInstruments);
		setInstrumentErrors('');
	};

	const handleInstrumentFocus = () => {
		setInstrumentErrors('');
	};

	const addInstrumentInput = () => {
		if (instruments[instruments.length - 1].trim() !== '') {
			setInstruments([...instruments, '']);
			setInstrumentErrors('');
		} else {
			setInstrumentErrors(
				'*Please fill in the current instrument before adding another.'
			);
		}
	};

	const removeInstrumentInput = (index) => {
		const updatedInstruments = instruments.filter((_, i) => i !== index);
		setInstruments(updatedInstruments);
	};

	const handleSubmit = () => {
		setIsLoading(true);
		const filteredInstruments = instruments.filter(
			(instrument) => instrument.trim() !== ''
		);

		if (validateForm() && filteredInstruments.length > 0) {
			createUser({
				username: username,
				full_name: name,
				user_email: email,
				user_password: password,
				user_image_url: profileImg,
				user_location: location,
				user_about_me: about,
				instruments: filteredInstruments,
			})
				.then(() => {
					setIsLoading(false);
					setIsModalVisible(true);
				})
				.then(() => {
					setName('');
					setUsername('');
					setEmail('');
					setPassword('');
					setProfileImg('');
					setLocation('');
					setInstruments(['']);
					setAbout('');
					setIsSetup(false);
				});
		} else {
			setIsLoading(false);
		}
	};

	const handleNavigation = () => {
		setIsModalVisible(false);
		navigation.navigate('Login');
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='0000ff' />
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView showsVerticalScrollIndicator={false}>
				<Modal
					animationType='slide'
					transparent={true}
					visible={isModalVisible}
					onRequestClose={() => setIsModalVisible(false)}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.successMessage}>
								Your profile has been successfully created!
							</Text>
							<View>
								<Image
									style={styles.modalImg}
									source={require('../assets/check-circle.png')}
								/>
							</View>
							<TouchableOpacity
								onPress={() => handleNavigation()}
								style={styles.modalButton}
							>
								<Text style={styles.modalButtonText}>Go to Login</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
				<Text style={styles.label}>Name:</Text>
				<TextInput
					style={styles.input}
					placeholder='Enter your name'
					value={name}
					onChangeText={setName}
					autoCorrect={false}
					autoCapitalize='words'
					onFocus={handleInstrumentFocus}
				/>
				{errorMsg.name && <Text style={styles.errorText}>{errorMsg.name}</Text>}

				<Text style={styles.label}>Username:</Text>
				<TextInput
					style={styles.input}
					placeholder='Enter your username'
					value={username}
					onChangeText={setUsername}
					autoCorrect={false}
					autoCapitalize='none'
					onFocus={handleInstrumentFocus}
				/>
				{errorMsg.username && (
					<Text style={styles.errorText}>{errorMsg.username}</Text>
				)}

				<Text style={styles.label}>Email:</Text>
				<TextInput
					style={styles.input}
					placeholder='email@example.com'
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCorrect={false}
					autoCapitalize='none'
					onFocus={handleInstrumentFocus}
				/>
				{errorMsg.email && (
					<Text style={styles.errorText}>{errorMsg.email}</Text>
				)}

				<Text style={styles.label}>Create password:</Text>
				<View style={styles.inputContainer}>
					<TextInput
						style={styles.input}
						placeholder='Create password'
						value={password}
						onChangeText={setPassword}
						autoCorrect={false}
						autoCapitalize='none'
						secureTextEntry={!showPassword}
						onFocus={handleInstrumentFocus}
					/>
					<TouchableOpacity
						style={styles.iconContainer}
						onPress={() => setShowPassword(!showPassword)}
					>
						<Image
							style={styles.eyeIcon}
							source={
								!showPassword
									? require('../assets/visibility-off.png')
									: require('../assets/visibility-on.png')
							}
						/>
					</TouchableOpacity>
				</View>

				{errorMsg.password && (
					<Text style={styles.errorText}>{errorMsg.password}</Text>
				)}

				<Text style={styles.label}>Upload your profile picture:</Text>
				<TextInput
					style={styles.input}
					placeholder='Share your image link'
					value={profileImg}
					onChangeText={setProfileImg}
					autoCorrect={false}
					autoCapitalize='none'
					onFocus={handleInstrumentFocus}
				/>
				{errorMsg.profileImg && (
					<Text style={styles.errorText}>{errorMsg.profileImg}</Text>
				)}

				<Text style={styles.label}>Where are you based?</Text>
				<TextInput
					style={styles.input}
					placeholder='Enter your location'
					value={location}
					autoCapitalize='none'
					onChangeText={setLocation}
					onFocus={handleInstrumentFocus}
				/>
				{errorMsg.location && (
					<Text style={styles.errorText}>{errorMsg.location}</Text>
				)}

				<Text style={styles.label}>
					What instruments do you use when busking?
				</Text>
				{instruments.map((instrument, index) => (
					<View key={index} style={styles.addInstrumentContainer}>
						<TextInput
							style={styles.addInstrumentInput}
							placeholder={`Instrument ${index + 1}`}
							value={instrument}
							onChangeText={(text) => handleInstrumentChange(index, text)}
							onFocus={handleInstrumentFocus}
						/>
						{index > 0 && (
							<TouchableOpacity
								onPress={() => removeInstrumentInput(index)}
								style={styles.removeIconContainer}
							>
								<Image
									style={styles.removeInstrumentIcon}
									source={require('../assets/remove-circle.png')}
								/>
							</TouchableOpacity>
						)}
					</View>
				))}
				{instrumentErrors ? (
					<Text style={styles.errorText}>{instrumentErrors}</Text>
				) : null}

				<TouchableOpacity style={styles.addButton} onPress={addInstrumentInput}>
					<Image
						style={styles.circleIcon}
						source={require('../assets/add-circle.png')}
					/>
					<Text style={styles.addButtonText}>Add another instrument</Text>
				</TouchableOpacity>

				<Text style={styles.label}>Tell us a bit about yourself:</Text>
				<TextInput
					style={styles.textArea}
					placeholder='i.e., are you a beginner or a seasoned pro? What styles do you love to play?'
					value={about}
					onChangeText={setAbout}
					autoCapitalize='sentences'
					multiline
					onFocus={handleInstrumentFocus}
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
		minHeight: '100%',
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
		paddingRight: 50,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderRadius: 5,
		marginBottom: 15,
	},
	addButtonText: {
		marginLeft: 10,
		color: colours.darkText,
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
		textAlignVertical: 'top',
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
		padding: 20,
		paddingVertical: 55,
		backgroundColor: colours.primaryBackground,
		borderRadius: 5,
		alignItems: 'center',
	},
	successMessage: {
		fontSize: 16,
		marginBottom: 30,
		textAlign: 'center',
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
	inputContainer: {
		position: 'relative',
		width: '100%',
	},
	iconContainer: {
		position: 'absolute',
		right: 15,
		top: '50%',
		transform: [{ translateY: -16 }],
	},
	circleIcon: {
		width: 25,
		height: 25,
	},
	eyeIcon: {
		width: 25,
		height: 25,
		tintColor: '#777',
	},
	instrumentRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	removeButton: {
		marginLeft: 10,
	},
	addInstrumentInput: {
		borderWidth: 1,
		borderColor: colours.darkHighlight,
		padding: 10,
		marginBottom: 10,
		borderRadius: 5,
		backgroundColor: colours.lightText,
		paddingRight: 40,
	},
	addInstrumentContainer: {
		position: 'relative',
		width: '100%',
	},
	removeIconContainer: {
		position: 'absolute',
		right: 10,
		top: '50%',
		transform: [{ translateY: -15 }],
	},
	removeInstrumentIcon: {
		width: 25,
		height: 25,
		tintColor: '#777',
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: 'F5F5F5',
		paddingTop: StatusBar.currentHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
