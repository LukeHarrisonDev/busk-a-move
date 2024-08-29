import { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { fetchAllBusks } from '../api';
import colours from '../config/colours';
import { Text } from 'react-native';

function BuskSearchComponent({
	sortBy,
	setSortBy,
	instrumentFilter,
	setInstrumentFilter,
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [listOfIntruments, setListOfInstruments] = useState([]);

	// This is to populate the list with existing instruments
	useEffect(() => {
		fetchAllBusks().then((response) => {
			setIsLoading(true);
			const busks = response.busks;
			let listOfIntruments = [];
			busks.forEach((busk) => {
				listOfIntruments.push(busk.busk_selected_instruments);
			});
			const uniqueInstruments = [...new Set(listOfIntruments.flat().sort())];
			setListOfInstruments(uniqueInstruments);
			setIsLoading(false);
		});
	}, []);

	function handleInstrumentChange(value) {
		setInstrumentFilter(value);
	}

	function handleSortByChange(value) {
		setSortBy(value);
	}

	return (
		<View style={styles.filterContainer}>
			<Text style={styles.label}>Filter by instrument: </Text>
			<View style={styles.pickerContainer}>
				<Picker
					selectedValue={instrumentFilter}
					onValueChange={handleInstrumentChange}
					style={styles.picker}
					mode='dropdown'
				>
					<Picker.Item label='All' value='' />
					{listOfIntruments.map((instrument) => (
						<Picker.Item
							key={instrument}
							label={instrument}
							value={instrument}
						/>
					))}
				</Picker>
			</View>
			<Text style={styles.label}>Sort by: </Text>
			<View style={styles.pickerContainer}>
				<Picker
					selectedValue={sortBy}
					onValueChange={handleSortByChange}
					style={styles.picker}
					mode='dropdown'
				>
					<Picker.Item
						label='Time: Newest - Oldest (Default)'
						value='?sort_by=busk_time_date&order=desc'
					/>
					<Picker.Item
						label='Time: Oldest - Newest'
						value='?sort_by=busk_time_date&order=asc'
					/>
					<Picker.Item
						label='Location: A-Z'
						value='?sort_by=busk_location_name&order=asc'
					/>
					<Picker.Item
						label='Location: Z-A'
						value='?sort_by=busk_location_name&order=desc'
					/>
					<Picker.Item
						label='Username: A-Z'
						value='?sort_by=username&order=asc'
					/>
					<Picker.Item
						label='Username: Z-A'
						value='?sort_by=username&order=desc'
					/>
				</Picker>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	filterContainer: {
		width: 395,
		padding: 15,
	},
	pickerContainer: {
		marginBottom: 15,
		backgroundColor: colours.lightText,
		borderRadius: 8,
		borderWidth: 1.3,
		borderColor: colours.darkText,
	},
	picker: {
		fontSize: 16,
		color: colours.primaryText,
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: '#F5F5F5',
		paddingTop: StatusBar.currentHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	label: {
		marginBottom: 10,
	},
});

export default BuskSearchComponent;
