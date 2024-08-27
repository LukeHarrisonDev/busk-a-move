import React from 'react';
import {
	Text,
	View,
	StyleSheet,
	ScrollView,
	Image,
	SafeAreaView,
	Pressable,
	ImageBackground,
} from 'react-native';

import colours from '../config/colours';

function HomeScreen({ navigation }) {
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
					<View style={styles.homeBlurbContainer}>
						<Text style={styles.homeBlurbText}>
							<Text>Welcome! </Text>
							Busk-A-Move app is a fun space for <Text>Buskers</Text> of all
							levels to connect and collaborate. Whether you are{' '}
							<Text>new to busking</Text> and eager to start, or a{' '}
							<Text>veteran Busker</Text> looking to share your music with
							fellow performers and passers-by, this app has you covered.
						</Text>
						<Text style={styles.paragraphText}>
							Just create an account to explore local busks, connect with other
							musicians, or kick off your own busking adventures.
						</Text>
						<Text style={styles.happyText}>Happy busking!</Text>
					</View>
					<View style={styles.buskersImgContainer}>
						<Image
							source={require('../assets/buskers-homepage-cold.png')}
							style={styles.buskersImg}
							resizeMode='contain'
						/>
					</View>
					<View style={styles.sessionButtonsContainer}>
						<Pressable
							style={styles.signUpButton}
							onPress={() => {
								navigation.navigate('SignUp');
							}}
						>
							<Text style={styles.signUpText}>SIGN UP</Text>
						</Pressable>
						<Pressable
							style={styles.logInButton}
							onPress={() => {
								navigation.navigate('Login');
							}}
						>
							<Text style={styles.logInText}>LOG IN</Text>
						</Pressable>
					</View>
				</ScrollView>
			</ImageBackground>
		</SafeAreaView>
	);
}

export default HomeScreen;

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
	},
	homeBlurbText: {
		marginBottom: 5,
		lineHeight: 24,
		color: colours.darkText,
		fontSize: 16,
	},
	paragraphText: {
		marginTop: 5,
		lineHeight: 24,
		color: colours.darkText,
		fontSize: 16,
	},
	happyText: {
		marginTop: 5,
		lineHeight: 24,
		color: colours.darkText,
		fontSize: 16,
	},
	buskersImgContainer: {
		width: '100%',
		height: 320,
		alignItems: 'center',
		position: 'relative',
	},
	buskersImg: {
		width: '100%',
		maxHeight: 320,
		aspectRatio: 1.7,
	},
	sessionButtonsContainer: {
		width: '95%',
		height: 110,
		display: 'flex',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		position: 'absolute',
		bottom: 80,
	},
	signUpButton: {
		width: '95%',
		backgroundColor: colours.primaryHighlight,
		padding: 15,
		alignSelf: 'center',
		alignItems: 'center',
		borderRadius: 5,
		marginVertical: 15,
	},
	signUpText: {
		color: colours.lightText,
		fontWeight: 'bold',
	},
	logInButton: {
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
	logInText: {
		color: colours.reverseLightText,
		fontWeight: 'bold',
	},
});
