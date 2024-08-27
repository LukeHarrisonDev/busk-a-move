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

	const handleRefresh = () => {
		setRefreshing(true);
		fetchSingleBusk();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchSingleBusk(id).then((response) => {
			setSingleBusk(response);
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
			setInitialRegion({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
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
		<SafeAreaView
			style={styles.container}
			refreshing={refreshing}
			onRefresh={handleRefresh}
		>
			<View style={styles.card}>
				<Text style={styles.titleText}>{singleBusk.busk_location_name}</Text>
				<Text style={styles.bodyText}>
					{formatTime(singleBusk.busk_time_date)} on{" "}
					{formatDate(singleBusk.busk_time_date)}
				</Text>
				<Text style={styles.bodyText}>{singleBusk.username}</Text>
				<Image
					style={styles.userImage}
					source={{ uri: singleBusk.user_image_url }}
				/>
				<Text style={styles.bodyText}>Setup: {singleBusk.busk_setup}</Text>
				<Text style={styles.bodyText}>
					Instruments: {singleBusk.busk_selected_instruments}
				</Text>
				<Text style={styles.bodyText}>
					About Me: {singleBusk.busk_about_me}
				</Text>
				{initialRegion && (
					<MapView
						style={styles.map}
						initialRegion={initialRegion}
						showsUserLocation
					>
						{currentLocation && (
							<Marker
								coordinate={{
									latitude: currentLocation.latitude,
									longitude: currentLocation.longitude,
								}}
								title="Your Location"
							/>
						)}
					</MapView>
				)}
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
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colours.primaryBackground,
		paddingTop: StatusBar.currentHeight,
	},
	card: {
		backgroundColor: colours.secondaryBackground,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
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
		fontSize: 30,
	},
	bodyText: {
		fontSize: 24,
		color: colours.darkText,
	},
	map: {
		width: "70%",
		height: "50%",
	},
	userImage: {
		width: 80,
		height: 80,
	},
});
export default SingleBusk;
