import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
	ActivityIndicator,
	Button,
	FlatList,
	StatusBar,
	StyleSheet,
} from "react-native-web";
import { fetchAllBusks } from "../api";

function BusksScreen({ navigation }) {
	const [busksList, setBusksList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = () => {
		setRefreshing(true);
		fetchAllBusks();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchAllBusks().then((response) => {
			setBusksList(response);
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
				<Button
					title="Create Busk"
					onPress={() => {
						navigation.navigate("SingleBusk");
					}}
				/>
				<FlatList
					data={busksList}
					renderItem={({ item }) => {
						return (
							<View style={styles.card}>
								<Text style={styles.titleText}>{item.title}</Text>
								<Text style={styles.titleText}>{item.body}</Text>
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
					ListEmptyComponent={<Text>No Busks Found</Text>}
					ListHeaderComponent={
						<Text style={styles.headerText}>Busks List</Text>
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

export default BusksScreen;
