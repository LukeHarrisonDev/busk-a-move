import { useEffect, useState } from 'react';
import {Picker} from '@react-native-picker/picker';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { fetchAllBusks } from '../api';
import colours from '../config/colours';

function BuskSearchComponent({ setBusksList, sortBy, setSortBy, instrumentFilter, setInstrumentFilter }) {
	const [isLoading, setIsLoading] = useState(true);
	const [listOfIntruments, setListOfInstruments] = useState([]);
    // const [currentInstrument, setCurrentInstrument] = useState("")
    
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
        // fetchAllBusks(value).then((response) => {
        //     setIsLoading(true);
        //     const busks = response.busks;
        //     setBusksList(busks);
            setInstrumentFilter(value)
        // });
    }

	return (
		<View style={styles.filterContainer}>
            <Picker 
                selectedValue={instrumentFilter}
                onValueChange={handleInstrumentChange}>
                    <Picker.Item label="All"
					    value=""/>
                {listOfIntruments.map((instrument) => {
                    return <Picker.Item 
                        key={instrument}
                        label={instrument}
					    value={instrument} />
                })}
            </Picker>
            <Picker
			selectedValue={sortBy}
			// onValueChange={handleSortByChange}
			>
                <Picker.Item label="Time: Newest - Oldest (Default)" value="?sort_by=busk_time_date&order=desc"/>
                <Picker.Item label="Time: Oldest - Newest" value="?sort_by=busk_time_date&order=asc"/>
                <Picker.Item label="Location: A-Z" value="?sort_by=busk_location_name&order=asc"/>
                <Picker.Item label="Location: Z-A" value="?sort_by=busk_location_name&order=desc"/>
                <Picker.Item label="Username: A-Z" value="?sort_by=username&order=asc"/>
                <Picker.Item label="Username: Z-A" value="?sort_by=username&order=desc"/>
            </Picker>
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
		borderWidth: 5,
        margin: 10,
		borderColor: colours.primaryHighlight,
        width: 350,
		maxWidth: "100%",
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
