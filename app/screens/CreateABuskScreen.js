// import React, { useState, useEffect } from 'react';
// import {
// 	Text,
// 	View,
// 	TextInput,
// 	Pressable,
// 	StyleSheet,
// 	Switch,
// 	ActivityIndicator,
// 	Alert,
// 	ScrollView,
// 	Modal,
// 	Image,
// } from 'react-native';
// import { fetchSingleBusker, addBusk } from '../api';
// import colours from '../config/colours';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';

// export default function CreateABuskScreen({ route, navigation }) {
// 	const data = route.params;

// 	const [form, setForm] = useState({
// 		busk_location_name: '',
// 		busk_date: new Date(),
// 		busk_time: new Date(),
// 		busk_latitude: '',
// 		busk_longitude: '',
// 		busk_about_me: '',
// 		busk_setup: '',
// 		busk_selected_instruments: {},
// 	});

// 	const [availableInstruments, setAvailableInstruments] = useState([]);
// 	const [loading, setLoading] = useState(true);
// 	const [submitting, setSubmitting] = useState(false);
// 	const [isModalVisible, setIsModalVisible] = useState(false);
// 	const [error, setError] = useState(null);

// 	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
// 	const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
// 	const [isMapModalVisible, setIsMapModalVisible] = useState(false);
// 	const [region, setRegion] = useState({
// 		latitude: 51.5074,
// 		longitude: -0.1278,
// 		latitudeDelta: 0.0922,
// 		longitudeDelta: 0.0421,
// 	});
// 	const [selectedLocation, setSelectedLocation] = useState({
// 		latitude: null,
// 		longitude: null,
// 	});

// 	useEffect(() => {
// 		fetchSingleBusker(data.data.user_id)
// 			.then((user) => {
// 				const instruments = user.instruments || [];
// 				setAvailableInstruments(instruments || []);
// 				setForm((prevForm) => ({
// 					...prevForm,
// 					busk_selected_instruments: instruments.reduce((acc, instrument) => {
// 						acc[instrument] = false;
// 						return acc;
// 					}, {}),
// 				}));
// 				setLoading(false);
// 			})
// 			.catch((error) => {
// 				console.error('Error fetching user data:', error);
// 				setError('Failed to fetch user data');
// 				setLoading(false);
// 			});
// 	}, [data.data.user_id]);

// 	const handleInputChange = (name, value) => {
// 		setForm((prevForm) => {
// 			const newForm = { ...prevForm, [name]: value };
// 			if (name === 'busk_latitude' || name === 'busk_longitude') {
// 				const latitude = parseFloat(newForm.busk_latitude);
// 				const longitude = parseFloat(newForm.busk_longitude);
// 				if (!isNaN(latitude) && !isNaN(longitude)) {
// 					setSelectedLocation({ latitude, longitude });
// 					setRegion({
// 						...region,
// 						latitude,
// 						longitude,
// 					});
// 				}
// 			}
// 			return newForm;
// 		});
// 	};

// 	const handleSwitchChange = (instrument) => {
// 		setForm((prevForm) => ({
// 			...prevForm,
// 			busk_selected_instruments: {
// 				...prevForm.busk_selected_instruments,
// 				[instrument]: !prevForm.busk_selected_instruments[instrument],
// 			},
// 		}));
// 	};

// 	const handleSubmit = () => {
// 		const {
// 			busk_date,
// 			busk_time,
// 			busk_location_name,
// 			busk_latitude,
// 			busk_longitude,
// 		} = form;

// 		if (
// 			busk_location_name &&
// 			busk_date &&
// 			busk_time &&
// 			busk_latitude &&
// 			busk_longitude
// 		) {
// 			setSubmitting(true);

// 			const formattedDateTime = convertToISO(busk_date, busk_time);

// 			if (!formattedDateTime) {
// 				setSubmitting(false);
// 				Alert.alert('Error', 'Invalid date or time format.');
// 				return;
// 			}

// 			const buskData = {
// 				busk_location: {
// 					latitude: parseFloat(busk_latitude),
// 					longitude: parseFloat(busk_longitude),
// 				},
// 				busk_location_name: busk_location_name,
// 				busk_time_date: formattedDateTime,
// 				busk_about_me: form.busk_about_me,
// 				busk_setup: form.busk_setup,
// 				busk_selected_instruments: Object.keys(
// 					form.busk_selected_instruments
// 				).filter((key) => form.busk_selected_instruments[key]),
// 				username: data.data.username,
// 				user_image_url: data.data.user_image_url,
// 			};

// 			addBusk(buskData)
// 				.then(() => {
// 					setForm({
// 						busk_location_name: '',
// 						busk_date: new Date(),
// 						busk_time: new Date(),
// 						busk_latitude: '',
// 						busk_longitude: '',
// 						busk_about_me: '',
// 						busk_setup: '',
// 						busk_selected_instruments: availableInstruments.reduce(
// 							(acc, instrument) => {
// 								acc[instrument] = false;
// 								return acc;
// 							},
// 							{}
// 						),
// 					});
// 					setSelectedLocation({
// 						latitude: null,
// 						longitude: null,
// 					});
// 					setRegion({
// 						latitude: 51.5074,
// 						longitude: -0.1278,
// 						latitudeDelta: 0.0922,
// 						longitudeDelta: 0.0421,
// 					});

// 					setSubmitting(false);
// 					setIsModalVisible(true);
// 				})
// 				.catch((error) => {
// 					setSubmitting(false);
// 					console.error('Error creating busk event:', error);
// 					Alert.alert(
// 						'Error',
// 						'Failed to create busk event. ' + (error.response?.data?.msg || '')
// 					);
// 				});
// 		} else {
// 			Alert.alert('Error', 'Please fill in all the required fields.');
// 		}
// 	};

// 	const convertToISO = (date, time) => {
// 		try {
// 			const combinedDateTime = new Date(date);
// 			combinedDateTime.setHours(time.getHours());
// 			combinedDateTime.setMinutes(time.getMinutes());

