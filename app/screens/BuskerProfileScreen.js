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
				<Text style={styles.bodyText}>{singleBusker.address.city}</Text>
				<Text style={styles.bodyText}>{singleBusker.address.geo.lat}</Text>
				<Text style={styles.bodyText}>{singleBusker.address.geo.lng}</Text>
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
});

export default BuskerProfileScreen;
