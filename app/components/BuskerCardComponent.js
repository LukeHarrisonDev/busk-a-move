import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colours from '../config/colours';

function BuskerCardComponent({
	name,
	image,
	description,
	location,
	instruments,
	date,
}) {
	function truncateDescription(text, maxLength) {
		if (text.length > maxLength) {
			return text.substring(0, maxLength) + '...';
		}
		return text;
	}

	function formatDate(dateString) {
		const date = new Date(dateString);

		const formattedDate = date.toLocaleDateString('en-UK', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});

		const formattedTime = date.toLocaleTimeString('en-UK', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: false,
		});

		return `${formattedDate} at ${formattedTime}`;
	}

	return (
		<View style={styles.cardContainer}>
			<View style={styles.cardHeader}>
				<Image source={image} style={styles.cardImage} />
				<View style={styles.cardHeaderText}>
					<View style={styles.cardLocationContainer}>
						<Image
							source={require('../assets/location.png')}
							style={styles.cardLocationImg}
						/>
						<Text style={styles.cardLocationText}>{location}</Text>
					</View>
				</View>
			</View>
			<View style={styles.cardDateContainer}>
				<Image
					source={require('../assets/event.png')}
					style={styles.cardDateImg}
				/>
				<Text style={styles.cardDateText}>{formatDate(date)}</Text>
			</View>
			<View style={styles.cardInstrumentsContainer}>
				<Image
					source={require('../assets/instruments.png')}
					style={styles.cardInstrumentsImg}
				/>
				<Text style={styles.cardInstrumentsText}>{instruments}</Text>
			</View>
			<Text style={styles.cardDescription}>
				{truncateDescription(description, 100)}{' '}
			</Text>
			<Text style={styles.cardName}>
				Busk created by <Text style={styles.cardUsername}>{name}</Text>
			</Text>
		</View>
	);
}

export default BuskerCardComponent;

const styles = StyleSheet.create({
	cardContainer: {
		width: 310,
		backgroundColor: colours.primaryBackground,
		borderRadius: 10,
		padding: 15,
		marginVertical: 15,
		marginHorizontal: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
		elevation: 4,
		overflow: 'hidden',
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	cardImage: {
		width: 70,
		height: 70,
		borderRadius: 35,
		borderWidth: 2,
		borderColor: colours.primaryHighlight,
	},
	cardHeaderText: {
		marginLeft: 15,
	},
	cardName: {
		fontSize: 14,
		color: colours.darkText,
		marginLeft: 10,
	},
	cardUsername: {
		fontSize: 14,
		color: colours.darkText,
		fontStyle: 'italic',
		fontWeight: '600',
	},
	cardLocationContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: 5,
	},
	cardLocationImg: {
		width: 16,
		height: 16,
		marginRight: 5,
	},
	cardLocationText: {
		marginRight: 15,
		fontSize: 18,
		fontWeight: 'bold',
		color: colours.darkText,
	},
	cardDateContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	cardDateImg: {
		width: 16,
		height: 16,
		marginRight: 5,
	},
	cardDateText: {
		fontSize: 14,
		color: colours.darkText,
		marginRight: 5,
	},
	cardInstrumentsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	cardInstrumentsImg: {
		width: 16,
		height: 16,
		marginRight: 5,
	},
	cardInstrumentsText: {
		fontSize: 14,
		color: colours.darkText,
		marginRight: 5,
	},
	cardDescription: {
		fontSize: 14,
		fontStyle: 'italic',
		color: colours.darkText,
		marginVertical: 10,
		marginHorizontal: 10,
	},
});