// 			return combinedDateTime.toISOString();
// 		} catch (error) {
// 			console.error('Failed to convert date/time:', error);
// 			return null;
// 		}
// 	};

// const showDatePicker = () => {
// 	setDatePickerVisibility(true);
// };

// const hideDatePicker = () => {
// 	setDatePickerVisibility(false);
// };

// const handleConfirmDate = (selectedDate) => {
// 	hideDatePicker();
// 	setForm((prevForm) => ({ ...prevForm, busk_date: selectedDate }));
// };

// const showTimePicker = () => {
// 	setTimePickerVisibility(true);
// };

// const hideTimePicker = () => {
// 	setTimePickerVisibility(false);
// };

// const handleConfirmTime = (selectedTime) => {
// 	hideTimePicker();
// 	setForm((prevForm) => ({ ...prevForm, busk_time: selectedTime }));
// };

// const handleMapSelect = (e) => {
// 	const { latitude, longitude } = e.nativeEvent.coordinate;
// 	setSelectedLocation({ latitude, longitude });
// 	setRegion({ ...region, latitude, longitude });
// 	setForm((prevForm) => ({
// 		...prevForm,
// 		busk_latitude: latitude.toString(),
// 		busk_longitude: longitude.toString(),
// 	}));
// };

// const handleSelectLocation = () => {
// 	setForm((prevForm) => ({
// 		...prevForm,
// 		busk_latitude: selectedLocation.latitude.toString(),
// 		busk_longitude: selectedLocation.longitude.toString(),
// 	}));
// 	setIsMapModalVisible(false);
// };

// const handleNavigation = () => {
// 	setIsModalVisible(false);
// 	navigation.navigate('Busks');
// };

// if (loading) {
// 	return (
// 		<SafeAreaView style={styles.container}>
// 			<ActivityIndicator size='large' color='#0000ff' />
// 		</SafeAreaView>
// 	);
// }

// if (error) {
// 	return (
// 		<SafeAreaView style={styles.container}>
// 			<Text>{error}</Text>
// 		</SafeAreaView>
// 	);
// }

// 	return (
// 		<SafeAreaView style={styles.container}>
// 			<ScrollView contentContainerStyle={styles.scrollView}>
// <Modal
// 	animationType='slide'
// 	transparent={true}
// 	visible={isModalVisible}
// 	onRequestClose={() => setIsModalVisible(false)}
// >
// 	<View style={styles.modalContainer}>
// 		<View style={styles.modalContent}>
// 			<Text style={styles.successMessage}>
// 				Success, Your busk event has been created!
// 			</Text>
// 			<View>
// 				<Image
// 					style={styles.modalImg}
// 					source={require('../assets/check-circle.png')}
// 				/>
// 			</View>
// 			<Pressable onPress={handleNavigation} style={styles.modalButton}>
// 				<Text style={styles.modalButtonText}>Go to Busks</Text>
// 			</Pressable>
// 		</View>
// 	</View>
// </Modal>

// <Modal
// 	animationType='slide'
// 	transparent={false}
// 	visible={isMapModalVisible}
// 	onRequestClose={() => setIsMapModalVisible(false)}
// >
// 	<View style={styles.mapModalContainer}>
// 		<MapView
// 			style={styles.map}
// 			region={region}
// 			onPress={handleMapSelect}
// 		>
// 			{selectedLocation.latitude && (
// 				<Marker coordinate={selectedLocation} />
// 			)}
// 		</MapView>
// 		<Pressable
// 			style={styles.selectLocationButton}
// 			onPress={handleSelectLocation}
// 		>
// 			<Text style={styles.selectLocationText}>Select Location</Text>
// 		</Pressable>
// 	</View>
// </Modal>

// <Text style={styles.label}>Event Name:</Text>
// <TextInput
// 	style={styles.input}
// 	placeholder='Enter event name'
// 	value={form.busk_location_name}
// 	onChangeText={(text) => handleInputChange('busk_location_name', text)}
// />

// <Text style={styles.label}>Event Date:</Text>
// <Pressable onPress={showDatePicker}>
// 	<TextInput
// 		style={styles.input}
// 		placeholder='Select event date'
// 		value={form.busk_date.toDateString()}
// 		editable={false}
// 	/>
// </Pressable>

// <DateTimePickerModal
// 	isVisible={isDatePickerVisible}
// 	mode='date'
// 	onConfirm={handleConfirmDate}
// 	onCancel={hideDatePicker}
// />

// <Text style={styles.label}>Event Time:</Text>
// <Pressable onPress={showTimePicker}>
// 	<TextInput
// 		style={styles.input}
// 		placeholder='Select event time'
// 		value={form.busk_time.toLocaleTimeString([], {
// 			hour: '2-digit',
// 			minute: '2-digit',
// 		})}
// 		editable={false}
// 	/>
// </Pressable>

// <DateTimePickerModal
// 	isVisible={isTimePickerVisible}
// 	mode='time'
// 	onConfirm={handleConfirmTime}
// 	onCancel={hideTimePicker}
// />

// <Text style={styles.label}>Location:</Text>
// <Pressable
// 	style={styles.mapButton}
// 	onPress={() => setIsMapModalVisible(true)}
// >
// 	<Text style={styles.mapButtonText}>Pick Location on Map</Text>
// </Pressable>

// <Text style={styles.label}>Latitude:</Text>
// <TextInput
// 	style={styles.input}
// 	placeholder='Enter latitude'
// 	value={form.busk_latitude}
// 	onChangeText={(text) => handleInputChange('busk_latitude', text)}
// 	keyboardType='numeric'
// />

// <Text style={styles.label}>Longitude:</Text>
// <TextInput
// 	style={styles.input}
// 	placeholder='Enter longitude'
// 	value={form.busk_longitude}
// 	onChangeText={(text) => handleInputChange('busk_longitude', text)}
// 	keyboardType='numeric'
// />

