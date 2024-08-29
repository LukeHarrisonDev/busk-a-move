import { useEffect, useState } from 'react';
import { fetchSingleBusk, deleteBusk, updateBusk } from '../api';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import {
	Text,
	View,
	Image,
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Button,
	Alert,
	Pressable,
	TextInput,
} from 'react-native';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import { formatDate, formatTime } from '../assets/utils/date-and-time';
import colours from '../config/colours';
import * as Location from 'expo-location';

function SingleBusk({ route }) {
	const { id } = route.params;
	const [currentLocation, setCurrentLocation] = useState(null);
	const [initialRegion, setInitialRegion] = useState(null);
	const [singleBusk, setSingleBusk] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [instruments, setInstruments] = useState([]);

	const [isTitleEditing, setIsTitleEditing] = useState(false);
	const [titleName, setTitleName] = useState('');
	const [optimisticTitleName, setOptimisticTitleName] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const isFocused = useIsFocused();
	const navigation = useNavigation();

	const handleTitleSubmit = () => {
		setOptimisticTitleName(titleName);
		setIsTitleEditing(false);
		updateBusk(singleBusk.busk_id, titleName).catch((err) => {
			setOptimisticTitleName(singleBusk.busk_location_name);
			setErrorMessage(
				'Busk location name unsuccessful, please try again in a moment'
			);
		});
	};

	const handleRefresh = () => {
		setRefreshing(true);
		fetchSingleBusk();
		setRefreshing(false);
	};

	const loadBusk = () => {
		setIsLoading(true);
		fetchSingleBusk(id)
			.then((response) => {
				if (!response || response === '') {
					setSingleBusk(null);
				} else {
					setSingleBusk(response);
					setInstruments(response.busk_selected_instruments.join(', '));
					setOptimisticTitleName(response.busk_location_name);
					setInitialRegion({
						latitude: response.busk_location.latitude,
						longitude: response.busk_location.longitude,
						latitudeDelta: 0.0422,
						longitudeDelta: 0.0221,
					});
				}
				setIsLoading(false);
			})
			.catch((error) => {
				console.error('Failed to load busk:', error);
				setIsLoading(false);
				setSingleBusk(null);
			});
	};

	useEffect(() => {
		if (isFocused) {
			loadBusk();
		}
	}, [isFocused]);

	useEffect(() => {
		const getLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.log('Permission to access location was denied');
				return;
			}
			let location = await Location.getCurrentPositionAsync({});
			setCurrentLocation(location.coords);
		};
		getLocation();
	}, []);

	const handleDelete = () => {
		Alert.alert(
			'Confirm Delete',
			'Are you sure you want to delete this busk?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete',
					onPress: () => {
						deleteBusk(id)
							.then(() => {
								Alert.alert('Success', 'Busk deleted successfully');
								navigation.navigate('BusksScreen', {
									refresh: true,
								});
							})
							.catch((error) => {
								console.error('----> error from delete busk: ', error);
								Alert.alert('Error', 'Failed to delete the busk');
							});
					},
					style: 'destructive',
				},
			]
		);
	};

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='0000ff' />
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	if (!singleBusk) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.bodyText}>Busk not found or has been deleted.</Text>
			</SafeAreaView>
		);
	}

	return (
		<>
			<SafeAreaView
				style={styles.buskContainer}
				refreshing={refreshing}
				onRefresh={handleRefresh}
			>
				<View style={styles.buskCardContainer}>
					<ScrollView contentContainerStyle={styles.scrollView}>
						<View style={styles.cardImgContainer}>
							<Image
								style={styles.cardImage}
								source={{ uri: singleBusk.user_image_url }}
							/>
							<Image
								source={require('../assets/wave.png')}
								style={styles.wavyBottom}
								resizeMode='cover'
							/>
						</View>
						<View style={styles.titleContainer}>
							{isTitleEditing ? (
								<View style={styles.editTitleContainer}>
									<View style={styles.textInputContainer}>
										<TextInput
											style={styles.textInput}
											placeholder={singleBusk.busk_location_name}
											value={titleName}
											onChangeText={setTitleName}
											autoCorrect={false}
											autoCapitalize='none'
										/>
									</View>
									<Pressable
										style={styles.buskUpdateButton}
										onPress={handleTitleSubmit}
									>
										<Text style={styles.buskUpdateText}>UPDATE BUSK</Text>
									</Pressable>
								</View>
							) : (
								<Text style={styles.titleText}>
									{optimisticTitleName}{' '}
									<Pressable
										style={styles.pressable}
										onPress={() => {
											setIsTitleEditing(true);
										}}
									>
										<Image
											source={require('../assets/edit.png')}
											style={styles.editPencil}
										/>
									</Pressable>
									<Text style={styles.errorText}>{errorMessage}</Text>
								</Text>
							)}
						</View>
						<View style={styles.dateContainer}>
							<Image
								source={require('../assets/event.png')}
								style={styles.icon}
							/>
							<Text style={styles.dateText}>
								{formatTime(singleBusk.busk_time_date)} on{' '}
								{formatDate(singleBusk.busk_time_date)}
							</Text>
						</View>
						<Text style={styles.usernameText}>
							Busk created by{' '}
							<Text style={styles.italics}>{singleBusk.username}</Text>
						</Text>

						<Text style={styles.bold}>Setup: </Text>
						<Text style={styles.bodyText}>{singleBusk.busk_setup}</Text>

						<Text style={styles.bold}>Instruments:</Text>
						<Text style={styles.bodyText}>{instruments}</Text>
						<Text style={styles.bold}>About Busk: </Text>
						<Text style={styles.bodyText}>{singleBusk.busk_about_me}</Text>
						<View style={styles.mapBorder}>
							{initialRegion && (
								<MapView
									style={styles.map}
									provider={PROVIDER_GOOGLE}
									initialRegion={initialRegion}
									showsUserLocation
								>
									<Marker
										coordinate={{
											latitude: singleBusk.busk_location.latitude,
											longitude: singleBusk.busk_location.longitude,
										}}
										title={singleBusk.busk_location_name}
									/>
								</MapView>
							)}
						</View>
						<Pressable style={styles.buskDeleteButton} onPress={handleDelete}>
							<Text style={styles.buskDeleteText}>DELETE BUSK</Text>
						</Pressable>
					</ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	buskContainer: {
		backgroundColor: '#FCF8FC',
		width: '100%',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buskCardContainer: {
		width: '95%',
		flex: 1,
		backgroundColor: colours.primaryBackground,
		marginTop: 100,
		alignItems: 'center',
	},
	scrollViewContent: {
		alignItems: 'center',
		paddingBottom: 20,
	},
	cardImgContainer: {
		width: '100%',
		height: 70,
		backgroundColor: colours.fourthBackground,
		marginBottom: 100,
	},
	cardImgWrapper: {
		width: '100%',
		height: 90,
		position: 'absolute',
	},
	wavyBottom: {
		position: 'absolute',
		bottom: -90,
		width: '100%',
		height: 100,
	},
	dateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	icon: {
		width: 16,
		height: 16,
		marginRight: 5,
	},
	dateText: {
		fontSize: 16,
	},
	cardImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		borderColor: '#fff',
		borderWidth: 3,
		margin: 'auto',
		position: 'relative',
		top: 70,
		zIndex: 100,
	},
	editTitleContainer: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	textInputContainer: {
		width: '95%',
		marginTop: 10,
		backgroundColor: colours.lightText,
		borderRadius: 8,
		borderWidth: 1.3,
		borderColor: colours.primaryHighlight,
	},
	textInput: {
		fontSize: 16,
		color: colours.primaryText,
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	buskUpdateButton: {
		width: '95%',
		backgroundColor: colours.lightText,
		padding: 15,
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 5,
		marginVertical: 15,
		marginTop: 45,
		borderWidth: 2,
		borderColor: colours.primaryHighlight,
	},
	buskUpdateText: {
		color: colours.primaryHighlight,
		fontWeight: 'bold',
	},
	titleText: {
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 12,
		paddingTop: 10,
	},
	bold: {
		fontWeight: 'bold',
		fontSize: 17,
		marginTop: 15,
		marginRight: 10,
	},
	bodyText: {
		fontSize: 16,
		marginBottom: 10,
	},
	mapContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		marginTop: 30,
		marginLeft: 5,
		width: '100%',
		height: 250,
		borderRadius: 15,
		overflow: 'hidden',
		marginBottom: 20,
		backgroundColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: { width: 5, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 10,
	},
	map: {
		width: 370,
		height: 250,
	},
	editPencil: {
		flexDirection: 'column',
		alignSelf: 'flex-start',
		width: 30,
		height: 30,
	},
	headerText: {
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 12,
		paddingTop: 10,
	},
	buskDeleteButton: {
		width: '95%',
		backgroundColor: colours.lightText,
		padding: 15,
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 5,
		marginVertical: 15,
		marginTop: 45,
		borderWidth: 2,
		borderColor: colours.errorText,
	},
	buskDeleteText: {
		color: colours.errorText,
		fontWeight: 'bold',
	},
	errorText: {
		color: colours.errorText,
		marginBottom: 15,
	},
	italics: {
		fontStyle: 'italic',
		fontWeight: '600',
	},
});
export default SingleBusk;
