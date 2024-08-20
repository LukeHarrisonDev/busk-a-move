import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetchAllUsers } from "../api";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ActivityIndicator,
	FlatList,
	StatusBar,
	StyleSheet,
} from "react-native-web";

function AllBuskersScreen() {
	const [buskersList, setBuskersList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchAllUsers();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchAllUsers().then((response) => {
			setBuskersList(response);
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
		<SafeAreaView style={styles.container}>
			<View style={styles.listContainer}>
				<FlatList
					data={buskersList}
					renderItem={({ item }) => {
						return (
							<View style={styles.card}>
								<Text style={styles.titleText}>{item.username}</Text>
								<Text style={styles.titleText}>{item.address.city}</Text>
								<Text style={styles.titleText}>{item.address.geo.lat}</Text>
								<Text style={styles.titleText}>{item.address.geo.lng}</Text>
							</View>
						);
					}}
					ItemSeparatorComponent={() => (
						<View
							style={{
								height: 16,
							}}
						></View>
					)}
					ListEmptyComponent={<Text>No Buskers Found</Text>}
					ListHeaderComponent={
						<Text style={styles.headerText}>Buskers List</Text>
					}
					ListFooterComponent={
						<Text style={styles.footerText}>End of list</Text>
					}
					refreshing={refreshing}
					onRefresh={handleRefresh}
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
	listContainer: {
		flex: 1,
		paddingHorizontal: 16,
	},
	card: {
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
	},
	titleText: {
		fontSize: 30,
	},
	bodyText: {
		fontSize: 24,
		color: "#666666",
	},
	headerText: {
		fontSize: 24,
		textAlign: "center",
		marginBottom: 12,
		paddingTop: 10,
	},
	footerText: {
		fontSize: 24,
		textAlign: "center",
		marginTop: 12,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: "F5F5F5",
		paddingTop: StatusBar.currentHeight,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default AllBuskersScreen;
