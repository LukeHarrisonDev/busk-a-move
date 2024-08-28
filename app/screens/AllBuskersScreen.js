import { useEffect, useState } from 'react';
import { fetchAllUsers } from '../api';
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
} from 'react-native';
import colours from '../config/colours';

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
				<ActivityIndicator size='large' color='0000ff' />
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	const backgroundOptions = [
		colours.firstBackground,
		colours.secondBackground,
		colours.thirdBackground,
		colours.fourthBackground,
	];

	return (
		<SafeAreaView style={styles.buskersListContainer}>
			<View style={styles.buskersListWrapper}>
				<FlatList
					data={buskersList}
					renderItem={({ item, index }) => {
						const instruments = item.instruments.join(', ');
						const backgroundColor =
							backgroundOptions[index % backgroundOptions.length];

						return (
							<Pressable
								onPress={() => {
									navigation.navigate('BuskerProfile', { id: item.user_id });
								}}
							>
								<View style={styles.buskerCard}>
									<View
										style={[styles.buskerImgContainer, { backgroundColor }]}
									>
										<View style={styles.buskerImgWrapper}>
											<Image
												style={styles.buskerImg}
												source={{ uri: item.user_image_url }}
											/>
										</View>
									</View>
									<Text style={styles.buskerUsername}>{item.username}</Text>
									<View style={styles.buskerLocationContainer}>
										<Image
											source={require('../assets/location.png')}
											style={styles.buskerCardIcon}
										/>
										<Text style={styles.buskerLocation}>
											{item.user_location}
										</Text>
									</View>
									<View style={styles.buskerInstrumentsContainer}>
										<Image
											source={require('../assets/instruments.png')}
											style={styles.buskerCardIcon}
										/>
										<Text style={styles.bodyText}>{instruments}</Text>
									</View>
									<Pressable
										onPress={() => {
											navigation.navigate('BuskerProfile', {
												id: item.user_id,
											});
										}}
										style={styles.buskerProfileButton}
									>
										<Text style={styles.buskerProfileText}>SEE PROFILE</Text>
									</Pressable>
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
	buskersListContainer: {
		backgroundColor: '#FCF8FC',
		flex: 1,
		paddingHorizontal: 16,
	},
	buskersListWrapper: {
		flex: 1,
		backgroundColor: colours.primaryBackground,
		paddingTop: StatusBar.currentHeight,
	},
	buskerCard: {
		backgroundColor: 'white',
		padding: 16,
		borderRadius: 8,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 4,
	},
	buskerUsername: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colours.darkText,
	},
	buskerLocation: {
		fontSize: 18,
	},
	headerText: {
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 12,
		paddingTop: 10,
	},
	footerText: {
		fontSize: 24,
		textAlign: 'center',
		marginTop: 12,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		paddingTop: StatusBar.currentHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buskerImgContainer: {
		width: '100%',
		height: 120,
		marginBottom: 60,
	},
	buskerImgWrapper: {
		width: '100%',
		height: 120,
		position: 'absolute',
	},
	buskerImg: {
		margin: 'auto',
		width: 90,
		height: 90,
		borderRadius: 55,
		borderWidth: 5,
		borderColor: colours.primaryBackground,
		position: 'relative',
		top: 60,
	},
	buskerLocationContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	buskerInstrumentsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	buskerCardIcon: {
		width: 20,
		height: 20,
		marginRight: 5,
	},
	buskerProfileButton: {
		width: '95%',
		backgroundColor: colours.reversePrimaryHiglight,
		padding: 15,
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 5,
		marginVertical: 15,
		borderWidth: 2,
		borderColor: colours.primaryHighlight,
	},
	buskerProfileText: {
		color: colours.reverseLightText,
		fontWeight: 'bold',
	},
});

export default AllBuskersScreen;
