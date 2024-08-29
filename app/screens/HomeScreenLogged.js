import React from 'react';
import { useEffect, useState } from 'react';
import {
	Text,
	View,
	StyleSheet,
	ScrollView,
	Image,
	SafeAreaView,
	ImageBackground,
	FlatList,
	Dimensions,
	Pressable,
} from 'react-native';
import CarouselComponent from '../components/CarouselComponent';
import { fetchAllBusks } from '../api';
import colours from '../config/colours';

const { width } = Dimensions.get('window');

function HomeScreenLogged({ navigation }) {
	const [busks, setBusks] = useState([]);

	useEffect(() => {
		fetchAllBusks().then((res) => {
			setBusks(res.busks);
		});
	}, []);

	const formatInstruments = (instrumentsArray) => {
		if (!instrumentsArray || instrumentsArray.length === 0) return '';
		const formattedInstruments = instrumentsArray.map((instrument, index) =>
			index === 0 ? instrument : instrument.toLowerCase()
		);
		return formattedInstruments.join(', ');
	};

	const renderBusker = ({ item }) => (
		<CarouselComponent
			name={item.username}
			location={item.busk_location_name}
			date={item.busk_time_date}
			image={{ uri: item.user_image_url }}
			description={item.busk_about_me}
			instruments={formatInstruments(item.busk_selected_instruments)}
		/>
	);

	return (
		<SafeAreaView style={styles.homeContainer}>
			<ImageBackground
				source={require('../assets/busk-bck.png')}
				style={styles.homeBckImg}
			>
				<ScrollView contentContainerStyle={styles.homeWrapper}>
					<View style={styles.headerContainer}>
						<Image
							style={styles.headerImg}
							source={require('../assets/busk-a-move-header.png')}
						/>
					</View>
					<View style={styles.sloganContainer}>
						<View style={styles.guitarristImgContainer}>
							<Image
								source={require('../assets/guitarrist.png')}
								style={styles.guitarristImg}
								resizeMode='contain'
							/>
						</View>
						<View style={styles.homeBlurbContainer}>
							<Text style={styles.homeBlurbText}>
								Connect with fellow Buskers, share your passion, and make every
								performance unforgettable!
							</Text>
						</View>
						<View style={styles.singerImgContainer}>
							<Image
								source={require('../assets/singer.png')}
								style={styles.singerImg}
								resizeMode='contain'
							/>
						</View>
					</View>
					<View style={styles.carouselContainer}>
						<Text style={styles.carouselHeader}>DISCOVER BUSKS</Text>
						<View style={styles.carouselWrapper}>
							<View style={styles.carouselTextContainer}>
								<Pressable
									style={styles.linkContainer}
									onPress={() => navigation.navigate('Busks')}
								>
									<Text style={styles.linkText}>See more Busks</Text>
								</Pressable>
							</View>
							<FlatList
								data={busks}
								renderItem={renderBusker}
								keyExtractor={(item, index) => index.toString()}
								horizontal
								showsHorizontalScrollIndicator={false}
								snapToInterval={width * 0.8 + 20}
								decelerationRate='fast'
								bounces={false}
							/>
						</View>
					</View>
				</ScrollView>
			</ImageBackground>
		</SafeAreaView>
	);
}

export default HomeScreenLogged;

const styles = StyleSheet.create({
	homeContainer: {
		width: '100%',
		height: '100vh',
		paddingTop: 30,
		flex: 1,
		backgroundColor: colours.secondaryBackground,
	},
	homeBckImg: {
		flex: 1,
		resizeMode: 'contain',
	},
	homeWrapper: {
		alignItems: 'center',
	},
	headerContainer: {
		width: '100%',
		height: 90,
		marginTop: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerImg: {
		width: 280,
		height: 45,
	},
	sloganContainer: {
		height: 650,
		position: 'relative',
	},
	guitarristImgContainer: {
		width: '100%',
		height: 220,
		position: 'absolute',
		top: -15,
		left: -100,
		marginVertical: 20,
	},
	guitarristImg: {
		width: '80%',
		maxHeight: 320,
		aspectRatio: 1.7,
	},
	homeBlurbContainer: {
		width: '92%',
		backgroundColor: colours.primaryBackground,
		borderRadius: 30,
		marginVertical: 8,
		paddingVertical: 22,
		paddingHorizontal: 22,
		alignSelf: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 8,
		position: 'absolute',
		top: 220,
	},
	homeBlurbText: {
		marginBottom: 5,
		lineHeight: 24,
		color: colours.darkText,
		fontSize: 16,
	},
	singerImgContainer: {
		width: '100%',
		height: 300,
		position: 'relative',
		marginVertical: 20,
		top: 300,
		right: -80,
	},
	singerImg: {
		width: '80%',
		maxHeight: 300,
		aspectRatio: 1.7,
	},
	carouselContainer: {
		minHeight: 380,
		marginVertical: 40,
	},
	carouselHeader: {
		fontSize: 23,
		fontWeight: 'bold',
		color: colours.lightText,
		textAlign: 'center',
		textShadowColor: '#000000',
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 8,
		shadowOpacity: 1,
		shadowColor: '#000000',
		shadowOffset: { width: 1, height: 1 },
		shadowRadius: 8,
	},
	carouselWrapper: {
		height: 400,
		paddingTop: 10,
		paddingBottom: 20,
		marginVertical: 20,
		backgroundColor: colours.mediumOpacityShade,
	},
	carouselTextContainer: {
		width: '100%',
		height: 35,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	linkContainer: {
		width: 150,
		height: 40,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		marginRight: 10,
		marginTop: 20,
	},
	linkText: {
		textDecorationLine: 'underline',
		textDecorationColor: colours.darkText,
		fontSize: 16,
	},
});
