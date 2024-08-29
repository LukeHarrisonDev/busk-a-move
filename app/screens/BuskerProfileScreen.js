import { useEffect, useState } from "react";
import { fetchSingleBusker } from "../api";
import {
	Text,
	Image,
	View,
	SafeAreaView,
	ActivityIndicator,
	StatusBar,
	StyleSheet,
	ScrollView,
	Pressable,
} from "react-native";
import colours from "../config/colours";

function BuskerProfileScreen({ route, navigation }) {
	const { id } = route.params;
	const [singleBusker, setSingleBusker] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchSingleBusker(id).then((response) => {
			setSingleBusker(response);
			setIsLoading(false);
		});
	}, [id]);

	if (isLoading) {
		return (
			<SafeAreaView style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#0000ff" />
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	const buksersInstruments = singleBusker.instruments.join(", ");

	const backgroundOptions = [
		colours.firstBackground,
		colours.secondBackground,
		colours.thirdBackground,
		colours.fourthBackground,
	];
	const backgroundColor =
		backgroundOptions[Math.floor(Math.random() * 4) % backgroundOptions.length];

	return (
		<SafeAreaView style={styles.container}>
			{/* <ScrollView> */}
			{/* contentContainerStyle={styles.scrollContainer} */}
			{/* //Here */}
			<View style={styles.buskerCard}>
				<View style={[styles.buskerImgContainer, { backgroundColor }]}>
					<View style={styles.buskerImgWrapper}>
						<Image
							style={styles.buskerImg}
							source={{ uri: singleBusker.user_image_url }}
						/>
					</View>
				</View>
				<Text style={styles.buskerUsername}>{singleBusker.username}</Text>
				<View style={styles.buskerLocationContainer}>
					<Image
						source={require("../assets/location.png")}
						style={styles.buskerCardIcon}
					/>
					<Text style={styles.buskerLocation}>
						{singleBusker.user_location}
					</Text>
				</View>
				<View style={styles.buskerInstrumentsContainer}>
					<Image
						source={require("../assets/instruments.png")}
						style={styles.buskerCardIcon}
					/>
					<Text style={styles.bodyText}>{buksersInstruments}</Text>
				</View>
				<View style={styles.buskerAboutMeContainer}>
					<Text style={styles.sectionTitle}>About Me: </Text>
					<Text style={styles.bodyText}>{singleBusker.user_about_me}</Text>
				</View>
			</View>
			{/* here */}
			{/* <View style={styles.container}>
						<Text style={styles.headerText}></Text>
						<Text style={styles.name}>{singleBusker.full_name}</Text>
						<View style={styles.profileInfo}>
							<Image
								style={styles.avatar}
								source={{ uri: singleBusker.user_image_url }}
							/>
							<View style={styles.infoContainer}>
								<Text style={styles.location}>
									Location: {singleBusker.user_location}
								</Text>
							</View>
						</View>

						<View style={styles.section}>
							<Text style={styles.sectionTitle}>About Me: </Text>
							<Text style={styles.bodyText}>{singleBusker.user_about_me}</Text>
						</View>

						<View style={styles.section}>
							<Text style={styles.sectionTitle}>My Setup:</Text>
							<Text style={styles.bodyText}>{buksersInstruments}</Text>
						</View> */}

			{/* </View> */}
			{/* </ScrollView> */}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	buskerImgContainer: {
		width: "100%",
		height: 150,
		marginBottom: 80,
	},
	buskerImgWrapper: {
		width: "100%",
		height: 160,
		position: "absolute",
	},
	buskerImg: {
		margin: "auto",
		width: 130,
		height: 130,
		borderRadius: 55,
		borderWidth: 5,
		borderColor: colours.primaryBackground,
		position: "relative",
		top: 60,
	},
	buskerLocationContainer: {
		marginTop: 20,
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 10,
	},
	buskerInstrumentsContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 10,
	},
	buskerAboutMeContainer: {
		flexDirection: "column",
		alignItems: "center",
		marginVertical: 10,
	},
	buskerCardIcon: {
		width: 20,
		height: 20,
		marginRight: 5,
	},
	buskerCard: {
		flex: 1,
		marginTop: 20,
		marginBottom: 5,
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 4,
	},
	buskerUsername: {
		fontSize: 24,
		fontWeight: "bold",
		color: colours.darkText,
	},
	buskerLocation: {
		fontSize: 24,
	},
	buskersListWrapper: {
		flex: 1,
		backgroundColor: colours.primaryBackground,
		paddingTop: StatusBar.currentHeight,
	},
	// scrollContainer: {
	// 	paddingBottom: 20,
	// },
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: "#fff",
	},
	// headerText: {
	// 	fontSize: 24,
	// 	color: colours.primaryHighlight,
	// 	fontWeight: "bold",
	// 	textAlign: "center",
	// 	marginBottom: 20,
	// },
	// name: {
	// 	fontSize: 22,
	// 	textAlign: "center",
	// 	marginBottom: 10,
	// 	fontWeight: "bold",
	// },
	// profileInfo: {
	// 	flexDirection: "row",
	// 	alignItems: "center",
	// 	marginBottom: 20,
	// },
	// avatar: {
	// 	width: 80,
	// 	height: 80,
	// 	borderRadius: 40,
	// 	marginRight: 20,
	// 	borderWidth: 1,
	// 	borderColor: colours.primaryHighlight,
	// },
	// infoContainer: {
	// 	flex: 1,
	// },
	// location: {
	// 	marginTop: 30,
	// 	fontSize: 16,
	// 	color: "#555",
	// },
	// section: {
	// 	marginBottom: 20,
	// },
	sectionTitle: {
		fontSize: 22,
		marginBottom: 10,
		fontWeight: "bold",
	},
	bodyText: {
		fontSize: 24,
		color: "#333",
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
	buskButton: {
		backgroundColor: colours.primaryHighlight,
		color: colours.lightText,
		padding: 15,
		alignItems: "center",
		borderRadius: 5,
		marginTop: 36,
	},
	buskButtonText: {
		color: colours.lightText,
	},
});

export default BuskerProfileScreen;
