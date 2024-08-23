import { useEffect, useState } from "react";
import { fetchSingleBusk } from "../api";
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

function SingleBusk({ route }) {
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
				<Text style={styles.bodyText}>{singleBusk.busk_about_me}</Text>
				<MapView
					style={styles.map}
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: singleBusk.busk_location.latitude,
						longitude: singleBusk.busk_location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
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
export default SingleBusk;