// <Text style={styles.label}>Instruments:</Text>
// {availableInstruments.map((instrument) => (
// 	<View key={instrument} style={styles.checkboxRow}>
// 		<Switch
// 			value={form.busk_selected_instruments[instrument] || false}
// 			onValueChange={() => handleSwitchChange(instrument)}
// 		/>
// 		<Text style={styles.checkboxLabel}>
// 			{instrument.replace(/([A-Z])/g, ' $1').trim()}
// 		</Text>
// 	</View>
// ))}

// <Text style={styles.label}>About Me:</Text>
// <TextInput
// 	style={styles.textArea}
// 	placeholder='Tell us about yourself'
// 	value={form.busk_about_me}
// 	onChangeText={(text) => handleInputChange('busk_about_me', text)}
// 	multiline
// 	numberOfLines={4}
// />

// <Text style={styles.label}>Setup:</Text>
// <TextInput
// 	style={styles.textArea}
// 	placeholder='Describe your setup'
// 	value={form.busk_setup}
// 	onChangeText={(text) => handleInputChange('busk_setup', text)}
// 	multiline
// 	numberOfLines={4}
// />

// 				<Pressable
// 					style={styles.submitButton}
// 					onPress={handleSubmit}
// 					disabled={submitting}
// 				>
// 					<Text style={styles.submitText}>
// 						{submitting ? 'Submitting...' : 'Submit'}
// 					</Text>
// 				</Pressable>
// 			</ScrollView>
// 		</SafeAreaView>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		minHeight: '100%',
// 		padding: 20,
// 		backgroundColor: colours.primaryBackground,
// 	},
// 	scrollView: {
// 		flexGrow: 1,
// 		overflow: 'scroll',
// 	},
// 	label: {
// 		marginVertical: 10,
// 	},
// 	input: {
// 		borderWidth: 1,
// 		borderColor: colours.darkHighlight,
// 		padding: 10,
// 		marginBottom: 10,
// 		borderRadius: 5,
// 		backgroundColor: colours.lightText,
// 		paddingRight: 50,
// 		color: 'black',
// 	},
// 	textArea: {
// 		minHeight: 100,
// 		borderWidth: 1,
// 		borderColor: colours.darkHighlight,
// 		padding: 10,
// 		marginBottom: 15,
// 		borderRadius: 5,
// 		backgroundColor: colours.lightText,
// 		textAlignVertical: 'top',
// 	},
// 	checkboxRow: {
// 		flexDirection: 'row',
// 		alignItems: 'center',
// 		marginVertical: 4,
// 	},
// 	checkboxLabel: {
// 		marginLeft: 8,
// 		fontSize: 16,
// 	},
// 	submitButton: {
// 		backgroundColor: colours.primaryHighlight,
// 		padding: 15,
// 		alignItems: 'center',
// 		marginTop: 20,
// 		borderRadius: 5,
// 	},
// 	submitText: {
// 		color: colours.lightText,
// 	},
// 	modalContainer: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		alignItems: 'center',
// 		backgroundColor: 'rgba(0, 0, 0, 0.5)',
// 	},
// 	modalContent: {
// 		width: 300,
// 		padding: 20,
// 		paddingVertical: 55,
// 		backgroundColor: colours.primaryBackground,
// 		borderRadius: 5,
// 		alignItems: 'center',
// 	},
// 	successMessage: {
// 		fontSize: 16,
// 		marginBottom: 30,
// 		textAlign: 'center',
// 		lineHeight: 25,
// 	},
// 	modalButton: {
// 		width: 200,
// 		padding: 20,
// 		backgroundColor: colours.secondaryHighlight,
// 		paddingHorizontal: 50,
// 		borderRadius: 5,
// 	},
// 	modalButtonText: {
// 		color: colours.lightText,
// 		fontSize: 16,
// 	},
// 	modalImg: {
// 		width: 80,
// 		height: 80,
// 		marginBottom: 30,
// 	},
// 	mapModalContainer: {
// 		flex: 1,
// 	},
// 	map: {
// 		flex: 1,
// 	},
// 	mapButton: {
// 		backgroundColor: colours.primaryHighlight,
// 		padding: 10,
// 		alignItems: 'center',
// 		marginTop: 15,
// 		marginBottom: 15,
// 		borderRadius: 5,
// 	},
// 	mapButtonText: {
// 		color: colours.lightText,
// 		fontSize: 16,
// 	},
// 	selectLocationButton: {
// 		padding: 15,
// 		alignItems: 'center',
// 		backgroundColor: colours.primaryHighlight,
// 		borderRadius: 5,
// 		marginTop: 20,
// 		marginBottom: 20,
// 		marginHorizontal: 50,
// 	},
// 	selectLocationText: {
// 		color: colours.lightText,
// 		fontSize: 16,
// 	},
// });
///////////////////////////////////////////
////////////////add sync calendar/////////
/////////////////////////////////////////
// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   View,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Switch,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Modal,
//   Image,
// } from "react-native";
// import { fetchSingleBusker, addBusk } from "../api";
// import colours from "../config/colours";
// import { SafeAreaView } from "react-native-safe-area-context";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import * as Calendar from "expo-calendar";

// export default function CreateABuskScreen({ route, navigation }) {
//   const data = route.params;

//   const [form, setForm] = useState({
//     busk_location_name: "",
//     busk_date: new Date(),
//     busk_time: new Date(),
//     busk_latitude: "",
//     busk_longitude: "",
//     busk_about_me: "",
//     busk_setup: "",
//     busk_selected_instruments: {},
//   });

//   const [availableInstruments, setAvailableInstruments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [error, setError] = useState(null);
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
//   const [isMapModalVisible, setIsMapModalVisible] = useState(false);
//   const [region, setRegion] = useState({
//     latitude: 51.5074,
//     longitude: -0.1278,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [selectedLocation, setSelectedLocation] = useState({
//     latitude: null,
//     longitude: null,
//   });

//   // Calendar permissions and sync
//   useEffect(() => {
//     (async () => {
//       const { status } = await Calendar.requestCalendarPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "We need calendar permissions to sync busk events."
//         );
//       }
//     })();
//   }, []);

