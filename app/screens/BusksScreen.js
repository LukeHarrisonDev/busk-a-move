import { useEffect, useState } from "react";
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
	ScrollView
} from "react-native";
import { fetchAllBusks } from "../api";
import { PROVIDER_GOOGLE } from "react-native-maps";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import BuskSearchComponent from "../components/BuskSearchComponent";
import colours from "../config/colours";
import { formatDate, formatTime } from "../assets/utils/date-and-time";

function BusksScreen({ navigation }) {
	const [busksList, setBusksList] = useState([]);
	const [sortBy, setSortBy] = useState("")
	const [instrumentFilter, setInstrumentFilter] = useState("")
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [mapLocations, setMapLocations] = useState([])

	const handleRefresh = () => {
		setRefreshing(true);
		fetchAllBusks();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchAllBusks(instrumentFilter, sortBy).then((response) => {
			setBusksList(response.busks);
			const listOfMapLocations = []
			busksList.forEach((busk) => {
				locationAndNameObject = busk.busk_location
				locationAndNameObject.locationName = busk.busk_location_name
				listOfMapLocations.push(locationAndNameObject)
			})
			setMapLocations(listOfMapLocations)
			setIsLoading(false)
		});
	}, [instrumentFilter, sortBy]);

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
				<FlatList
				ListHeaderComponent={
				<View>
					<View style={styles.filterContainer}>
						<BuskSearchComponent sortBy={sortBy} setSortBy={setSortBy} instrumentFilter={instrumentFilter} setInstrumentFilter={setInstrumentFilter}/>
					</View>
					<View style={styles.mapContainer}>
						<MapView
							style={styles.map}
							provider={PROVIDER_GOOGLE}
							initialRegion={{
								latitude: 53.801468,
								longitude: Number(-1.549067),
								latitudeDelta: 0.0102,
								longitudeDelta: 0.0101,
							}}>
							{mapLocations.map((marker, index) => {
								return (
									<Marker
									key={index}
									coordinate={{
										latitude: marker.latitude,
										longitude: marker.longitude,
									}}
									title={marker.locationName}
									description="Busk location"/>
								)
							})}
						</MapView>
					</View>
							</View>}
					data={busksList}
					renderItem={({ item }) => {
						const instruments = item.busk_selected_instruments.join(", ")

						return (
							<TouchableWithoutFeedback onPress={() => {
								navigation.navigate("SingleBusk", { id: item.busk_id });
							}}>
								<View style={styles.card}>
								<Image style={styles.cardImage}source={{uri: item.user_image_url}}/>
										<Text style={styles.titleText}>
											{item.username} @ {item.busk_location_name} @ {formatTime(item.busk_time_date)} on {formatDate(item.busk_time_date)}
										</Text>
										<View style={styles.bodyContainer}>
										<Text style={styles.bodyText}>Intruments: {`\n`} {instruments} {`\n`}{`\n`} Buskers Setup: {`\n`} {item.busk_setup}</Text>
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
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		paddingTop: StatusBar.currentHeight,
		flexDirection: "column",
		alignItems: "center"
	},
	filterContainer: {
		flexDirection: "column",
		alignItems: "center"
	},
	card: {
		width: "95%",
		aspectRatio: 1/1,
		backgroundColor: colours.secondaryBackground,
		padding: 16,
		borderRadius: 15,
		borderWidth: 5,
		borderColor: colours.primaryHighlight,
	},
	cardImage: {
		margin: 16,
		opacity: 0.2,
		width: "100%",
		aspectRatio: 1/1,
		position: "absolute",
	},
	titleText: {
		fontSize: 25,
	},
	bodyText: {
		fontSize: 20,
		color: colours.darkHighlight,
		textAlign: "right",

	},
	bodyContainer: {
		margin: 16,
		width: "100%",
		aspectRatio: 1/1,
		position: "absolute",
		alignItems: "flex-end",
		justifyContent: "flex-end"

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
	mapContainer: {
		flexDirection: "column",
		alignItems: "center",
		margin: 10,
		border: colours.darkTabBar,
		borderWidth: 5,
	},
	map: {
		width: 364,
		height: 250
	},
});

export default BusksScreen;
