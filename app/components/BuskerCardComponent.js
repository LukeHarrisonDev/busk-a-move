import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function BuskerCardComponent({
	name,
	image,
	description,
	location,
	instruments,
}) {
	return (
		<View style={styles.cardContainer}>
			<Image source={image} style={styles.cardImage} />
			<Text style={styles.cardName}>{name}</Text>
			<Text style={styles.cardDescription}>{location}</Text>
			<Text style={styles.cardDescription}>{description}</Text>
			<Text style={styles.cardDescription}>{instruments}</Text>
		</View>
	);
}

export default BuskerCardComponent;

const styles = StyleSheet.create({
	cardContainer: {
		backgroundColor: '#fff',
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
		width: 200,
		height: 150,
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