//   const createCalendarEvent = async (buskData) => {
//     try {
//       const calendars = await Calendar.getCalendarsAsync(
//         Calendar.EntityTypes.EVENT
//       );
//       const defaultCalendar = calendars.find(
//         (cal) => cal.source.isLocalAccount
//       );
//       const calendarId = defaultCalendar.id;

//       const startDate = new Date(buskData.busk_time_date);
//       const endDate = new Date(startDate);
//       endDate.setHours(endDate.getHours() + 2); // Example: event lasts 2 hours

//       await Calendar.createEventAsync(calendarId, {
//         title: buskData.busk_location_name,
//         location: `${buskData.busk_location.latitude}, ${buskData.busk_location.longitude}`,
//         startDate,
//         endDate,
//         timeZone: "GMT",
//         notes: `About: ${buskData.busk_about_me} \nSetup: ${buskData.busk_setup}`,
//       });

//       Alert.alert("Success", "Event added to your calendar!");
//     } catch (error) {
//       console.error("Error creating calendar event:", error);
//       Alert.alert("Error", "Failed to sync with calendar.");
//     }
//   };

//   useEffect(() => {
//     fetchSingleBusker(data.data.user_id)
//       .then((user) => {
//         const instruments = user.instruments || [];
//         setAvailableInstruments(instruments || []);
//         setForm((prevForm) => ({
//           ...prevForm,
//           busk_selected_instruments: instruments.reduce((acc, instrument) => {
//             acc[instrument] = false;
//             return acc;
//           }, {}),
//         }));
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//         setError("Failed to fetch user data");
//         setLoading(false);
//       });
//   }, [data.data.user_id]);

//   const handleInputChange = (name, value) => {
//     setForm((prevForm) => {
//       const newForm = { ...prevForm, [name]: value };
//       if (name === "busk_latitude" || name === "busk_longitude") {
//         const latitude = parseFloat(newForm.busk_latitude);
//         const longitude = parseFloat(newForm.busk_longitude);
//         if (!isNaN(latitude) && !isNaN(longitude)) {
//           setSelectedLocation({ latitude, longitude });
//           setRegion({
//             ...region,
//             latitude,
//             longitude,
//           });
//         }
//       }
//       return newForm;
//     });
//   };

//   const handleSwitchChange = (instrument) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       busk_selected_instruments: {
//         ...prevForm.busk_selected_instruments,
//         [instrument]: !prevForm.busk_selected_instruments[instrument],
//       },
//     }));
//   };

//   const handleSubmit = () => {
//     const {
//       busk_date,
//       busk_time,
//       busk_location_name,
//       busk_latitude,
//       busk_longitude,
//     } = form;

//     if (
//       busk_location_name &&
//       busk_date &&
//       busk_time &&
//       busk_latitude &&
//       busk_longitude
//     ) {
//       setSubmitting(true);

//       const formattedDateTime = convertToISO(busk_date, busk_time);

//       if (!formattedDateTime) {
//         setSubmitting(false);
//         Alert.alert("Error", "Invalid date or time format.");
//         return;
//       }

//       const buskData = {
//         busk_location: {
//           latitude: parseFloat(busk_latitude),
//           longitude: parseFloat(busk_longitude),
//         },
//         busk_location_name: busk_location_name,
//         busk_time_date: formattedDateTime,
//         busk_about_me: form.busk_about_me,
//         busk_setup: form.busk_setup,
//         busk_selected_instruments: Object.keys(
//           form.busk_selected_instruments
//         ).filter((key) => form.busk_selected_instruments[key]),
//         username: data.data.username,
//         user_image_url: data.data.user_image_url,
//       };

//       addBusk(buskData)
//         .then(() => {
//           setForm({
//             busk_location_name: "",
//             busk_date: new Date(),
//             busk_time: new Date(),
//             busk_latitude: "",
//             busk_longitude: "",
//             busk_about_me: "",
//             busk_setup: "",
//             busk_selected_instruments: availableInstruments.reduce(
//               (acc, instrument) => {
//                 acc[instrument] = false;
//                 return acc;
//               },
//               {}
//             ),
//           });
//           setSelectedLocation({
//             latitude: null,
//             longitude: null,
//           });
//           setRegion({
//             latitude: 51.5074,
//             longitude: -0.1278,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           });

//           setSubmitting(false);
//           setIsModalVisible(true);

//           // Sync with calendar
//           createCalendarEvent(buskData);
//         })
//         .catch((error) => {
//           setSubmitting(false);
//           console.error("Error creating busk event:", error);
//           Alert.alert(
//             "Error",
//             "Failed to create busk event. " + (error.response?.data?.msg || "")
//           );
//         });
//     } else {
//       Alert.alert("Error", "Please fill in all the required fields.");
//     }
//   };

//   const convertToISO = (date, time) => {
//     try {
//       const combinedDateTime = new Date(date);
//       combinedDateTime.setHours(time.getHours());
//       combinedDateTime.setMinutes(time.getMinutes());

//       return combinedDateTime.toISOString();
//     } catch (error) {
//       console.error("Failed to convert date/time:", error);
//       return null;
//     }
//   };

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirmDate = (selectedDate) => {
//     hideDatePicker();
//     setForm((prevForm) => ({ ...prevForm, busk_date: selectedDate }));
//   };

//   const showTimePicker = () => {
//     setTimePickerVisibility(true);
//   };

//   const hideTimePicker = () => {
//     setTimePickerVisibility(false);
//   };

//   const handleConfirmTime = (selectedTime) => {
//     hideTimePicker();
//     setForm((prevForm) => ({ ...prevForm, busk_time: selectedTime }));
//   };

//   const handleMapSelect = (e) => {
//     const { latitude, longitude } = e.nativeEvent.coordinate;
//     setSelectedLocation({ latitude, longitude });
//     setRegion({ ...region, latitude, longitude });
//     setForm((prevForm) => ({
//       ...prevForm,
//       busk_latitude: latitude.toString(),
//       busk_longitude: longitude.toString(),
//     }));
//   };

//   const handleSelectLocation = () => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       busk_latitude: selectedLocation.latitude.toString(),
//       busk_longitude: selectedLocation.longitude.toString(),
//     }));
//     setIsMapModalVisible(false);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color={colours.primary} />
//       ) : (
//         <ScrollView>
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={isModalVisible}
//             onRequestClose={() => setIsModalVisible(false)}
//           >
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.successMessage}>
//                   Success, Your busk event has been created!
//                 </Text>
//                 <View>
//                   <Image
//                     style={styles.modalImg}
//                     source={require("../assets/check-circle.png")}
//                   />
//                 </View>
//                 <Pressable
//                   onPress={handleNavigation}
//                   style={styles.modalButton}
//                 >
//                   <Text style={styles.modalButtonText}>Go to Busks</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </Modal>

