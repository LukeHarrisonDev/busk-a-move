import { useEffect, useState, useCallback } from 'react';
import {
	Text,
	View,
	SafeAreaView,
	ActivityIndicator,
	FlatList,
	StatusBar,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	Pressable,
} from 'react-native';
import { fetchAllBusks } from '../api';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import BuskSearchComponent from '../components/BuskSearchComponent';
import colours from '../config/colours';
import { formatDate, formatTime } from '../assets/utils/date-and-time';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';

function BusksScreen({ navigation, route }) {
	const [initialRegion, setInitialRegion] = useState(null);
	const [busksList, setBusksList] = useState([]);
	const [sortBy, setSortBy] = useState('');
	const [instrumentFilter, setInstrumentFilter] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [mapLocations, setMapLocations] = useState([]);

	const loadBusks = () => {
		setIsLoading(true);
		fetchAllBusks(instrumentFilter, sortBy).then((response) => {
			setBusksList(response.busks);
			const listOfMapLocations = [];
			response.busks.forEach((busk) => {
				const locationAndNameObject = busk.busk_location;
				locationAndNameObject.locationName = busk.busk_location_name;
				listOfMapLocations.push(locationAndNameObject);
			});
			setMapLocations(listOfMapLocations);
			setIsLoading(false);
		});
	};

	const getLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
			console.log('Permission to access location was denied');
			return;
		}
		let location = await Location.getCurrentPositionAsync({});
		return location.coords;
	};

	const handleRefresh = () => {
		setRefreshing(true);
		loadBusks();
		setRefreshing(false);
	};

	useFocusEffect(
		useCallback(() => {
			if (route.params?.refresh) {
				loadBusks();
			}
		}, [route.params?.refresh])
	);

	useEffect(() => {
		loadBusks();
		getLocation().then((response) => {
			setInitialRegion({
				latitude: response.latitude,
				longitude: response.longitude,
				latitudeDelta: 0.0422,
				longitudeDelta: 0.0221,
			});
		});
	}, [instrumentFilter, sortBy]);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size='large' color='0000ff' />
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.busksContainer}>
			<FlatList
				ListHeaderComponent={
					<View>
						<View style={styles.filterContainer}>
							<BuskSearchComponent
								sortBy={sortBy}
								setSortBy={setSortBy}
								instrumentFilter={instrumentFilter}
								setInstrumentFilter={setInstrumentFilter}
							/>
						</View>
						<View style={styles.mapContainer}>
							{initialRegion && (
								<MapView
									style={styles.map}
									provider={PROVIDER_GOOGLE}
									showsUserLocation
									initialRegion={{
										latitude: Number(initialRegion.latitude),
										longitude: Number(initialRegion.longitude),
										latitudeDelta: 0.0102,
										longitudeDelta: 0.0101,
									}}
								>
									{mapLocations.map((marker, index) => {
										return (
											<Marker
												key={index}
												coordinate={{
													latitude: marker.latitude,
													longitude: marker.longitude,
												}}
												title={marker.locationName}
												description='Busk location'
											/>
										);
									})}
								</MapView>
							)}
						</View>
					</View>
				}
				data={busksList}
				renderItem={({ item }) => {
					const instruments = item.busk_selected_instruments.join(', ');

					return (
						<TouchableWithoutFeedback
							onPress={() => {
								navigation.navigate('SingleBusk', { id: item.busk_id });
							}}
						>
							<View style={styles.busksCardsContainer}>
								<View style={styles.busksCardsWrapper}>
									<View style={styles.cardImgContainer}>
										<Image
											style={styles.cardImage}
											source={{ uri: item.user_image_url }}
										/>
										<Image
											source={require('../assets/wave.png')}
											style={styles.wavyBottom}
											resizeMode='cover'
										/>
									</View>

									<View style={styles.locationContainer}>
										<Text style={styles.location}>
											{item.busk_location_name}
										</Text>
									</View>
									<View>
										<Text>
											{formatTime(item.busk_time_date)} on{' '}
											{formatDate(item.busk_time_date)}
										</Text>
									</View>
									<View style={styles.instrumentsContainer}>
										<Text style={styles.instruments}>
											Instruments: {`\n`} {instruments} {`\n`}
											{`\n`} Buskers Setup: {`\n`} {item.busk_setup}
										</Text>
									</View>
									<View>
										<Text>Busk created by {item.username}</Text>
									</View>
									<Pressable
										onPress={() => {
											navigation.navigate('SingleBusk', { id: item.busk_id });
										}}
										style={styles.buskProfileButton}
									>
										<Text style={styles.buskProfileText}>SEE MORE</Text>
									</Pressable>
								</View>
							</View>
						</TouchableWithoutFeedback>
					);
				}}
				ItemSeparatorComponent={() => (
					<View
						style={{
							height: 16,
						}}
					></View>
				)}
				ListEmptyComponent={<Text>No Busks Found</Text>}
				refreshing={refreshing}
				onRefresh={handleRefresh}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	busksContainer: {
		width: '100%',
		height: 300,
		flex: 1,
		backgroundColor: '#FCF8FC',
		paddingTop: StatusBar.currentHeight,
		flexDirection: 'column',
		alignItems: 'center',
		marginVertical: 20,
	},
	filterContainer: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	busksCardsContainer: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 200,
		backgroundColor: colours.primaryBackground,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 4,
	},
	busksCardsWrapper: {
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-evenly',
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
	headerText: {
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 12,
		paddingTop: 10,
	},
	footerText: {
		fontSize: 24,
		textAlign: 'center',
		marginTop: 12,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: 'F5F5F5',
		paddingTop: StatusBar.currentHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	mapContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		margin: 10,
		width: '95%',
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
	location: {
		fontSize: 25,
	},
	buskProfileButton: {
		width: '95%',
		backgroundColor: colours.reversePrimaryHiglight,
		padding: 15,
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 5,
		marginVertical: 15,
		marginTop: 60,
		borderWidth: 2,
		borderColor: colours.primaryHighlight,
	},
	buskProfileText: {
		color: colours.reverseLightText,
		fontWeight: 'bold',
	},
});

export default BusksScreen;
