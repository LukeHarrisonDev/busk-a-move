import { useEffect, useState } from "react";
import { fetchSingleBusk } from "../api";
import {
	Text,
	View,
	Image,
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	SafeAreaView,
	ScrollView,
} from "react-native";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-maps";
import { formatDate, formatTime } from "../assets/utils/date-and-time";
import colours from "../config/colours";
import * as Location from "expo-location";

function SingleBusk({ route }) {
	const [currentLocation, setCurrentLocation] = useState(null);
	const [initialRegion, setInitialRegion] = useState(null);
	const { id } = route.params;
	const [singleBusk, setSingleBusk] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [instruments, setInstruments] = useState([]);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchSingleBusk();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchSingleBusk(id).then((response) => {
			setSingleBusk(response);
			setInstruments(response.busk_selected_instruments.join(", "));
			setInitialRegion({
				latitude: response.busk_location.latitude,
				longitude: response.busk_location.longitude,
				// latitude: location.coords.latitude,
				// longitude: location.coords.longitude,
				latitudeDelta: 0.0422,
				longitudeDelta: 0.0221,
			});
			setIsLoading(false);
		});

		const getLocation = async () => {
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.log("Permission to access location was denied");
				return;
			}
			let location = await Location.getCurrentPositionAsync({});
			setCurrentLocation(location.coords);
			//
		};
		getLocation();
	}, []);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="0000ff" />
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	return (
		<>
			<SafeAreaView
				style={styles.container}
				refreshing={refreshing}
				onRefresh={handleRefresh}
			>
				<View style={styles.card}>
					<ScrollView contentContainerStyle={styles.scrollView}>
						<Text style={styles.titleText}>
							{singleBusk.busk_location_name}
						</Text>
						<Text style={styles.bodyText}>
							{formatTime(singleBusk.busk_time_date)} on{" "}
							{formatDate(singleBusk.busk_time_date)}
						</Text>
						<Text style={styles.bodyText}>{singleBusk.username}</Text>
						<View style={styles.userImageBorder}>
							<Image
								style={styles.userImage}
								source={{ uri: singleBusk.user_image_url }}
							/>
						</View>
						<Text style={styles.bodyTextBold}>Setup: </Text>
						<Text style={styles.bodyText}>{singleBusk.busk_setup}</Text>

						<Text style={styles.bodyTextBold}>Instruments:</Text>
						<Text style={styles.bodyText}>
							{instruments}
							{/* {singleBusk.busk_selected_instruments} */}
						</Text>
						<Text style={styles.bodyTextBold}>About Me: </Text>
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
									{/* {currentLocation && (
							<Marker
								coordinate={{
									latitude: currentLocation.latitude,
									longitude: currentLocation.longitude,
								}}
								title="Your Location"
							/>
						)} */}
								</MapView>
							)}
						</View>
						{/* <MapView
					style={styles.map}
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: Number(singleBusk.busk_location.latitude),
						longitude: Number(singleBusk.busk_location.longitude),
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				>
					<Marker
						coordinate={{
							latitude: Number(singleBusk.busk_location.latitude),
							longitude: Number(singleBusk.busk_location.longitude),
						}}
						title={singleBusk.busk_location_name}
						description="Busk location"
					/>
				</MapView> */}
					</ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colours.primaryHighlight,
		paddingTop: StatusBar.currentHeight,
		paddingBottom: 10,

		alignItems: "center",
		justifyContent: "center",
	},
	card: {
		flex: 1,
		backgroundColor: colours.secondaryBackground,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	scrollView: {
		alignItems: "center",
		justifyContent: "center",
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: "F5F5F5",
		paddingTop: StatusBar.currentHeight,
		justifyContent: "center",
		alignItems: "center",
	},
	titleText: {
		color: colours.primaryHighlight,
		fontWeight: "bold",
		fontSize: 30,
	},
	bodyText: {
		fontSize: 24,
		color: colours.primaryHighlight,
	},
	bodyTextBold: {
		fontWeight: "bold",
		fontSize: 24,
		color: colours.primaryHighlight,
	},
	mapBorder: {
		marginTop: 15,
		borderWidth: 5,
		borderRadius: 7,
		borderColor: colours.primaryHighlight,
	},
	map: {
		width: 300,
		height: 300,
	},
	userImageBorder: {
		borderWidth: 3,
		borderRadius: 6,
		borderColor: colours.primaryHighlight,
		marginTop: 5,
		marginBottom: 5,
	},
	userImage: {
		width: 120,
		height: 120,
	},
});
export default SingleBusk;