//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={isMapModalVisible}
//             onRequestClose={() => setIsMapModalVisible(false)}
//           >
//             <View style={styles.mapModalContainer}>
//               <MapView
//                 style={styles.map}
//                 region={region}
//                 onPress={handleMapSelect}
//               >
//                 {selectedLocation.latitude && (
//                   <Marker coordinate={selectedLocation} />
//                 )}
//               </MapView>
//               <Pressable
//                 style={styles.selectLocationButton}
//                 onPress={handleSelectLocation}
//               >
//                 <Text style={styles.selectLocationText}>Select Location</Text>
//               </Pressable>
//             </View>
//           </Modal>

//           <Text style={styles.label}>Event Name:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter event name"
//             value={form.busk_location_name}
//             onChangeText={(text) =>
//               handleInputChange("busk_location_name", text)
//             }
//           />

//           <Text style={styles.label}>Event Date:</Text>
//           <Pressable onPress={showDatePicker}>
//             <TextInput
//               style={styles.input}
//               placeholder="Select event date"
//               value={form.busk_date.toDateString()}
//               editable={false}
//             />
//           </Pressable>

//           <DateTimePickerModal
//             isVisible={isDatePickerVisible}
//             mode="date"
//             onConfirm={handleConfirmDate}
//             onCancel={hideDatePicker}
//           />

//           <Text style={styles.label}>Event Time:</Text>
//           <Pressable onPress={showTimePicker}>
//             <TextInput
//               style={styles.input}
//               placeholder="Select event time"
//               value={form.busk_time.toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//               editable={false}
//             />
//           </Pressable>

//           <DateTimePickerModal
//             isVisible={isTimePickerVisible}
//             mode="time"
//             onConfirm={handleConfirmTime}
//             onCancel={hideTimePicker}
//           />

//           <Text style={styles.label}>Location:</Text>
//           <Pressable
//             style={styles.mapButton}
//             onPress={() => setIsMapModalVisible(true)}
//           >
//             <Text style={styles.mapButtonText}>Pick Location on Map</Text>
//           </Pressable>

//           <Text style={styles.label}>Latitude:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter latitude"
//             value={form.busk_latitude}
//             onChangeText={(text) => handleInputChange("busk_latitude", text)}
//             keyboardType="numeric"
//           />

//           <Text style={styles.label}>Longitude:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter longitude"
//             value={form.busk_longitude}
//             onChangeText={(text) => handleInputChange("busk_longitude", text)}
//             keyboardType="numeric"
//           />

//           <Text style={styles.label}>Instruments:</Text>
//           {availableInstruments.map((instrument) => (
//             <View key={instrument} style={styles.checkboxRow}>
//               <Switch
//                 value={form.busk_selected_instruments[instrument] || false}
//                 onValueChange={() => handleSwitchChange(instrument)}
//               />
//               <Text style={styles.checkboxLabel}>
//                 {instrument.replace(/([A-Z])/g, " $1").trim()}
//               </Text>
//             </View>
//           ))}

//           <Text style={styles.label}>About Me:</Text>
//           <TextInput
//             style={styles.textArea}
//             placeholder="Tell us about yourself"
//             value={form.busk_about_me}
//             onChangeText={(text) => handleInputChange("busk_about_me", text)}
//             multiline
//             numberOfLines={4}
//           />

//           <Text style={styles.label}>Setup:</Text>
//           <TextInput
//             style={styles.textArea}
//             placeholder="Describe your setup"
//             value={form.busk_setup}
//             onChangeText={(text) => handleInputChange("busk_setup", text)}
//             multiline
//             numberOfLines={4}
//           />

//           <Pressable
//             style={styles.submitButton}
//             onPress={handleSubmit}
//             disabled={submitting}
//           >
//             <Text style={styles.submitButtonText}>
//               {submitting ? "Submitting..." : "Create Busk Event"}
//             </Text>
//           </Pressable>
//         </ScrollView>
//       )}

//       {/* Calendar Success Modal */}
//       <Modal visible={isModalVisible} animationType="slide">
//         {/* ...Modal Content... */}
//         <Pressable
//           onPress={() => {
//             setIsModalVisible(false);
//             navigation.navigate("Home");
//           }}
//         >
//           <Text>Close</Text>
//         </Pressable>
//       </Modal>

//       {/* Map Modal */}
//       <Modal visible={isMapModalVisible} animationType="slide">
//         <MapView style={styles.map} region={region} onPress={handleMapSelect}>
//           {selectedLocation.latitude && (
//             <Marker coordinate={selectedLocation} />
//           )}
//         </MapView>
//         <Pressable onPress={handleSelectLocation}>
//           <Text>Confirm Location</Text>
//         </Pressable>
//       </Modal>

