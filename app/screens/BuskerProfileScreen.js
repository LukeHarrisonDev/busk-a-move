import { useEffect, useState } from "react";
import { fetchSingleBusker } from "../api";
import {
	Text,
	View,
	SafeAreaView,
	ActivityIndicator,
	StatusBar,
	StyleSheet,
} from "react-native";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

function BuskerProfileScreen({ route }) {
	const { id } = route.params;
	const [singleBusker, setSingleBusker] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchSingleBusker();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchSingleBusker(id).then((response) => {
			setSingleBusker(response);
			setIsLoading(false);
		});
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
				<Text style={styles.titleText}>{singleBusker.username}</Text>
				<Text style={styles.bodyText}>{singleBusker.user_location}</Text>
				<MapView
					style={styles.map}
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: 53.8008,
						longitude: -1.5491,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				>
					{/* map over array to produce a list of markers */}
					<Marker
						coordinate={{ latitude: 53.8008, longitude: -1.5491 }}
						title="Calverley Street"
						description="Busk location"
					/>
					<Marker
						coordinate={{ latitude: 53.4756, longitude: -1.3306 }}
						title="Calverley Street"
						description="Busk location"
					/>
				</MapView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		paddingTop: StatusBar.currentHeight,
	},
	card: {
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
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
		color: "#666666",
	},
	map: {
		width: "100%",
		height: "100%",
	},
});

export default BuskerProfileScreen;
