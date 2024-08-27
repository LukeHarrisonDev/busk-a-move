import { useEffect, useState } from 'react';
// import RNPickerSelect from 'react-native-picker-select';
import {Picker} from '@react-native-picker/picker';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { fetchAllBusks } from '../api';
import colours from '../config/colours';

function BuskSearchComponent({ setBusksList }) {
	const [isLoading, setIsLoading] = useState(true);
	const [listOfIntruments, setListOfInstruments] = useState([]);
    const [currentInstrument, setCurrentInstrument] = useState([])
    
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
    
    function handlePickerSelector(value) {
        console.log(value)
        setCurrentInstrument(value)
    }

    function handleInstrumentChange(value) {
        fetchAllBusks(value).then((response) => {
            setIsLoading(true);
            const busks = response.busks;
            setBusksList(busks);
        });
    }

	const selectInstrumentData = [];

	listOfIntruments.forEach((instrument) => {
		selectInstrumentData.push({ label: instrument, value: instrument });
	});
	// console.log(selectInstrumentData, '<<< LOI');

	return (
		<View style={styles.filterContainer}>
			{/* <RNPickerSelect
				style={styles.picker}
				onValueChange={handleInstrumentChange}
				placeholder={{ label: 'Instrument Filter', value: null }}
				items={selectInstrumentData}
			/> */}
            <Picker selectedValue={currentInstrument} onValueChange={handlePickerSelector}>
                {listOfIntruments.map((instrument) => {
                    {console.log(instrument.toLowerCase())}
                    <Picker.Item label={instrument.toLowerCase()} value={instrument.toLowerCase()}/>
                })}
                {/* <Picker.Item
                    // {listOfIntruments.map}
                    label='Time: Newest - Oldest (Default)'
					value='?sort_by=busk_time_date&order=desc'/>
                     <Picker.Item
                    label='Time: 2'
					value='?sort_by=busk_time_date&order=asc'/>
                     <Picker.Item
                    label='Time: 3'
					value='?sortjhg'/> */}
            </Picker>
			{/* <RNPickerSelect
				style={styles.picker}
				onValueChange={handleInstrumentChange}
				placeholder={{ label: 'Sort By', value: null }}
				items={[
					{
						label: 'Time: Newest - Oldest (Default)',
						value: '?sort_by=busk_time_date&order=desc',
					}, //// Is this right? ////
					{
						label: 'Time: Oldest - Newest',
						value: '?sort_by=busk_time_date&order=asc',
					},
					{
						label: 'Location: A-Z',
						value: '?sort_by=busk_location_name&order=asc',
					},
					{
						label: 'Location: Z-A',
						value: '?sort_by=busk_location_name&order=desc',
					},
					{ label: 'Username: A-Z', value: '?sort_by=username&order=asc' },
					{ label: 'Username: Z-A', value: '?sort_by=username&order=desc' },
				]}
			/> */}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		paddingTop: StatusBar.currentHeight,
	},
	filterContainer: {
		padding: 5,
		backgroundColor: colours.secondaryBackground,
		borderWidth: 3,
		borderColor: colours.primaryHighlight,

		marginHorizontal: 90, //Temporary, since the thing will not go to the centre.
		maxWidth: 200,
	},
	picker: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 3,
		borderColor: 'gray',
		borderRadius: 4,
		color: 'black',
		paddingRight: 30,
	},
	loadingContainer: {
		flex: 1,
		backgroundColor: 'F5F5F5',
		paddingTop: StatusBar.currentHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default BuskSearchComponent;