//       <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirmDate}
//         onCancel={hideDatePicker}
//       />
//       <DateTimePickerModal
//         isVisible={isTimePickerVisible}
//         mode="time"
//         onConfirm={handleConfirmTime}
//         onCancel={hideTimePicker}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     minHeight: "100%",
//     padding: 20,
//     backgroundColor: colours.primaryBackground,
//   },
//   scrollView: {
//     flexGrow: 1,
//     overflow: "scroll",
//   },
//   label: {
//     marginVertical: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colours.darkHighlight,
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//     backgroundColor: colours.lightText,
//     paddingRight: 50,
//     color: "black",
//   },
//   textArea: {
//     minHeight: 100,
//     borderWidth: 1,
//     borderColor: colours.darkHighlight,
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 5,
//     backgroundColor: colours.lightText,
//     textAlignVertical: "top",
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 4,
//   },
//   checkboxLabel: {
//     marginLeft: 8,
//     fontSize: 16,
//   },
//   submitButton: {
//     backgroundColor: colours.primaryHighlight,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 20,
//     borderRadius: 5,
//   },
//   submitText: {
//     color: colours.lightText,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: 300,
//     padding: 20,
//     paddingVertical: 55,
//     backgroundColor: colours.primaryBackground,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   successMessage: {
//     fontSize: 16,
//     marginBottom: 30,
//     textAlign: "center",
//     lineHeight: 25,
//   },
//   modalButton: {
//     width: 200,
//     padding: 20,
//     backgroundColor: colours.secondaryHighlight,
//     paddingHorizontal: 50,
//     borderRadius: 5,
//   },
//   modalButtonText: {
//     color: colours.lightText,
//     fontSize: 16,
//   },
//   modalImg: {
//     width: 80,
//     height: 80,
//     marginBottom: 30,
//   },
//   mapModalContainer: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   mapButton: {
//     backgroundColor: colours.primaryHighlight,
//     padding: 10,
//     alignItems: "center",
//     marginTop: 15,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
//   mapButtonText: {
//     color: colours.lightText,
//     fontSize: 16,
//   },
//   selectLocationButton: {
//     padding: 15,
//     alignItems: "center",
//     backgroundColor: colours.primaryHighlight,
//     borderRadius: 5,
//     marginTop: 20,
//     marginBottom: 20,
//     marginHorizontal: 50,
//   },
//   selectLocationText: {
//     color: colours.lightText,
//     fontSize: 16,
//   },
// });
/////////////////////////////////////
////////second try/////////////////
//////////////////////////////////
// import React, { useState, useEffect } from "react";
// import {
//   Text,
//   View,
//   TextInput,
//   Pressable,
//   StyleSheet,
//   Switch,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Modal,
//   Image,
// } from "react-native";
// import { fetchSingleBusker, addBusk } from "../api";
// import colours from "../config/colours";
// import { SafeAreaView } from "react-native-safe-area-context";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import * as Calendar from "expo-calendar"; // Calendar API

// export default function CreateABuskScreen({ route, navigation }) {
//   const data = route.params;

//   const [form, setForm] = useState({
//     busk_location_name: "",
//     busk_date: new Date(),
//     busk_time: new Date(),
//     busk_latitude: "",
//     busk_longitude: "",
//     busk_about_me: "",
//     busk_setup: "",
//     busk_selected_instruments: {},
//   });

//   const [availableInstruments, setAvailableInstruments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [error, setError] = useState(null);

//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
//   const [isMapModalVisible, setIsMapModalVisible] = useState(false);
//   const [region, setRegion] = useState({
//     latitude: 51.5074,
//     longitude: -0.1278,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   });
//   const [selectedLocation, setSelectedLocation] = useState({
//     latitude: null,
//     longitude: null,
//   });

//   useEffect(() => {
//     fetchSingleBusker(data.data.user_id)
//       .then((user) => {
//         const instruments = user.instruments || [];
//         setAvailableInstruments(instruments || []);
//         setForm((prevForm) => ({
//           ...prevForm,
//           busk_selected_instruments: instruments.reduce((acc, instrument) => {
//             acc[instrument] = false;
//             return acc;
//           }, {}),
//         }));
//         setLoading(false);
//       })
//       .catch((error) => {
//         console.error("Error fetching user data:", error);
//         setError("Failed to fetch user data");
//         setLoading(false);
//       });
//   }, [data.data.user_id]);

//   // Request Calendar Permissions
//   useEffect(() => {
//     const getCalendarPermission = async () => {
//       const { status } = await Calendar.requestCalendarPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission Denied",
//           "Calendar permissions are required to create events."
//         );
//       }
//     };
//     getCalendarPermission();
//   }, []);

//   const handleInputChange = (name, value) => {
//     setForm((prevForm) => {
//       const newForm = { ...prevForm, [name]: value };
//       if (name === "busk_latitude" || name === "busk_longitude") {
//         const latitude = parseFloat(newForm.busk_latitude);
//         const longitude = parseFloat(newForm.busk_longitude);
//         if (!isNaN(latitude) && !isNaN(longitude)) {
//           setSelectedLocation({ latitude, longitude });
//           setRegion({
//             ...region,
//             latitude,
//             longitude,
//           });
//         }
//       }
//       return newForm;
//     });
//   };

//   const handleSwitchChange = (instrument) => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       busk_selected_instruments: {
//         ...prevForm.busk_selected_instruments,
//         [instrument]: !prevForm.busk_selected_instruments[instrument],
//       },
//     }));
//   };

//   const handleSubmit = async () => {
//     const {
//       busk_date,
//       busk_time,
//       busk_location_name,
//       busk_latitude,
//       busk_longitude,
//     } = form;

//     if (
//       busk_location_name &&
//       busk_date &&
//       busk_time &&
//       busk_latitude &&
//       busk_longitude
//     ) {
//       setSubmitting(true);

//       const formattedDateTime = convertToISO(busk_date, busk_time);

//       if (!formattedDateTime) {
//         setSubmitting(false);
//         Alert.alert("Error", "Invalid date or time format.");
//         return;
//       }

//       const buskData = {
//         busk_location: {
//           latitude: parseFloat(busk_latitude),
//           longitude: parseFloat(busk_longitude),
//         },
//         busk_location_name: busk_location_name,
//         busk_time_date: formattedDateTime,
//         busk_about_me: form.busk_about_me,
//         busk_setup: form.busk_setup,
//         busk_selected_instruments: Object.keys(
//           form.busk_selected_instruments
//         ).filter((key) => form.busk_selected_instruments[key]),
//         username: data.data.username,
//         user_image_url: data.data.user_image_url,
//       };

