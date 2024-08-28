import { useEffect, useState } from "react";
import { fetchAllUsers } from "../api";
import {
	Text,
	View,
	Image,
	SafeAreaView,
	ActivityIndicator,
	FlatList,
	StatusBar,
	StyleSheet,
	Pressable,
} from "react-native";
import colours from "../config/colours";
// import { TouchableWithoutFeedback } from "react-native-web";

function AllBuskersScreen({ navigation }) {
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
			setBuskersList(response.users);
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
						const instruments = item.instruments.join(", ");
						return (
							<Pressable
							onPress={() => {
								navigation.navigate("BuskerProfile", { id: item.user_id });
							}}>
								<View style={styles.card} >
									<Text
										
										style={styles.titleText}
									>
										{item.username}
									</Text>
									<Text style={styles.bodyText}>{item.full_name}</Text>
									<Text style={styles.bodyText}>{item.user_location}</Text>
									<Image
										style={styles.userImage}
										source={{ uri: item.user_image_url }}
									/>
									<Text style={styles.titleText}>Instruments:</Text>
									<Text style={styles.bodyText}>{instruments}</Text>
								</View>
							</Pressable>
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
		backgroundColor: colours.secondaryBackground,
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
		alignItems: "center",
	},
	titleText: {
		fontSize: 20,
		color: colours.primaryHighlight,
		fontWeight: "bold",
	},
	bodyText: {
		fontSize: 18,
		color: colours.primaryHighlight,
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
	userImage: {
		width: 80,
		height: 80,
	},
});

export default AllBuskersScreen;
