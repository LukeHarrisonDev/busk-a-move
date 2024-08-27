import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const BuskerCard = ({ name, image, description }) => {
	return (
		<View style={styles.cardContainer}>
			<Image source={image} style={styles.cardImage} />
			<Text style={styles.cardName}>{name}</Text>
			<Text style={styles.cardDescription}>{description}</Text>
		</View>
	);
};

export default BuskerCard;

const styles = StyleSheet.create({
	cardContainer: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 15,
		marginLeft: 25,
		marginRight: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 6,
		elevation: 8,
	},
	cardImage: {
		width: '100%',
		height: 150,
		borderRadius: 10,
	},
	cardName: {
		marginTop: 10,
		fontSize: 18,
		fontWeight: 'bold',
	},
	cardDescription: {
		marginTop: 5,
		fontSize: 14,
		color: '#333',
	},
});