//       try {
//         await addBusk(buskData);

//         // Add Calendar Event after Busk creation
//         await createCalendarEvent(busk_location_name, formattedDateTime);

//         resetForm();
//         setSubmitting(false);
//         setIsModalVisible(true);
//       } catch (error) {
//         setSubmitting(false);
//         console.error("Error creating busk event:", error);
//         Alert.alert(
//           "Error",
//           "Failed to create busk event. " + (error.response?.data?.msg || "")
//         );
//       }
//     } else {
//       Alert.alert("Error", "Please fill in all the required fields.");
//     }
//   };

//   // Convert date and time to ISO
//   const convertToISO = (date, time) => {
//     try {
//       const combinedDateTime = new Date(date);
//       combinedDateTime.setHours(time.getHours());
//       combinedDateTime.setMinutes(time.getMinutes());

//       return combinedDateTime.toISOString();
//     } catch (error) {
//       console.error("Failed to convert date/time:", error);
//       return null;
//     }
//   };

//   // Create Calendar Event
//   const createCalendarEvent = async (title, dateTime) => {
//     try {
//       const calendars = await Calendar.getCalendarsAsync();
//       const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

//       const eventDetails = {
//         title,
//         startDate: new Date(dateTime),
//         endDate: new Date(new Date(dateTime).getTime() + 2 * 60 * 60 * 1000), // 2-hour event
//         timeZone: "GMT",
//         location: `${form.busk_location_name}, ${form.busk_latitude}, ${form.busk_longitude}`,
//       };

//       await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
//     } catch (error) {
//       console.error("Error creating calendar event:", error);
//       Alert.alert("Error", "Failed to create a calendar event.");
//     }
//   };

//   // Reset form after submission
//   const resetForm = () => {
//     setForm({
//       busk_location_name: "",
//       busk_date: new Date(),
//       busk_time: new Date(),
//       busk_latitude: "",
//       busk_longitude: "",
//       busk_about_me: "",
//       busk_setup: "",
//       busk_selected_instruments: availableInstruments.reduce(
//         (acc, instrument) => {
//           acc[instrument] = false;
//           return acc;
//         },
//         {}
//       ),
//     });
//     setSelectedLocation({
//       latitude: null,
//       longitude: null,
//     });
//     setRegion({
//       latitude: 51.5074,
//       longitude: -0.1278,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     });
//   };

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirmDate = (selectedDate) => {
//     hideDatePicker();
//     setForm((prevForm) => ({ ...prevForm, busk_date: selectedDate }));
//   };

//   const showTimePicker = () => {
//     setTimePickerVisibility(true);
//   };

//   const hideTimePicker = () => {
//     setTimePickerVisibility(false);
//   };

//   const handleConfirmTime = (selectedTime) => {
//     hideTimePicker();
//     setForm((prevForm) => ({ ...prevForm, busk_time: selectedTime }));
//   };

//   const handleMapSelect = (e) => {
//     const { latitude, longitude } = e.nativeEvent.coordinate;
//     setSelectedLocation({ latitude, longitude });
//     setRegion({ ...region, latitude, longitude });
//     setForm((prevForm) => ({
//       ...prevForm,
//       busk_latitude: latitude.toString(),
//       busk_longitude: longitude.toString(),
//     }));
//   };

//   const handleSelectLocation = () => {
//     setForm((prevForm) => ({
//       ...prevForm,
//       busk_latitude: selectedLocation.latitude.toString(),
//       busk_longitude: selectedLocation.longitude.toString(),
//     }));
//     setIsMapModalVisible(false);
//   };

//   const handleNavigation = () => {
//     setIsModalVisible(false);
//     navigation.navigate("Busks");
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </SafeAreaView>
//     );
//   }

//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>{error}</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={isModalVisible}
//           onRequestClose={() => setIsModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.successMessage}>
//                 Success, Your busk event has been created!
//               </Text>
//               <View>
//                 <Image
//                   style={styles.modalImg}
//                   source={require("../assets/check-circle.png")}
//                 />
//               </View>
//               <Pressable onPress={handleNavigation} style={styles.modalButton}>
//                 <Text style={styles.modalButtonText}>Go to Busks</Text>
//               </Pressable>
//             </View>
//           </View>
//         </Modal>

//         <Modal
//           animationType="slide"
//           transparent={false}
//           visible={isMapModalVisible}
//           onRequestClose={() => setIsMapModalVisible(false)}
//         >
//           <View style={styles.mapModalContainer}>
//             <MapView
//               style={styles.map}
//               region={region}
//               onPress={handleMapSelect}
//             >
//               {selectedLocation.latitude && (
//                 <Marker coordinate={selectedLocation} />
//               )}
//             </MapView>
//             <Pressable
//               style={styles.selectLocationButton}
//               onPress={handleSelectLocation}
//             >
//               <Text style={styles.selectLocationText}>Select Location</Text>
//             </Pressable>
//           </View>
//         </Modal>

//         <Text style={styles.label}>Event Name:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter event name"
//           value={form.busk_location_name}
//           onChangeText={(text) => handleInputChange("busk_location_name", text)}
//         />

//         <Text style={styles.label}>Event Date:</Text>
//         <Pressable onPress={showDatePicker}>
//           <TextInput
//             style={styles.input}
//             placeholder="Select event date"
//             value={form.busk_date.toDateString()}
//             editable={false}
//           />
//         </Pressable>

//         <DateTimePickerModal
//           isVisible={isDatePickerVisible}
//           mode="date"
//           onConfirm={handleConfirmDate}
//           onCancel={hideDatePicker}
//         />

//         <Text style={styles.label}>Event Time:</Text>
//         <Pressable onPress={showTimePicker}>
//           <TextInput
//             style={styles.input}
//             placeholder="Select event time"
//             value={form.busk_time.toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//             editable={false}
//           />
//         </Pressable>

//         <DateTimePickerModal
//           isVisible={isTimePickerVisible}
//           mode="time"
//           onConfirm={handleConfirmTime}
//           onCancel={hideTimePicker}
//         />

//         <Text style={styles.label}>Location:</Text>
//         <Pressable
//           style={styles.mapButton}
//           onPress={() => setIsMapModalVisible(true)}
//         >
//           <Text style={styles.mapButtonText}>Pick Location on Map</Text>
//         </Pressable>

//         <Text style={styles.label}>Latitude:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter latitude"
//           value={form.busk_latitude}
//           onChangeText={(text) => handleInputChange("busk_latitude", text)}
//           keyboardType="numeric"
//         />

//         <Text style={styles.label}>Longitude:</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter longitude"
//           value={form.busk_longitude}
//           onChangeText={(text) => handleInputChange("busk_longitude", text)}
//           keyboardType="numeric"
//         />

//         <Text style={styles.label}>Instruments:</Text>
//         {availableInstruments.map((instrument) => (
//           <View key={instrument} style={styles.checkboxRow}>
//             <Switch
//               value={form.busk_selected_instruments[instrument] || false}
//               onValueChange={() => handleSwitchChange(instrument)}
//             />
//             <Text style={styles.checkboxLabel}>
//               {instrument.replace(/([A-Z])/g, " $1").trim()}
//             </Text>
//           </View>
//         ))}

//         <Text style={styles.label}>About Me:</Text>
//         <TextInput
//           style={styles.textArea}
//           placeholder="Tell us about yourself"
//           value={form.busk_about_me}
//           onChangeText={(text) => handleInputChange("busk_about_me", text)}
//           multiline
//           numberOfLines={4}
//         />

//         <Text style={styles.label}>Setup:</Text>
//         <TextInput
//           style={styles.textArea}
//           placeholder="Describe your setup"
//           value={form.busk_setup}
//           onChangeText={(text) => handleInputChange("busk_setup", text)}
//           multiline
//           numberOfLines={4}
//         />

//         <Pressable
//           style={styles.submitButton}
//           onPress={handleSubmit}
//           disabled={submitting}
//         >
//           <Text style={styles.submitText}>
//             {submitting ? "Submitting..." : "Submit"}
//           </Text>
//         </Pressable>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     minHeight: "100%",
//     padding: 20,
//     backgroundColor: colours.primaryBackground,
//   },
//   scrollView: {
//     flexGrow: 1,
//     overflow: "scroll",
//   },
//   label: {
//     marginVertical: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colours.darkHighlight,
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 5,
//     backgroundColor: colours.lightText,
//     paddingRight: 50,
//     color: "black",
//   },
//   textArea: {
//     minHeight: 100,
//     borderWidth: 1,
//     borderColor: colours.darkHighlight,
//     padding: 10,
//     marginBottom: 15,
//     borderRadius: 5,
//     backgroundColor: colours.lightText,
//     textAlignVertical: "top",
//   },
//   checkboxRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 4,
//   },
//   checkboxLabel: {
//     marginLeft: 8,
//     fontSize: 16,
//   },
//   submitButton: {
//     backgroundColor: colours.primaryHighlight,
//     padding: 15,
//     alignItems: "center",
//     marginTop: 20,
//     borderRadius: 5,
//   },
//   submitText: {
//     color: colours.lightText,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: 300,
//     padding: 20,
//     paddingVertical: 55,
//     backgroundColor: colours.primaryBackground,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   successMessage: {
//     fontSize: 16,
//     marginBottom: 30,
//     textAlign: "center",
//     lineHeight: 25,
//   },
//   modalButton: {
//     width: 200,
//     padding: 20,
//     backgroundColor: colours.secondaryHighlight,
//     paddingHorizontal: 50,
//     borderRadius: 5,
//   },
//   modalButtonText: {
//     color: colours.lightText,
//     fontSize: 16,
//   },
//   modalImg: {
//     width: 80,
//     height: 80,
//     marginBottom: 30,
//   },
//   mapModalContainer: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
//   mapButton: {
//     backgroundColor: colours.primaryHighlight,
//     padding: 10,
//     alignItems: "center",
//     marginTop: 15,
//     marginBottom: 15,
//     borderRadius: 5,
//   },
//   mapButtonText: {
//     color: colours.lightText,
//     fontSize: 16,
//   },
//   selectLocationButton: {
//     padding: 15,
//     alignItems: "center",
//     backgroundColor: colours.primaryHighlight,
//     borderRadius: 5,
//     marginTop: 20,
//     marginBottom: 20,
//     marginHorizontal: 50,
//   },
//   selectLocationText: {
//     color: colours.lightText,
//     fontSize: 16,
//   },
// });
///////////////////////////////////////
///////////////pretty good the above - working fine///
////////////////////////////////////////////////
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

  useEffect(() => {
    const getCalendarPermission = async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Calendar permissions are required to create events."
        );
      }
    };
    getCalendarPermission();
  }, []);

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

  const createCalendarEvent = async (title, dateTime) => {
    try {
      const calendars = await Calendar.getCalendarsAsync();
      const defaultCalendar = calendars.find((cal) => cal.allowsModifications);

      const eventDetails = {
        title,
        startDate: new Date(dateTime),
        endDate: new Date(new Date(dateTime).getTime() + 2 * 60 * 60 * 1000),
        timeZone: "GMT",
        location: `${form.busk_location_name}, ${form.busk_latitude}, ${form.busk_longitude}`,
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
    } catch (error) {
      throw new Error("Failed to create calendar event");
    }
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
      busk_selected_instruments: availableInstruments.reduce(
        (acc, instrument) => {
          acc[instrument] = false;
          return acc;
        },
        {}
      ),
    });
    setSelectedLocation({
      latitude: null,
      longitude: null,
    });
    setRegion({
      latitude: 51.5074,
      longitude: -0.1278,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
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

        <Text style={styles.label}>Busk Location Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter busk location name"
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

        <Text style={styles.label}>Location:</Text>
        <Pressable
          style={styles.mapButton}
          onPress={() => setIsMapModalVisible(true)}
        >
          <Text style={styles.mapButtonText}>Pick Location on Map</Text>
        </Pressable>

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
});
